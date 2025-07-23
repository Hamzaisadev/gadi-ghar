"use client";
import PageWrapper from "@/components/utils/pageWrapper";
import React, { useState, useEffect } from "react";
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
  formatCurrency,
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
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

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

const AddCarForm = () => {
  const carFormSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().refine((val) => {
      const year = parseInt(val);
      return (
        !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
      );
    }, "Valid year required"),
    price: z.string().min(1, "Price is required"),
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
  });

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
      price: "",
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

  const [activeTab, setActiveTab] = useState("ai");
  const [amount, setAmount] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [addCarLoading, setAddCarLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
  const [processImageLoading, setProcessImageLoading] = useState(false);

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.error("Image removed");
  };

  const formatAmount = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  const onMultiImagesDrop = (acceptedFiles) => {
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
      reader.onloadend = () => {
        newImages.push(reader.result);

        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImageError("");
          toast.success(`successfully uploaded ${validFiles.length} images`);
        }
      };

      reader.readAsDataURL(file);
    });
  };
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

  const onAiImageDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploadedAiImage(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiImageDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      },
      multiple: false,
    });

  const onSubmit = async (data) => {
    const parsedPrice = parseCurrency(data.price); // This will be a number
    // ...rest of your submit logic
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }
  };

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  }, [errors]);

  return (
    <PageWrapper>
      <Tabs
        defaultValue="ai"
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
            <Camera className="h-4 w-4" />
            AI Extraction
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
                        errors.year
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.year && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.year.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="price"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Price (Rs)
                    </Label>
                    <Input
                      id="price"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="e.g. 2,500,000"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.price
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.price && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errors.price.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Mileage */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="mileage"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Mileage (km)
                    </Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="e.g. 25,000"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.mileage
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
                      }`}
                    />
                    {errors.mileage && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {errors.mileage.message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="color"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Color
                    </Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g. Pearl White, Midnight Black"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.color
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
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
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
                      Fuel Type
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("fuelType", value)}
                      defaultValue={getValues("fuelType")}
                    >
                      <SelectTrigger
                        className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                          errors.fuelType
                            ? "ring-2 ring-red-600"
                            : "focus:ring-2 focus:ring-red-600"
                        }`}
                      >
                        <SelectValue placeholder="Choose fuel type" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {fuelTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="hover:bg-red-100 cursor-pointer"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {errors.fuelType.message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
                      Transmission
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("transmission", value)}
                      defaultValue={getValues("transmission")}
                    >
                      <SelectTrigger
                        className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                          errors.transmission
                            ? "ring-2 ring-red-600"
                            : "focus:ring-2 focus:ring-red-600"
                        }`}
                      >
                        <SelectValue placeholder="Choose transmission" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {transmissions.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="hover:bg-red-100 cursor-pointer"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {errors.transmission.message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Type */}
                  <div className="space-y-3 group">
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
                      Body Type
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("bodyType", value)}
                      defaultValue={getValues("bodyType")}
                    >
                      <SelectTrigger
                        className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                          errors.bodyType
                            ? "ring-2 ring-red-600"
                            : "focus:ring-2 focus:ring-red-600"
                        }`}
                      >
                        <SelectValue placeholder="Choose body type" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {bodyTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="hover:bg-red-100 cursor-pointer"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {errors.bodyType.message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="seats"
                      className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors"
                    >
                      Seating Capacity{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      id="seats"
                      {...register("seats")}
                      placeholder="e.g. 5, 7, 8"
                      className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                        errors.seats
                          ? "ring-2 ring-red-600"
                          : "focus:ring-2 focus:ring-red-600"
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
                    <Label className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
                      Availability Status
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("status")}
                      defaultValue={getValues("status")}
                    >
                      <SelectTrigger
                        className={`h-12 text-base border-0 hover-lift transition-all duration-300 ${
                          errors.status
                            ? "ring-2 ring-red-600"
                            : "focus:ring-2 focus:ring-red-600"
                        }`}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="border-0 shadow-lg">
                        {carStatuses.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="hover:bg-red-100 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  status === "AVAILABLE"
                                    ? "bg-green-500"
                                    : status === "UNAVAILABLE"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </div>
                          </SelectItem>
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
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-black"
                  >
                    Vehicle Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Provide a detailed description including condition, features, service history, and any notable characteristics..."
                    className={`min-h-32 text-base border-0 hover-lift transition-all duration-300 resize-none ${
                      errors.description
                        ? "ring-2 ring-red-600"
                        : "focus:ring-2 focus:ring-red-600"
                    }`}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        {errors.description.message}
                      </span>
                    </div>
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="bg-red-50 p-6 rounded-2xl hover-lift transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id="featured"
                      checked={watch("featured")}
                      onCheckedChange={(checked) => setValue("featured")}
                      className="mt-1 w-5 h-5 border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="featured"
                        className="text-base font-semibold text-black cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-5 h-5 text-red-600" />
                        Feature this vehicle
                      </Label>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Featured vehicles receive premium placement on your
                        homepage and in search results, increasing visibility
                        and potential buyer engagement.
                      </p>
                    </div>
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
                        Drag and drop multiple high-quality images or click to
                        browse. Great photos significantly improve listing
                        performance.
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
                {uploadedImages.length > 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-black">
                        Uploaded Images ({uploadedImages.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group hover-lift">
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
                            onClick={() => removeImage(index)}
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
                  <Button
                    type="submit"
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:shadow-red hover:scale-105 active:scale-95 transition-all duration-300"
                    disabled={addCarLoading}
                  >
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
                <div className="p-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-xl shadow-red">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-black">
                    AI-Powered Vehicle Analysis
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    Upload a vehicle image and let our advanced AI extract
                    comprehensive details automatically
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="space-y-8">
                {/* AI Upload Area */}
                <div
                  className={`border-0 shadow-lg rounded-2xl p-12 text-center hover-scale transition-all duration-500 ${
                    imagePreview
                      ? "ring-2 ring-red-600 bg-red-50"
                      : "hover:bg-red-50"
                  }`}
                >
                  {imagePreview ? (
                    <div className="flex flex-col items-center animate-fade-in">
                      <img
                        src={imagePreview}
                        alt="Vehicle preview"
                        className="max-h-80 max-w-full object-contain mb-8 rounded-xl shadow-lg"
                      />
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            setImagePreview(null);
                            setUploadedAiImage(null);
                          }}
                          className="px-6 border-2 hover:border-red-600 hover-lift"
                        >
                          Remove Image
                        </Button>
                        <Button
                          onClick={processWithAI}
                          disabled={processImageLoading}
                          size="lg"
                          className="px-8 bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:shadow-red hover:scale-105 transition-all duration-300"
                        >
                          {processImageLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Camera className="mr-2 h-5 w-5" />
                              Extract Vehicle Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Dummy image preview if no image is uploaded */}
                      <div className="flex flex-col items-center animate-fade-in mb-8">
                        <img
                          src="/car-showroom.jpg"
                          alt="Sample Vehicle Preview"
                          className="max-h-80 max-w-full object-contain mb-4 rounded-xl shadow-lg border border-gray-200"
                        />
                        <span className="text-xs text-gray-400 mb-2">
                          Preview (Sample Image)
                        </span>
                      </div>
                      <div {...getAiRootProps()} className="cursor-pointer">
                        <input {...getAiInputProps()} />
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-3xl shadow-red mb-8">
                            <Camera className="h-12 w-12 text-white" />
                          </div>
                          <h3 className="text-2xl font-semibold text-black mb-4">
                            Upload Vehicle Image
                          </h3>
                          <p className="text-gray-500 mb-6 max-w-lg">
                            Our AI will analyze your image and automatically
                            extract vehicle details including make, model, year,
                            color, and more.
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                            <Info className="w-4 h-4" />
                            JPG, PNG, WebP • Max 5MB • Best results with clear,
                            full vehicle shots
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Processing Status */}
                {processImageLoading && (
                  <div className="bg-red-50 p-6 rounded-2xl animate-fade-in">
                    <div className="flex items-center">
                      <Loader2 className="animate-spin h-6 w-6 mr-4 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-black mb-1">
                          AI Analysis in Progress
                        </h4>
                        <p className="text-sm text-gray-500">
                          Our advanced computer vision system is extracting
                          vehicle details from your image...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* How it Works */}
                <div className="bg-red-50 p-8 rounded-2xl hover-lift transition-all duration-300">
                  <h3 className="text-xl font-semibold text-black mb-6 flex items-center gap-3">
                    <Info className="w-5 h-5 text-red-600" />
                    How AI Extraction Works
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            Upload Image
                          </h4>
                          <p className="text-sm text-gray-500">
                            Select a clear, high-quality image of your vehicle
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            AI Analysis
                          </h4>
                          <p className="text-sm text-gray-500">
                            Advanced computer vision extracts vehicle details
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            Review & Edit
                          </h4>
                          <p className="text-sm text-gray-500">
                            Verify extracted data and add missing information
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-black">AI Extracts:</h4>
                      <ul className="space-y-2 text-sm text-gray-500">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Vehicle make and model
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Approximate year and color
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Body type classification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Visible condition details
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips for Best Results */}
                <div className="bg-red-50 p-8 rounded-2xl border-l-4 border-l-red-600 hover-lift transition-all duration-300">
                  <h3 className="text-xl font-semibold text-black mb-6 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    Tips for Optimal Results
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Use well-lit, clear images with good resolution
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Capture the entire vehicle in the frame
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Avoid heavy shadows or reflections
                        </span>
                      </li>
                    </ul>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Front-angle or side views work best
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Ensure the vehicle is the main subject
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-500">
                          Always verify and review AI-generated data
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AddCarForm;
