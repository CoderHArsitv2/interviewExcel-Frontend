import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"), // you can relax this if you want
  city: z.string(),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  preparing_for: z.string(),
  about_me: z.string(),
  skills: z
    .string()
    .transform((val) =>
      val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []
    ), // converts string to array
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
