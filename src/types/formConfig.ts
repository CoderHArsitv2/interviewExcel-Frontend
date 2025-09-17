import { studentSignUpSchema } from "./schemas/SignUpSchema";
import { studentSignInSchema } from "./schemas/SignInSchema";
import { editProfileSchema } from "./schemas/EditProfileSchema";
import { editExpertProfileSchema } from "./schemas/EditExpertProfileSchema";

export interface Fields {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  colSpan?: number;
  asyncOptions?: () => Promise<{ label: string; value: string | number }[]>;
  valueAsNumber?: boolean;
  placeholder?: string;
  options?:Options[]
  disabled?: boolean;
  defaultValue?: string | number | boolean;
}

export interface Options{
  label?:string,
  value?:string
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

export const editExpertProfileFormFields = {
  fields: [
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
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
      name: "skills",
      label: "Skills",
      type: "text",
      required: true,
      placeholder: "Enter your skills separated by commas",
    },
    {
      name: "expertise",
      label: "Expertise",
      type: "text",
      required: true,
      placeholder: "Enter your areas of expertise (comma separated)",
    },
    {
      name: "experience_years",
      label: "Experience",
      type: "number",
      required: false,
      placeholder: "Years of experience",
    },
    {
      name: "achievements",
      label: "Achievements",
      type: "textarea",
      required: false,
      placeholder: "List your achievements, separated by commas",
    },
    {
      name: "fees_per_session",
      label: "Fee Per Session",
      type: "number",
      required: true,
      placholder: "What Fees Will you charge",
    },
  ],
  schema: editExpertProfileSchema,
};

export const generateWeeklySlotFormFields = {
  fields: [
    {
      name: "start_time",
      placeholder: "Time you are free from",
      label: "Start Time",
      required: true,
      type: "time",
    },
    {
      name: "end_time",
      placeholder: "Time you are free up to",
      label: "End Time",
      required: true,
      type: "time",
    },
    {
      name: "duration",
      type: "number",
      label: "Duration (minutes)",
      placeholder: "e.g. 30",
      required: true,
    },
    {
      name: "days",
      type: "checkbox",
      label: "Select Days",
      required: true,
      options: [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
      ],
    },
  ],
};
