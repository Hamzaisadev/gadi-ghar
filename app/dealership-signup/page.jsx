"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, CheckCircle, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { submitDealershipApplication, checkUserApplicationStatus } from "@/app/actions/dealership";
import { uploadLogo } from "@/lib/client-utils";

const dealershipFormSchema = z.object({
  dealershipName: z.string().min(2, "Dealership name must be at least 2 characters"),
  businessLicense: z.string().min(1, "Business license is required"),
  businessAddress: z.string().min(10, "Business address must be at least 10 characters"),
  businessPhone: z.string().min(10, "Business phone must be at least 10 characters"),
  businessEmail: z.string().email("Invalid business email"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerPhone: z.string().min(10, "Owner phone must be at least 10 characters"),
  ownerEmail: z.string().email("Invalid owner email"),
  businessType: z.enum(["INDIVIDUAL", "PARTNERSHIP", "CORPORATION", "FRANCHISE"]),
  yearsInBusiness: z.string().refine((val) => {
    const years = parseInt(val);
    return !isNaN(years) && years >= 0 && years <= 100;
  }, "Valid years in business required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  logo: z.any().optional(),
  workingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string()
    })
  })
});

export default function DealershipSignupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [workingHours, setWorkingHours] = useState({
    monday: { isOpen: false, openTime: "", closeTime: "" },
    tuesday: { isOpen: false, openTime: "", closeTime: "" },
    wednesday: { isOpen: false, openTime: "", closeTime: "" },
    thursday: { isOpen: false, openTime: "", closeTime: "" },
    friday: { isOpen: false, openTime: "", closeTime: "" },
    saturday: { isOpen: false, openTime: "", closeTime: "" },
    sunday: { isOpen: false, openTime: "", closeTime: "" }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm({
    resolver: zodResolver(dealershipFormSchema),
    defaultValues: {
      dealershipName: "",
      businessLicense: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      businessType: "",
      yearsInBusiness: "",
      description: "",
      logo: null,
      workingHours: workingHours
    }
  });

  const watchedFields = watch();

  // Check application status on component mount
  useEffect(() => {
    checkApplicationStatus();
  }, []);

  // Check for status changes every 30 seconds (reduced frequency)
  useEffect(() => {
    // Only start polling if user has an application
    if (!applicationStatus) return;

    const interval = setInterval(async () => {
      try {
        const result = await checkUserApplicationStatus();
        if (result.success && result.data && result.data.status !== 'NO_APPLICATION') {
          // Check if status has changed
          if (applicationStatus && applicationStatus.status !== result.data.status) {
            // Show notification for status change
            if (result.data.status === 'APPROVED') {
              toast.success("🎉 Your dealership application has been approved!", {
                description: "You can now access your dealership dashboard.",
                duration: 10000,
              });
            } else if (result.data.status === 'REJECTED') {
              toast.error("Your dealership application has been rejected.", {
                description: "Please check the review notes and apply again.",
                duration: 10000,
              });
            } else if (result.data.status === 'REQUIRES_CHANGES') {
              toast.warning("Your application requires changes.", {
                description: "Please review the feedback and update your application.",
                duration: 10000,
              });
            } else if (result.data.status === 'UNDER_REVIEW') {
              toast.info("Your application is now under review.", {
                description: "We'll notify you once the review is complete.",
                duration: 5000,
              });
            }
            setApplicationStatus(result.data);
          }
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    }, 30000); // Increased to 30 seconds

    return () => clearInterval(interval);
  }, [applicationStatus]);

  const checkApplicationStatus = async () => {
    try {
      const result = await checkUserApplicationStatus();
      if (result.success) {
        // Only set application status if there's an actual application
        if (result.data.status !== 'NO_APPLICATION') {
          setApplicationStatus(result.data);
        } else {
          setApplicationStatus(null);
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setValue("logo", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setValue("logo", null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Handle logo upload on client side if a logo was selected
      let logoUrl = null;
      if (logo && logo instanceof File) {
        try {
          logoUrl = await uploadLogo(logo);
        } catch (error) {
          console.error('Error uploading logo:', error);
          toast.error('Failed to upload logo. Please try again or submit without logo.');
          setIsSubmitting(false);
          return;
        }
      }

      // Create the data object with the logo URL
      const submissionData = {
        ...data,
        logo: logoUrl,
        workingHours: workingHours
      };

      const result = await submitDealershipApplication(submissionData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      toast.success("Application submitted successfully!");
      // Update application status to show the correct screen
      await checkApplicationStatus();
      setStep(3); // Show success step
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const isStep1Valid = await trigger(['dealershipName', 'businessLicense', 'businessAddress', 'businessPhone', 'businessEmail']);
      if (isStep1Valid) {
        setStep(2);
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isStep1Valid = () => {
    const fields = ['dealershipName', 'businessLicense', 'businessAddress', 'businessPhone', 'businessEmail'];
    return fields.every(field => {
      const value = watchedFields[field];
      return value && value.trim() !== '';
    });
  };

  const isStep2Valid = () => {
    const fields = ['ownerName', 'ownerPhone', 'ownerEmail', 'businessType', 'yearsInBusiness', 'description'];
    const basicFieldsValid = fields.every(field => {
      const value = watchedFields[field];
      return value && value.trim() !== '';
    });

    // Also check if at least one working day is open
    const hasWorkingHours = Object.values(workingHours).some(day => day.isOpen);
    
    return basicFieldsValid && hasWorkingHours;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <LoadingSpinner size="xl" text="Checking application status..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show application status if user has already applied
  if (applicationStatus && applicationStatus.status !== 'NO_APPLICATION') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            {applicationStatus.status === 'PENDING' && (
              <>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Submitted</h2>
                <p className="text-gray-600">Your dealership application has been submitted successfully. We'll review it and get back to you soon.</p>
                <Button onClick={() => window.location.href = '/'} className="bg-car-red hover:bg-car-red-dark">
                  Return to Home
                </Button>
              </>
            )}

            {applicationStatus.status === 'UNDER_REVIEW' && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Under Review</h2>
                <p className="text-gray-600">Your dealership application is currently being reviewed by our team. We'll notify you once the review is complete.</p>
                <Button onClick={() => window.location.href = '/'} className="bg-car-red hover:bg-car-red-dark">
                  Return to Home
                </Button>
              </>
            )}

            {applicationStatus.status === 'APPROVED' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Approved!</h2>
                <p className="text-gray-600">Congratulations! Your dealership application has been approved. You can now access your dealership dashboard.</p>
                <Button onClick={() => window.location.href = '/dealership'} className="bg-car-red hover:bg-car-red-dark">
                  Go to Dealership Dashboard
                </Button>
              </>
            )}

            {applicationStatus.status === 'REJECTED' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Rejected</h2>
                <p className="text-gray-600">
                  Unfortunately, your dealership application has been rejected.
                  {applicationStatus.reviewNotes && (
                    <span className="block mt-2 text-sm">
                      <strong>Review Notes:</strong> {applicationStatus.reviewNotes}
                    </span>
                  )}
                </p>
                <Button onClick={() => setApplicationStatus(null)} className="bg-car-red hover:bg-car-red-dark">
                  Apply Again
                </Button>
              </>
            )}

            {applicationStatus.status === 'REQUIRES_CHANGES' && (
              <>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Application Requires Changes</h2>
                <p className="text-gray-600">
                  Your application needs some updates before it can be approved.
                  {applicationStatus.reviewNotes && (
                    <span className="block mt-2 text-sm">
                      <strong>Review Notes:</strong> {applicationStatus.reviewNotes}
                    </span>
                  )}
                </p>
                <Button onClick={() => setApplicationStatus(null)} className="bg-car-red hover:bg-car-red-dark">
                  Update Application
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Become a Dealership Partner
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Join our network of trusted automotive dealers and start selling your vehicles
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {step === 1 && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="dealershipName">Dealership Name *</Label>
                    <Input
                      id="dealershipName"
                      {...register("dealershipName")}
                      placeholder="Enter dealership name"
                      className={errors.dealershipName ? "border-red-500" : ""}
                    />
                    {errors.dealershipName && (
                      <p className="text-sm text-red-500">{errors.dealershipName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="businessLicense">Business License *</Label>
                    <Input
                      id="businessLicense"
                      {...register("businessLicense")}
                      placeholder="Enter business license number"
                      className={errors.businessLicense ? "border-red-500" : ""}
                    />
                    {errors.businessLicense && (
                      <p className="text-sm text-red-500">{errors.businessLicense.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    {...register("businessAddress")}
                    placeholder="Enter complete business address"
                    rows={3}
                    className={errors.businessAddress ? "border-red-500" : ""}
                  />
                  {errors.businessAddress && (
                    <p className="text-sm text-red-500">{errors.businessAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="businessPhone">Business Phone *</Label>
                    <Input
                      id="businessPhone"
                      {...register("businessPhone")}
                      placeholder="Enter business phone"
                      className={errors.businessPhone ? "border-red-500" : ""}
                    />
                    {errors.businessPhone && (
                      <p className="text-sm text-red-500">{errors.businessPhone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      {...register("businessEmail")}
                      placeholder="Enter business email"
                      className={errors.businessEmail ? "border-red-500" : ""}
                    />
                    {errors.businessEmail && (
                      <p className="text-sm text-red-500">{errors.businessEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStep1Valid()}
                    className="bg-car-red hover:bg-car-red-dark"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      {...register("ownerName")}
                      placeholder="Enter owner name"
                      className={errors.ownerName ? "border-red-500" : ""}
                    />
                    {errors.ownerName && (
                      <p className="text-sm text-red-500">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="ownerPhone">Owner Phone *</Label>
                    <Input
                      id="ownerPhone"
                      {...register("ownerPhone")}
                      placeholder="Enter owner phone"
                      className={errors.ownerPhone ? "border-red-500" : ""}
                    />
                    {errors.ownerPhone && (
                      <p className="text-sm text-red-500">{errors.ownerPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="ownerEmail">Owner Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    {...register("ownerEmail")}
                    placeholder="Enter owner email"
                    className={errors.ownerEmail ? "border-red-500" : ""}
                  />
                  {errors.ownerEmail && (
                    <p className="text-sm text-red-500">{errors.ownerEmail.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select 
                      value={watchedFields.businessType || ""} 
                      onValueChange={(value) => setValue("businessType", value)}
                    >
                      <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                        <SelectItem value="CORPORATION">Corporation</SelectItem>
                        <SelectItem value="FRANCHISE">Franchise</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-sm text-red-500">{errors.businessType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      {...register("yearsInBusiness")}
                      placeholder="Enter years in business"
                      min="0"
                      max="100"
                      className={errors.yearsInBusiness ? "border-red-500" : ""}
                    />
                    {errors.yearsInBusiness && (
                      <p className="text-sm text-red-500">{errors.yearsInBusiness.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Tell us about your business, experience, and why you want to partner with us"
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="logo">Business Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                    {logoPreview ? (
                      <div className="relative w-full h-32 sm:h-40 flex items-center justify-center bg-gray-100 rounded-md">
                        <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove Logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload your business logo (optional)
                        </p>
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo').click()}
                          className="border-car-red text-car-red hover:bg-car-red hover:text-white"
                        >
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Working Hours Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Working Hours</Label>
                  <div className="space-y-3">
                    {Object.entries(workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <input
                            type="checkbox"
                            id={`${day}-open`}
                            checked={hours.isOpen}
                            onChange={(e) => {
                              const newWorkingHours = { ...workingHours };
                              newWorkingHours[day].isOpen = e.target.checked;
                              if (!e.target.checked) {
                                newWorkingHours[day].openTime = "";
                                newWorkingHours[day].closeTime = "";
                              }
                              setWorkingHours(newWorkingHours);
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`${day}-open`} className="capitalize font-medium">
                            {day}
                          </Label>
                        </div>
                        {hours.isOpen && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={hours.openTime}
                              onChange={(e) => {
                                const newWorkingHours = { ...workingHours };
                                newWorkingHours[day].openTime = e.target.value;
                                setWorkingHours(newWorkingHours);
                              }}
                              className="w-full"
                            />
                            <span className="text-gray-500">to</span>
                            <Input
                              type="time"
                              value={hours.closeTime}
                              onChange={(e) => {
                                const newWorkingHours = { ...workingHours };
                                newWorkingHours[day].closeTime = e.target.value;
                                setWorkingHours(newWorkingHours);
                              }}
                              className="w-full"
                            />
                          </div>
                        )}
                        {!hours.isOpen && (
                          <span className="text-gray-400 text-sm">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="border-car-red text-car-red hover:bg-car-red hover:text-white w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!isStep2Valid() || isSubmitting}
                    className="bg-car-red hover:bg-car-red-dark w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <Alert className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> All applications are reviewed manually by our team. 
              You will receive an email confirmation once your application is submitted and 
              another email when the review is complete.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
