"use client";
import PageWrapper from "@/components/utils/pageWrapper";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  formatPriceRange,
  parseCurrency,
} from "@/components/utils/FormatCurrency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import {
  Car,
  AlertCircle,
  Info,
  CheckCircle,
  Upload,
  Camera,
  Sparkles,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { processCarImageWithAI } from "@/app/actions/cars";
import { addDealershipCar } from "@/app/actions/dealership-cars";
import { useRouter } from "next/navigation";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const carFormSchema = z
  .object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().refine((val) => {
      const year = parseInt(val);
      return (
        !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
      );
    }, "Valid year required"),
    minPrice: z.string().min(1, "Min price is required"),
    maxPrice: z.string().min(1, "Max price is required"),
    mileage: z.string().min(1, "Mileage is required"),
    color: z.string().min(1, "Color is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    bodyType: z.string().min(1, "Body type is required"),
    seats: z.string().optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
    featured: z.boolean().default(false),
    // Images are handled separately
  })
  .refine(
    (data) => {
      // Ensure minPrice <= maxPrice
      const min = Number(data.minPrice);
      const max = Number(data.maxPrice);
      return !isNaN(min) && !isNaN(max) && min <= max;
    },
    {
      message: "Min price must be less than or equal to Max price",
      path: ["minPrice", "maxPrice"],
    }
  );

