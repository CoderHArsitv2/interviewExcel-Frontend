import { z } from "zod";

export const studentSignInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type StudentSignInFormValues = z.infer<typeof studentSignInSchema>;
