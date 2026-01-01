import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email").min(1, "Email is required"),

  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10–15 digits")
    .min(1, "Phone is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  address: z.string().optional(),
  zipCode: z.string().optional(),

  countryId: z.number().optional(),
  stateId: z.number().optional(),
  cityId: z.number().optional(),
});


export const restaurantDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),

  ownerId: z.number().min(1, "Owner is required"),

  address: z.string().min(1, "Address required"),

  landmark: z.string().optional(),

  countryId: z.number().min(1, "Country is required"),

  stateId: z.number().min(1, "State is required"),

  cityId: z.number().min(1, "City is required"),

  pincode: z.string().min(1, "Pincode is required"),

  categoryId: z.number().min(1, "Category is required"),

  description: z.string().optional(),

  voiceNoteDirection: z.string().optional(),

  workingDays: z.array(z.number()),

  openTiming: z.array(z.string()),

  closeTiming: z.array(z.string()),
})