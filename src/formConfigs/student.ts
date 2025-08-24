import { z } from "zod";

export const studentSignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type StudentSignUpForm = z.infer<typeof studentSignUpSchema>;
