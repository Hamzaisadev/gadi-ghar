import * as z from "zod";

export const dealershipFormSchema = z.object({
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
  // Optional social media and web presence fields
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
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
