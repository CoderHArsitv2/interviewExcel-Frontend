"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, get, Path, useForm, FieldErrors, FieldValues } from "react-hook-form";
import { authenticatedPut } from "@/providers/api";
import toast from "react-hot-toast";
import { Fields, editExpertProfileFormFields } from "@/types/formConfig";
import { EditExpertProfileFormValues } from "@/types/schemas/EditExpertProfileSchema"; 

interface EditExpertProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    bio?: string;
    expertise: string;
    experience_years: number;
    fees_per_session: number;
    profile_picture_url?: string;
    skills?: string[];
  };
  onSave: (updatedProfile: any) => void;
}

function getError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>
) {
  return get(errors, name);
}

export default function EditExpertProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditExpertProfileModalProps) {
const methods = useForm<EditExpertProfileFormValues>({
  defaultValues: {
    full_name: profile.name,
    expertise: profile.expertise || "",  // convert array → comma string
    fees_per_session: profile.fees_per_session || null,
    profile_picture_url: profile.profile_picture_url || "",
    skills: profile.skills?.join(", ") || "",       // convert array → comma string
    about_me: "",
    experience: "",
    achievements: "",
    city:  "",
    dob:"",
    phone: "",
  },
});

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: EditExpertProfileFormValues) => {
    try {
      const res: any = await authenticatedPut("/expert/profile", {
        ...data,
        role: "expert",
        skills: data.skills?.split(",").map((s) => s.trim()),
      });

      toast.success("Profile updated successfully");

      reset(res?.data);
      onSave(res?.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Profile update failed");
    }
  };

  const formConfig = editExpertProfileFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<EditExpertProfileFormValues> }
  >;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white border-theme rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Edit Expert Profile</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formConfig.map((field) => {
              const error = getError(formState.errors, field.name);

              return (
                <div key={field.name} className="flex flex-col">
                  <input
                    type={field.type}
                    placeholder={field.placeholder || field.label}
                    {...methods.register(field.name)}
                    className={`p-3 border-2 rounded-lg outline-none transition text-sm sm:text-base ${
                      error
                        ? "border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">
                      {(error as any).message}
                    </p>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="bg-sky-800 text-white p-3 rounded-lg font-semibold hover:bg-sky-900 transition"
            >
              Save
            </button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
