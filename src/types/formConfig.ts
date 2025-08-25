import { studentSignUpSchema } from "./schemas/SignUpSchema";
import { studentSignInSchema } from "./schemas/SignInSchema";

export interface Fields {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  colSpan?: number;
  asyncOptions?: () => Promise<{ label: string; value: string | number }[]>;
  valueAsNumber?: boolean;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number | boolean;
}

export const signUpFormFields = {
  fields: [
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Create a password",
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      required: true,
      placeholder: "Re-enter your password",
    },
  ],
  schema: studentSignUpSchema,
};

export const signInFormFields = {
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter your password",
    },
  ],
  schema: studentSignInSchema,
};
