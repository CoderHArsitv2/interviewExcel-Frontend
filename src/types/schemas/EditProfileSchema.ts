import { z } from "zod";

export const editProfileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"), // adjust if needed
  city: z.string(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  preparing_for: z.string(),
  about_me: z.string(),
  skills: z
    .string()
    .optional() // allow empty input // ✅ ensures it's an array of strings after transform
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
