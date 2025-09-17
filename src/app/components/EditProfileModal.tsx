"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FieldErrors,
  FieldValues,
  FormProvider,
  get,
  Path,
  useForm,
} from "react-hook-form";
import { authenticatedPost, authenticatedPut, post } from "@/providers/api";
import toast from "react-hot-toast";
import { editProfileFormFields, Fields } from "@/types/formConfig";
import { EditProfileFormValues } from "@/types/schemas/EditProfileSchema";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    phone?: string;
    city: string;
    dob: string;
    preparing_for?: string;
    about_me: string;
    skills?: string[];
    expertise?: string[];
  };
  onSave: (updatedProfile: any) => void;
}

function getError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>
) {
  return get(errors, name);
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const methods = useForm<EditProfileFormValues>({
    defaultValues: {
      full_name: profile.name,
      phone: profile.phone,
      city: profile.city,
      dob: profile.dob,
      preparing_for: profile.preparing_for,
      about_me: profile.about_me, ////
      skills: profile.skills?.join(", "),
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const formattedDOB = data.dob ? new Date(data.dob).toISOString() : null;

      const res: any = await authenticatedPut("/student/profile", {
        ...data,
        role: "student",
        dob: formattedDOB, // better keep consistent key name
        skills: data.skills?.split(",").map((s) => s.trim()),
      });

      toast.success("Profile updated successfully");

      reset(res?.data);
      onSave(res?.data);

      // close modal
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Profile update failed");
    }
  };

  const formConfig = editProfileFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<EditProfileFormValues> }
  >;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white border-theme  rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
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
