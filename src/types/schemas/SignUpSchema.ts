import { z } from "zod";

export const studentSignUpSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirmPassword"], // show error under confirmPassword field
    message: "Passwords do not match",
  });

export type StudentSignUpFormValues = z.infer<typeof studentSignUpSchema>;
