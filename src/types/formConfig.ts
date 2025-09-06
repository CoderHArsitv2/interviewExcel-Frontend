import { studentSignUpSchema } from "./schemas/SignUpSchema";
import { studentSignInSchema } from "./schemas/SignInSchema";
import { editProfileSchema } from "./schemas/EditProfileSchema";

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

export const editProfileFormFields = {
  fields: [
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your name",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
      placeholder: "Enter your phone number",
    },
    {
      name: "city",
      label: "City",
      type: "text",
      required: true,
      placeholder: "Enter your city",
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      required: true,
      placeholder: "Enter your date of birth",
    },
    {
      name: "preparing_for",
      label: "Preparing For",
      type: "text",
      required: true,
      placeholder: "Enter what you are preparing for",
    },
    {
      name: "about_me",
      label: "About Me",
      type: "textarea",
      required: true,
      placeholder: "Tell us about yourself",
    },
    {
      name: "skills",
      label: "Skills",
      type: "text",
      required: true,
      placeholder: "Enter your skills separated by commas",
    },
  ],
  schema: editProfileSchema,
};