export const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [amount, setAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  // Separate states for manual and AI images
  const [manualUploadedImages, setManualUploadedImages] = useState([]);
  const [aiUploadedImages, setAiUploadedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
  const [hasPaidForAI, setHasPaidForAI] = useState(false); // Track if dealership has paid for AI feature
  const router = useRouter();
  const removeManualImage = (index) => {
    setManualUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.error("Image removed");
  };

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      minPrice: "",
      maxPrice: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  // Watch the minPrice and maxPrice values from the form
  const watchedMinPrice = watch("minPrice");
  const watchedMaxPrice = watch("maxPrice");

  // Sync amount states with form's minPrice and maxPrice values
  useEffect(() => {
    setMinAmount(watchedMinPrice || "");
  }, [watchedMinPrice]);

  useEffect(() => {
    setMaxAmount(watchedMaxPrice || "");
  }, [watchedMaxPrice]);

  const handleMinAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    setMinAmount(rawValue);
    setValue("minPrice", rawValue);
  };

  const handleMaxAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    setMaxAmount(rawValue);
    setValue("maxPrice", rawValue);
  };

  const removeAiImage = (index) => {
    setAiUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.error("AI image removed");
  };

  // Watch the price value from the form
  const watchedPrice = watch("price");

  // Sync amount state with form's price value
  useEffect(() => {
    setAmount(watchedPrice || "");
  }, [watchedPrice]);

  const handleAmountChange = (e) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    // Format with commas
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(formattedValue);
    setValue("price", formattedValue); // Store formatted value in form
  };

  // On submit, parse the price to a number

  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          `${file.name} is too large. Please upload files under 5MB.`
        );
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;

    const newImages = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);

        if (newImages.length === validFiles.length) {
          // Prevent duplicates
          setManualUploadedImages((prev) => {
            const filteredNewImages = newImages.filter(
              (img) => !prev.includes(img)
            );
            return [...prev, ...filteredNewImages];
          });
          setImageError("");
          toast.success(`successfully uploaded ${validFiles.length} images`);
        }
      };

      reader.readAsDataURL(file);
    });
  }, []);
  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: true,
  });

  const onAiImageDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadedAiImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      // Add AI image preview to aiUploadedImages state
      setAiUploadedImages([e.target.result]);
    };
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiImageDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  const {
    loading: processImageLoading,
    fn: processImageFn,
    error: processImageError,
    data: processImageData,
  } = useFetch(processCarImageWithAI);

  const processWithAI = async () => {
    // Check if dealership has paid for AI feature
    if (!hasPaidForAI) {
      toast.error("Please purchase the AI feature to use this functionality");
      return;
    }

    if (!uploadedAiImage) {
      toast.error("Please upload an image");
      return;
    }
    await processImageFn(uploadedAiImage);
  };

  useEffect(() => {
    if (processImageError) {
      toast.error(processImageError.message || "Failed to process image");
    }
  }, [processImageError]);

  useEffect(() => {
    if (processImageData?.success) {
      const carDetails = processImageData.data;

      // Update form with AI results
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year.toString());
      setValue("color", carDetails.color);
      setValue("bodyType", carDetails.bodyType);
      setValue("fuelType", carDetails.fuelType);
      // Debug: log AI price and parse result
      console.log("AI carDetails.price:", carDetails.price);
      const { parseRangeFromAI } = require("@/components/utils/FormatCurrency");
      const priceResult = parseRangeFromAI(carDetails.price);
      setValue("minPrice", carDetails.minPrice?.toString() || "");
      setValue("maxPrice", carDetails.maxPrice?.toString() || "");
      setMinAmount(carDetails.minPrice?.toString() || "");
      setMaxAmount(carDetails.maxPrice?.toString() || "");
      setValue("mileage", carDetails.mileage);
      setValue("transmission", carDetails.transmission);
      setValue("description", carDetails.description);

      toast.success("Successfully extracted car details", {
        description: `Detected ${carDetails.year} ${carDetails.make} ${
          carDetails.model
        } with ${Math.round(carDetails.confidence * 100)}% confidence`,
      });

      // Switch to manual tab for the user to review and fill in missing details
      setActiveTab("manual");
    }
  }, [processImageData, setValue]);

  const {
    data: addCarData,
    loading: addCarLoading,
    fn: addCarFn,
  } = useFetch(addDealershipCar);

  useEffect(() => {
    if (addCarData?.success) {
      toast.success(addCarData.message || "Vehicle added successfully");
      // Reset form
      setManualUploadedImages([]);
      setAiUploadedImages([]);
      setImagePreview(null);
      setUploadedAiImage(null);
      router.push("/dealership/cars");
    }
  }, [addCarData, router]);

  const onSubmit = async (data) => {
    // ...rest of your submit logic
    if (manualUploadedImages.length === 0 && aiUploadedImages.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }

    // Prepare data for server action
    const finalCarData = {
      ...data,
      year: parseInt(data.year),
      minPrice: data.minPrice ? parseFloat(data.minPrice) : null,
      maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : null,
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    // Combine manual and AI images for upload
    const allImages = [...manualUploadedImages, ...aiUploadedImages];

    await addCarFn({
      carData: finalCarData,
      images: allImages,
    });
  };

  useEffect(() => {
    const errorFields = [
      "make",
      "model",
      "year",
      "price",
      "mileage",
      "color",
      "fuelType",
      "transmission",
      "bodyType",
      "seats",
      "status",
      "description",
      "featured",
    ];

    errorFields.forEach((field) => {
      const error = errors[field];
      if (error) {
        toast.error(error.message);
      }
    });
  }, [errors]);

  // Function to handle payment for AI feature
  const handlePurchaseAI = () => {
    // In a real implementation, this would integrate with a payment system
    // For now, we'll just simulate the purchase
    setHasPaidForAI(true);
    toast.success("AI feature purchased successfully!");
  };

  return (
    <PageWrapper>
      <Tabs
        defaultValue="manual"
        className="mt-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-white shadow-lg">
          <TabsTrigger
            value="manual"
            className="flex items-center gap-2 h-10 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <Upload className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex items-center gap-2 h-10 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            {hasPaidForAI ? (
              <Camera className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {hasPaidForAI ? "AI Extraction" : "AI (Locked)"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="animate-fade-in">
          <Card className="border-0 shadow-lg hover-scale transition-all duration-500">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-black">
                    Vehicle Information
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    Enter comprehensive details about your vehicle for optimal
                    listing performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Vehicle Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Make */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="make"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Vehicle Make
                    </Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="e.g. Toyota, BMW, Mercedes"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.make
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.make && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.make.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Model */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="model"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Vehicle Model
                    </Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="e.g. Camry, X5, C-Class"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.model
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.model && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.model.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="year"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Manufacturing Year
                    </Label>
                    <Input
                      id="year"
                      {...register("year")}
                      placeholder={`e.g. ${new Date().getFullYear()}`}
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.year ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.year && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.year.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Min Price */}
                  <div className="space-y-3 group">
                    <Label htmlFor="minPrice" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Min Price (Rs)</Label>
                    <Input
                      id="minPrice"
                      {...register("minPrice")}
                      value={minAmount}
                      onChange={handleMinAmountChange}
                      placeholder="e.g. 2,500,000"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.minPrice ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.minPrice && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.minPrice.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Max Price */}
                  <div className="space-y-3 group">
                    <Label htmlFor="maxPrice" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Max Price (Rs)</Label>
                    <Input
                      id="maxPrice"
                      {...register("maxPrice")}
                      value={maxAmount}
                      onChange={handleMaxAmountChange}
                      placeholder="e.g. 3,000,000"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.maxPrice ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.maxPrice && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.maxPrice.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Display formatted price range */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Formatted Price Range</Label>
                    <div className="font-semibold">{minAmount && maxAmount ? formatPriceRange(minAmount, maxAmount) : "—"}</div>
                  </div>

                  {/* Mileage */}
                  <div className="space-y-3 group">
                    <Label htmlFor="mileage" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="e.g. 25,000"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.mileage ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.mileage && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.mileage.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-3 group">
                    <Label htmlFor="color" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Color</Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g. Pearl White, Midnight Black"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.color ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.color && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.color.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Fuel Type</Label>
                    <Select onValueChange={(value) => setValue("fuelType", value)} defaultValue={getValues("fuelType")}>
                      <SelectTrigger className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${errors.fuelType ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"}`}>
                        <SelectValue placeholder="Choose fuel type" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type} className="hover:bg-red-100 cursor-pointer">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.fuelType.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Transmission</Label>
                    <Select onValueChange={(value) => setValue("transmission", value)} defaultValue={getValues("transmission")}>
                      <SelectTrigger className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${errors.transmission ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"}`}>
                        <SelectValue placeholder="Choose transmission" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {transmissions.map((type) => (
                          <SelectItem key={type} value={type} className="hover:bg-red-100 cursor-pointer">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.transmission.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Type */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Body Type</Label>
                    <Select onValueChange={(value) => setValue("bodyType", value)} defaultValue={getValues("bodyType")}>
                      <SelectTrigger className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${errors.bodyType ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"}`}>
                        <SelectValue placeholder="Choose body type" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type} className="hover:bg-red-100 cursor-pointer">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.bodyType.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="space-y-3 group">
                    <Label htmlFor="seats" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Seats</Label>
                    <Input
                      id="seats"
                      {...register("seats")}
                      placeholder="e.g. 5"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.seats ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.seats && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.seats.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Status</Label>
                    <Select onValueChange={(value) => setValue("status", value)} defaultValue={getValues("status") || "AVAILABLE"}>
                      <SelectTrigger className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${errors.status ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {carStatuses.map((s) => (
                          <SelectItem key={s} value={s} className="hover:bg-red-100 cursor-pointer">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.status.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Featured */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Featured</Label>
                    <div className="flex items-center gap-3">
                      <Checkbox id="featured" checked={getValues("featured")} onCheckedChange={(v) => setValue("featured", Boolean(v))} />
                      <Label htmlFor="featured" className="text-sm text-gray-700">Highlight this listing on the homepage</Label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3 group md:col-span-2 lg:col-span-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">Description</Label>
                    <Textarea id="description" {...register("description")} placeholder="Write a compelling description..." className={`min-h-32 text-base border-0 hover-lift transition-all duration-300 ${errors.description ? "ring-2 ring-red-600" : "focus:ring-2 focus:ring-red-600"}`} />
                    {errors.description && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.description.message}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Image Upload */}
                <div className="space-y-6">
                  <Label
                    htmlFor="images"
                    className={`text-base font-semibold ${
                      imageError ? "text-red-600" : "text-black"
                    }`}
                  >
                    Vehicle Images
                    {imageError && <span className="text-red-600 ml-1">*</span>}
                  </Label>

                  <div
                    {...getMultiImageRootProps()}
                    className={`border-0 shadow-lg rounded-2xl p-12 text-center cursor-pointer hover-scale transition-all duration-500 ${
                      imageError
                        ? "ring-2 ring-red-600 bg-red-50"
                        : "hover:bg-red-50"
                    }`}
                  >
                    <input {...getMultiImageInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-2xl shadow-red mb-6">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        Upload Vehicle Images
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md">
                        Drag and drop multiple high-quality images or click to browse. Great photos significantly improve listing performance.
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                        <Info className="w-4 h-4" />
                        JPG, PNG, WebP • Max 5MB each
                      </div>
                    </div>
                  </div>

                  {imageError && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{imageError}</span>
                    </div>
                  )}

                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                {(manualUploadedImages.length > 0 || aiUploadedImages.length > 0) && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-black">
                        Uploaded Images ({manualUploadedImages.length + aiUploadedImages.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {manualUploadedImages.map((image, index) => (
                        <div key={`manual-${index}`} className="relative group hover-lift">
                          <img
                            src={image}
                            alt={`Vehicle image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                            onClick={() => removeManualImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {aiUploadedImages.map((image, index) => (
                        <div key={`ai-${index}`} className="relative group hover-lift">
                          <img
                            src={image}
                            alt={`AI Vehicle image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                            onClick={() => removeAiImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-8">
                  <Button type="submit" size="lg" className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:shadow-red hover:scale-105 active:scale-95 transition-all duration-300" disabled={addCarLoading}>
                    {addCarLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 h-5 w-5" />
                        Add Vehicle to Inventory
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="animate-fade-in">
          <Card className="border-0 shadow-lg hover-scale transition-all duration-500">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-xl">
                  {hasPaidForAI ? (
                    <Sparkles className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-black">{hasPaidForAI ? "AI-Powered Vehicle Analysis" : "Unlock AI-Powered Analysis"}</CardTitle>
                  <CardDescription className="text-gray-500 mt-1">{hasPaidForAI ? "Upload a vehicle image and let our AI extract comprehensive details automatically." : "Purchase access to use AI image analysis for auto-filling car details."}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {hasPaidForAI ? (
                <div className="space-y-8">
                  <div className={`border-0 shadow-lg rounded-2xl p-12 text-center hover-scale transition-all duration-500 ${imagePreview ? "ring-2 ring-red-600 bg-red-50" : "hover:bg-red-50"}`}>
                    {imagePreview ? (
                      <div className="flex flex-col items-center animate-fade-in">
                        <img src={imagePreview} alt="Vehicle preview" className="max-h-80 max-w-full object-contain mb-8 rounded-xl shadow-lg" />
                        <div className="flex gap-4">
                          <Button variant="outline" size="lg" onClick={() => { setImagePreview(null); setUploadedAiImage(null); }} className="px-6 border-2 hover:border-red-600 hover-lift">Remove Image</Button>
                          <Button onClick={processWithAI} disabled={processImageLoading} size="lg" className="px-8 bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:shadow-red hover:scale-105 transition-all duration-300">{processImageLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing...</>) : (<><Camera className="mr-2 h-5 w-5" />Extract Vehicle Details</>)}</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div {...getAiRootProps()} className="cursor-pointer">
                          <input {...getAiInputProps()} />
                          <div className="flex flex-col items-center justify-center">
                            <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-3xl shadow-red mb-8"><Camera className="h-12 w-12 text-white" /></div>
                            <h3 className="text-2xl font-semibold text-black mb-4">Upload Vehicle Image</h3>
                            <p className="text-gray-500 mb-6 max-w-lg">Our AI will analyze your image and automatically extract vehicle details including make, model, year, color, and more.</p>
                            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg"><Info className="w-4 h-4" />JPG, PNG, WebP • Max 5MB • Best results with clear, full vehicle shots</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-red-50 rounded-2xl border border-red-100">
                  <div className="p-4 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-2xl mb-6"><Lock className="w-10 h-10 text-white" /></div>
                  <h3 className="text-2xl font-semibold text-black mb-2">AI Extraction is Locked</h3>
                  <p className="text-gray-600 mb-6 max-w-xl">Upgrade to unlock AI-powered image analysis. Automatically extract car details from an image to speed up listing creation.</p>
                  <div className="flex gap-3">
                    <Button onClick={handlePurchaseAI} size="lg" className="bg-gradient-to-r from-red-700 via-red-600 to-red-500">Unlock AI Feature</Button>
                    <Button variant="outline" size="lg" onClick={() => setActiveTab("manual")}>Continue Manually</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};
