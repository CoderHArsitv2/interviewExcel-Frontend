import { z } from "zod";

export const editExpertProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),
  dob: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Date of Birth must be a valid date"
    ),
  bio: z.string(),
  fees_per_session: z.number().nullable(),
  profile_picture_url: z.string().nullable(),
  about_me: z
    .string()
    .min(10, "About Me must be at least 10 characters")
    .max(500, "About Me must not exceed 500 characters"),
  specializations: z.string().min(2, "Please enter at least one skill"),
  education: z.string(),
  expertise: z.string().min(2, "Please enter at least one area of expertise"),
  experience_years: z
    .number(),
  achievements: z
    .string()

    .max(500, "Achievements must not exceed 500 characters"),
});

export type EditExpertProfileFormValues = z.infer<
  typeof editExpertProfileSchema
>;
