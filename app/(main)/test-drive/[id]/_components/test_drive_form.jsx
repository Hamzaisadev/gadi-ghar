"use client";

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, addDays, startOfDay } from "date-fns";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  CalendarIcon,
  Car,
  CheckCircle2,
  Loader2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Settings,
  Fuel,
  Gauge,
  Users,
  Sparkles,
  ArrowRight,
  Building2,
  Info,
  Zap,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";

import { bookTestDrive } from "@/app/actions/test-drive";
import { getCarById } from "@/app/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import {
  formatPriceWithCrore,
  formatPriceRange,
} from "@/components/utils/FormatCurrency";

// Optimized validation schema with better error messages
const testDriveSchema = z.object({
  date: z
    .date({
      required_error: "Please select a date for your test drive",
    })
    .refine((date) => {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(date);
      return selectedDate >= today;
    }, "Please select a future date"),
  timeSlot: z
    .string({
      required_error: "Please select a time slot for your test drive",
    })
    .min(1, "Please select a valid time slot"),
  notes: z.string().optional(),
});

// Memoized car specs component for better performance
const CarSpecs = memo(({ car }) => {
  const specs = [
    { icon: Settings, label: "Transmission", value: car?.transmission ?? "—" },
    { icon: Fuel, label: "Fuel", value: car?.fuelType ?? "—" },
    {
      icon: Gauge,
      label: "Mileage",
      value:
        typeof car?.mileage === "number"
          ? `${car.mileage.toLocaleString()} mi`
          : "—",
    },
    { icon: Users, label: "Body Type", value: car?.bodyType ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {specs.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all duration-200 group"
        >
          <div className="bg-car-red/10 p-2 rounded-lg group-hover:bg-car-red/20 transition-colors">
            <Icon size={18} className="text-car-red" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              {label}
            </div>
            <div className="font-bold text-slate-900 text-sm truncate">
              {value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// Memoized dealership info component
const DealershipInfo = memo(({ dealership }) => {
  if (!dealership?.name) return null;

  return (
    <div className="bg-gradient-to-br from-car-red/5 via-red-50/50 to-car-red/5 p-6 rounded-xl border border-car-red/20">
      <h3 className="font-bold text-lg text-slate-900 mb-4 text-center flex items-center justify-center gap-2">
        <Building2 className="h-5 w-5 text-car-red" />
        {dealership.name}
      </h3>

      <div className="space-y-3">
        {dealership.address && (
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <MapPin className="h-4 w-4 text-car-red mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700 leading-relaxed">
              {dealership.address}
            </span>
          </div>
        )}

        {dealership.phone && (
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Phone className="h-4 w-4 text-car-red flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900">
              {dealership.phone}
            </span>
          </div>
        )}

        {dealership.email && (
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Mail className="h-4 w-4 text-car-red flex-shrink-0" />
            <span className="text-sm text-slate-700">{dealership.email}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Optimized time slot button component
const TimeSlotButton = memo(({ slot, isSelected, onSelect, disabled }) => (
  <button
    type="button"
    onClick={() => onSelect(slot.id)}
    disabled={disabled}
    className={cn(
      "group relative p-4 rounded-xl border-2 transition-all duration-300 text-center transform hover:scale-[1.02] focus:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      isSelected
        ? "border-car-red bg-gradient-to-br from-car-red/10 to-car-red/20 text-car-red shadow-lg ring-2 ring-car-red/20"
        : "border-slate-200 hover:border-car-red/50 hover:bg-car-red/5 bg-slate-50 hover:shadow-md"
    )}
  >
    <div
      className={cn(
        "p-2 rounded-lg mb-2 mx-auto w-fit transition-all duration-300",
        isSelected
          ? "bg-car-red/20 scale-110"
          : "bg-slate-200 group-hover:bg-car-red/10"
      )}
    >
      <Clock
        className={cn(
          "h-5 w-5 transition-colors duration-300",
          isSelected
            ? "text-car-red"
            : "text-slate-600 group-hover:text-car-red"
        )}
      />
    </div>
    <div className="font-bold text-sm mb-1">{slot.label}</div>
    <div
      className={cn(
        "text-xs font-medium",
        isSelected
          ? "text-car-red/70"
          : "text-slate-500 group-hover:text-car-red/60"
      )}
    >
      Available
    </div>
    {isSelected && (
      <div className="absolute -top-1 -right-1 bg-car-red text-white rounded-full p-1">
        <CheckCircle2 className="h-3 w-3" />
      </div>
    )}
  </button>
));

const TestDriveForm = ({
  carId,
  car: carProp,
  testDriveInfo: testDriveInfoProp,
}) => {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState(carProp || null);
  const [testDriveInfo, setTestDriveInfo] = useState(testDriveInfoProp || null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormAnimating, setIsFormAnimating] = useState(false);

  const formSteps = [
    { id: 1, label: "Select Date", icon: CalendarIcon },
    { id: 2, label: "Choose Time", icon: Clock },
    { id: 3, label: "Add Notes", icon: Info },
  ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(testDriveSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      date: undefined,
      timeSlot: "",
      notes: "",
    },
  });

  // Memoized values for better performance
  const dealership = useMemo(
    () => testDriveInfo?.dealership || {},
    [testDriveInfo]
  );
  const existingBookings = useMemo(
    () => testDriveInfo?.existingBooking || [],
    [testDriveInfo]
  );

  const selectedDate = watch("date");
  const selectedTimeSlot = watch("timeSlot");

  // Auto-progress through steps based on form completion (with smoother transitions)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDate && !selectedTimeSlot) {
        setCurrentStep(2);
      } else if (selectedDate && selectedTimeSlot) {
        setCurrentStep(3);
      } else {
        setCurrentStep(1);
      }
    }, 150); // Small delay for smoother UX

    return () => clearTimeout(timer);
  }, [selectedDate, selectedTimeSlot]);

  // Fetch car if not provided via props
  const {
    loading: loadingCar,
    fn: fetchCarFn,
    data: fetchedCarResult,
    error: fetchedCarError,
  } = useFetch(getCarById);

  useEffect(() => {
    if (!car && (carId || params?.id)) {
      const idToUse = carId || params?.id;
      console.log("Fetching car with ID:", idToUse);
      fetchCarFn(idToUse);
    }
  }, [car, carId, params?.id]);

  useEffect(() => {
    if (fetchedCarResult?.success) {
      setCar(fetchedCarResult.data);
      setTestDriveInfo(fetchedCarResult.data?.testDriveInfo || null);
    }
  }, [fetchedCarResult]);

  const {
    loading: bookingInProgress,
    fn: bookTestDriveFn,
    data: bookingResult,
    error: bookingError,
  } = useFetch(bookTestDrive);

  // Handle successful booking
  useEffect(() => {
    if (bookingResult?.success) {
      // Show success toast
      toast.success(
        bookingResult.message ||
          "Test drive booked successfully! The dealership has been notified.",
        {
          duration: 5000,
          description: "You will receive confirmation details shortly.",
        }
      );

      setBookingDetails({
        date: format(
          new Date(bookingResult?.data?.bookingDate),
          "EEEE, MMMM d, yyyy"
        ),
        timeSlot: `${format(
          parseISO(`2022-01-01T${bookingResult?.data?.startTime}`),
          "h:mm a"
        )} - ${format(
          parseISO(`2022-01-01T${bookingResult?.data?.endTime}`),
          "h:mm a"
        )}`,
        notes: bookingResult?.data?.notes,
      });
      setShowConfirmation(true);

      // Reset form
      reset();
    }
  }, [bookingResult, reset]);

  // Handle booking error
  useEffect(() => {
    if (bookingError) {
      toast.error(
        bookingError.message || "Failed to book test drive. Please try again."
      );
    }
  }, [bookingError]);

  // Optimized time slot generation with memoization
  const availableTimeSlotsForDate = useMemo(() => {
    if (!selectedDate || !dealership?.workingHours) return [];

    const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();
    const daySchedule = dealership.workingHours.find(
      (day) => day.dayOfWeek === selectedDayOfWeek
    );

    if (!daySchedule || !daySchedule.isOpen) return [];

    const openHour = parseInt(daySchedule.openTime.split(":")[0]);
    const closeHour = parseInt(daySchedule.closeTime.split(":")[0]);
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");

    const slots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

      const isBooked = existingBookings.some((booking) => {
        return (
          booking.date === selectedDateString &&
          (booking.startTime === startTime || booking.endTime === endTime)
        );
      });

      if (!isBooked) {
        slots.push({
          id: `${startTime}-${endTime}`,
          label: `${format(parseISO(`2022-01-01T${startTime}`), "h:mm a")} - ${format(parseISO(`2022-01-01T${endTime}`), "h:mm a")}`,
          startTime,
          endTime,
        });
      }
    }

    return slots;
  }, [selectedDate, dealership?.workingHours, existingBookings]);

  // Update available time slots and clear selection when date changes
  useEffect(() => {
    setAvailableTimeSlots(availableTimeSlotsForDate);
    if (selectedTimeSlot && availableTimeSlotsForDate.length > 0) {
      const stillAvailable = availableTimeSlotsForDate.some(
        (slot) => slot.id === selectedTimeSlot
      );
      if (!stillAvailable) {
        setValue("timeSlot", "");
      }
    } else if (selectedTimeSlot) {
      setValue("timeSlot", "");
    }
  }, [availableTimeSlotsForDate, selectedTimeSlot, setValue]);

  // Optimized callback functions with memoization
  const isDayDisabled = useCallback(
    (date) => {
      if (!date) return true;
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(date);
      if (selectedDate < today) return true;

      const dayOfWeek = format(date, "EEEE").toUpperCase();
      const daySchedule = dealership?.workingHours?.find(
        (schedule) => schedule.dayOfWeek === dayOfWeek
      );
      return !daySchedule || !daySchedule.isOpen;
    },
    [dealership?.workingHours]
  );

  // Optimized time slot selection handler
  const handleTimeSlotSelect = useCallback(
    (slotId) => {
      setValue("timeSlot", slotId, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  // Optimized form submission with better error handling
  const onSubmit = useCallback(
    async (data) => {
      if (bookingInProgress) return; // Prevent double submission

      const selectedSlot = availableTimeSlots.find(
        (slot) => slot.id === data.timeSlot
      );

      if (!selectedSlot) {
        toast.error(
          "Selected time slot is no longer available. Please choose another time."
        );
        return;
      }

      const carIdToUse = car?.id || carId || params?.id;
      if (!carIdToUse) {
        toast.error(
          "Unable to identify the car. Please refresh and try again."
        );
        return;
      }

      try {
        await bookTestDriveFn({
          carId: carIdToUse,
          bookingDate: format(data.date, "yyyy-MM-dd"),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          notes: data.notes || "",
        });
      } catch (error) {
        console.error("Error booking test drive:", error);
        toast.error("Failed to book test drive. Please try again.");
      }
    },
    [
      availableTimeSlots,
      car?.id,
      carId,
      params?.id,
      bookTestDriveFn,
      bookingInProgress,
    ]
  );

  // Close confirmation handler
  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    const carIdToNavigate = car?.id || carId || params?.id;
    if (carIdToNavigate) {
      router.push(`/cars/${carIdToNavigate}`);
    } else {
      router.push("/cars");
    }
  }, [car?.id, carId, params?.id, router]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Left Column - Car Summary */}
        <div className="xl:col-span-1 space-y-4 lg:space-y-6">
          <Card className="overflow-hidden bg-white shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-500 group">
            <div className="relative">
              {/* Car Image */}
              <div className="aspect-video overflow-hidden relative bg-slate-100">
                {car?.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car?.year ?? ""} ${car?.make ?? ""} ${
                      car?.model ?? ""
                    }`}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Car className="h-16 w-16 text-slate-400 transition-transform duration-700 group-hover:scale-110" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Enhanced Image Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-gradient-to-r from-car-red to-car-red-dark text-white px-5 py-2.5 rounded-full text-lg font-bold shadow-lg backdrop-blur-sm border border-white/20">
                  {typeof car?.price === "number"
                    ? car?.minPrice || car?.maxPrice
                      ? formatPriceRange(
                          car?.minPrice || car?.price,
                          car?.maxPrice
                        )
                      : formatPriceWithCrore(car.price)
                    : "Price TBD"}
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-car-red/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-car-red" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {car?.year} {car?.make} {car?.model}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Ready for your test drive experience
                </p>
              </div>

              {/* Specs Grid - Memoized for better performance */}
              <div className="mb-6">
                <CarSpecs car={car} />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {car?.color && (
                  <Badge className="bg-gradient-to-r from-car-red to-car-red-dark text-white rounded-full px-4 py-2 font-semibold shadow-lg">
                    {car.color}
                  </Badge>
                )}
                {car?.bodyType && (
                  <Badge className="bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-full px-4 py-2 font-semibold shadow-lg">
                    {car.bodyType}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dealership Info */}
          <Card className="bg-white shadow-lg border border-slate-200/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-car-red/10 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-car-red" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Dealership Info
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <DealershipInfo dealership={dealership} />

              {/* Working Hours Display */}
              {dealership?.workingHours &&
                dealership.workingHours.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-car-red/10 p-1.5 rounded-lg">
                        <Clock className="h-4 w-4 text-car-red" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        Working Hours
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {dealership.workingHours
                        .filter((schedule) => schedule.isOpen)
                        .slice(0, 4)
                        .map((schedule) => (
                          <div
                            key={schedule.dayOfWeek}
                            className="flex justify-between items-center py-1.5 px-2 bg-white/70 rounded-lg"
                          >
                            <span className="font-medium text-slate-700 capitalize">
                              {schedule.dayOfWeek.toLowerCase()}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {schedule.openTime} - {schedule.closeTime}
                            </span>
                          </div>
                        ))}
                      {dealership.workingHours.filter((s) => s.isOpen).length >
                        4 && (
                        <div className="text-center py-1">
                          <span className="text-car-red font-semibold text-xs">
                            +{" "}
                            {dealership.workingHours.filter((s) => s.isOpen)
                              .length - 4}{" "}
                            more days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Form */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <Card className="bg-white shadow-xl border border-slate-200/60 overflow-hidden">
            <CardContent className="p-6 lg:p-8">
              {/* Modern Step Navigation */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((step, index) => {
                    const isActive = currentStep === step;
                    const isCompleted = currentStep > step;
                    const stepInfo = formSteps[index];
                    const StepIcon = stepInfo.icon;

                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : isActive
                                  ? "bg-car-red border-car-red text-white shadow-lg"
                                  : "bg-gray-100 border-gray-200 text-gray-400"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <StepIcon className="w-5 h-5" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-xs mt-2 font-medium text-center",
                              isActive ? "text-car-red" : "text-gray-500"
                            )}
                          >
                            {stepInfo.label}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className="flex-1 mx-4">
                            <div
                              className={cn(
                                "h-0.5 transition-all duration-300",
                                currentStep > step
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 lg:space-y-8"
              >
                {/* Step 1: Date Selection */}
                <div
                  className={cn(
                    "space-y-4 transition-all duration-500 rounded-2xl p-4 lg:p-6 border-2",
                    currentStep >= 1
                      ? "opacity-100 border-car-red/20 bg-car-red/5"
                      : "opacity-60 pointer-events-none border-slate-200 bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-lg transition-all duration-300",
                        currentStep >= 1
                          ? "bg-gradient-to-br from-car-red to-car-red-dark text-white scale-100"
                          : "bg-slate-300 text-slate-600 scale-95"
                      )}
                    >
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900">
                        Choose Your Date
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Select a convenient date for your test drive experience
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <div className="bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-car-red/30 hover:shadow-lg transition-all duration-300">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-18 justify-start text-left font-medium text-lg border-2 hover:border-car-red/50 transition-all duration-300 bg-slate-50 hover:bg-white",
                                !field.value && "text-muted-foreground",
                                field.value &&
                                  "border-car-red/40 bg-car-red/10 hover:bg-car-red/15"
                              )}
                            >
                              <div className="bg-car-red/10 p-2 rounded-lg mr-4">
                                <CalendarIcon className="h-6 w-6 text-car-red" />
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                  Selected Date
                                </span>
                                <span className="text-lg font-bold text-slate-900">
                                  {field.value
                                    ? format(field.value, "EEEE, MMMM d, yyyy")
                                    : "Click to select a date"}
                                </span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 shadow-xl border border-gray-200">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={isDayDisabled}
                              initialFocus
                              className="p-4"
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.date && (
                          <p className="text-sm font-medium text-red-500 mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {errors.date.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Step 2: Time Slot Selection */}
                <div
                  className={cn(
                    "space-y-4 transition-all duration-500 rounded-2xl p-4 lg:p-6 border-2",
                    currentStep >= 2
                      ? "opacity-100 border-car-red/20 bg-car-red/5"
                      : "opacity-60 pointer-events-none border-slate-200 bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-lg transition-all duration-300",
                        currentStep >= 2
                          ? "bg-gradient-to-br from-car-red to-car-red-dark text-white scale-100"
                          : "bg-slate-300 text-slate-600 scale-95"
                      )}
                    >
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900">
                        Select Time Slot
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {selectedDate
                          ? `Available slots for ${format(
                              selectedDate,
                              "MMMM d, yyyy"
                            )}`
                          : "Choose a date first to see available time slots"}
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="timeSlot"
                    control={control}
                    render={({ field }) => (
                      <div className="bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-car-red/30 hover:shadow-lg transition-all duration-300">
                        {!selectedDate ? (
                          <div className="flex items-center justify-center h-24 text-slate-500">
                            <div className="text-center">
                              <div className="bg-slate-100 p-3 rounded-full mb-3 mx-auto w-fit">
                                <Clock className="h-8 w-8 text-slate-400" />
                              </div>
                              <p className="font-medium">
                                Please select a date first
                              </p>
                            </div>
                          </div>
                        ) : availableTimeSlots.length === 0 ? (
                          <div className="flex items-center justify-center h-24 text-slate-500">
                            <div className="text-center">
                              <div className="bg-slate-100 p-3 rounded-full mb-3 mx-auto w-fit">
                                <Clock className="h-8 w-8 text-slate-400" />
                              </div>
                              <p className="font-medium mb-1">
                                No available time slots for this date
                              </p>
                              <p className="text-sm">
                                Please choose another date
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {availableTimeSlots.map((slot) => (
                                <TimeSlotButton
                                  key={slot.id}
                                  slot={slot}
                                  isSelected={field.value === slot.id}
                                  onSelect={handleTimeSlotSelect}
                                  disabled={bookingInProgress}
                                />
                              ))}
                            </div>
                            {availableTimeSlots.length > 0 && (
                              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">
                                  {availableTimeSlots.length} available slot
                                  {availableTimeSlots.length > 1 ? "s" : ""}{" "}
                                  found
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {errors.timeSlot && (
                          <p className="text-sm font-medium text-red-500 mt-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {errors.timeSlot.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Step 3: Additional Notes */}
                <div
                  className={cn(
                    "space-y-4 transition-all duration-500 rounded-2xl p-4 lg:p-6 border-2",
                    currentStep >= 3
                      ? "opacity-100 border-car-red/20 bg-car-red/5"
                      : "opacity-60 pointer-events-none border-slate-200 bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-lg transition-all duration-300",
                        currentStep >= 3
                          ? "bg-gradient-to-br from-car-red to-car-red-dark text-white scale-100"
                          : "bg-slate-300 text-slate-600 scale-95"
                      )}
                    >
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900">
                        Additional Notes
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Any specific requests or questions? (Optional)
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <div className="bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-car-red/30 hover:shadow-lg transition-all duration-300">
                        <Textarea
                          {...field}
                          placeholder="Tell us about your specific interests, questions, or any special requirements for the test drive..."
                          className="min-h-32 resize-none border-0 bg-transparent text-base placeholder:text-slate-400 focus:ring-0 focus:outline-none w-full"
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Submit Button Section */}
                <div className="pt-6 space-y-4">
                  {/* Form Status Indicator */}
                  {!isValid && (selectedDate || selectedTimeSlot) && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">
                          Please complete all required fields to continue
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Debug info */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="mb-4 p-4 bg-slate-100 rounded-lg text-sm space-y-1">
                      <p className="font-semibold">Debug Info:</p>
                      <p>
                        Form Valid:{" "}
                        <span
                          className={
                            isValid ? "text-green-600" : "text-red-600"
                          }
                        >
                          {isValid ? "Yes" : "No"}
                        </span>
                      </p>
                      <p>
                        Booking in Progress:{" "}
                        <span
                          className={
                            bookingInProgress
                              ? "text-amber-600"
                              : "text-slate-600"
                          }
                        >
                          {bookingInProgress ? "Yes" : "No"}
                        </span>
                      </p>
                      <p>
                        Date:{" "}
                        {selectedDate
                          ? format(selectedDate, "yyyy-MM-dd")
                          : "Not selected"}
                      </p>
                      <p>Time Slot: {selectedTimeSlot || "Not selected"}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={bookingInProgress || !isValid}
                    className={cn(
                      "w-full h-16 lg:h-18 text-lg lg:text-xl font-bold rounded-xl shadow-lg transition-all duration-500 transform touch-target-lg",
                      "bg-gradient-to-r from-car-red via-car-red to-car-red-dark",
                      "hover:from-car-red-dark hover:via-car-red hover:to-car-red",
                      "hover:scale-[1.02] hover:shadow-2xl hover:shadow-car-red/30",
                      "focus:scale-[1.02] focus:shadow-2xl focus:shadow-car-red/30",
                      "active:scale-[0.98]",
                      "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg",
                      !isValid &&
                        !bookingInProgress &&
                        "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {bookingInProgress ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Booking Your Test Drive...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <span>Book Test Drive</span>
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              {/* Enhanced Information Section */}
              <div className="mt-8 lg:mt-12 space-y-6">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100/80 p-6 lg:p-8 rounded-2xl border border-green-200/60 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-lg">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      What to Expect
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-green-100">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          Valid Driver's License
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                          Required for verification and insurance coverage
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-green-100">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          60-Minute Experience
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                          Comprehensive test drive with our expert guide
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-green-100">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          Professional Guide
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                          Knowledgeable representative accompanies you
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-green-100">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          No Pressure Environment
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                          Take your time, ask questions, and enjoy the drive
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100/80 p-6 lg:p-8 rounded-2xl border border-blue-200/60 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-lg">
                      <Info className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Quick Tips for Success
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 mb-1">
                            Arrive Early
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            Come 10 minutes before your scheduled time for a
                            smooth experience
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 mb-1">
                            Comfortable Attire
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            Wear appropriate driving footwear and comfortable
                            clothing
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                          <Info className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 mb-1">
                            Questions Ready
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            Prepare questions about features and performance
                            you'd like to test
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 mb-1">
                            Bring a Friend
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            A second opinion can be valuable for such an
                            important decision
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white via-green-50/30 to-white shadow-2xl border-0 rounded-3xl">
          <div className="text-center space-y-8 py-6">
            {/* Success Animation */}
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-full shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-slate-900">
                🎉 Booking Confirmed!
              </h2>
              <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
                Your test drive has been successfully scheduled. Get ready for
                an amazing experience!
              </p>
            </div>

            {bookingDetails && (
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200/60 shadow-lg">
                {/* Car Info */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-car-red to-car-red-dark p-3 rounded-full shadow-lg">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {car?.year} {car?.make} {car?.model}
                  </h3>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 text-center">
                    <div className="bg-car-red/10 p-3 rounded-full mx-auto mb-3 w-fit">
                      <CalendarIcon className="h-7 w-7 text-car-red" />
                    </div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">
                      Date
                    </div>
                    <div className="font-bold text-lg text-slate-900">
                      {bookingDetails.date}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 text-center">
                    <div className="bg-car-red/10 p-3 rounded-full mx-auto mb-3 w-fit">
                      <Clock className="h-7 w-7 text-car-red" />
                    </div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">
                      Time
                    </div>
                    <div className="font-bold text-lg text-slate-900">
                      {bookingDetails.timeSlot}
                    </div>
                  </div>
                </div>

                {/* Dealership */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="bg-car-red/10 p-2 rounded-lg">
                      <Building2 className="h-6 w-6 text-car-red" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">
                      {dealership?.name || "Vehiql Motors"}
                    </span>
                  </div>
                  {dealership?.address && (
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-car-red" />
                      <span className="text-center">{dealership.address}</span>
                    </div>
                  )}
                </div>

                {/* Important Note */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Info className="h-5 w-5 text-amber-700" />
                    </div>
                    <span className="font-bold text-amber-900">
                      Important Reminder
                    </span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    Please arrive 10 minutes early with your valid driver's
                    license. We're excited to help you experience your dream
                    car!
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleCloseConfirmation}
                className="bg-gradient-to-r from-car-red via-car-red to-car-red-dark hover:from-car-red-dark hover:via-car-red hover:to-car-red text-white font-bold px-10 py-4 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg touch-target-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Perfect! Let's Go</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestDriveForm;
