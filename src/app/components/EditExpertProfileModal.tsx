"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormProvider,
  get,
  Path,
  useForm,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { authenticatedPut, ApiResponse } from "@/providers/api";
import toast from "react-hot-toast";
import { Fields, editExpertProfileFormFields } from "@/types/formConfig";
import { EditExpertProfileFormValues } from "@/types/schemas/EditExpertProfileSchema";

interface EditExpertProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    full_name: string;
    expertise: string; // convert array → comma string
    fees_per_session: number | null;
    about_me: string;
    experience: number;
    achievements: string;
    city: string;
    dob: string;
    phone: string;
  };
  onSave: (updatedProfile: EditExpertProfileFormValues) => void;
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
      full_name: profile.full_name,
      expertise: profile.expertise || "", // convert array → comma string
      fees_per_session: profile.fees_per_session || null,
      experience_years: profile.experience || 0,
      achievements: profile.achievements || "",
      city: profile.city || "",
      dob: profile.dob || "",
      phone: profile.phone || "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: EditExpertProfileFormValues) => {
    try {
      const formattedDOB = data.dob ? new Date(data.dob).toISOString() : null;
      console.log("experienxe years", data.experience_years)
      const res = await authenticatedPut<ApiResponse<EditExpertProfileFormValues>>("/expert/profile", {
        ...data,
        role: "expert",
        dob: formattedDOB,
        fees_per_session: data?.fees_per_session
          ? data.fees_per_session * 100
          : 0,
        experience_years: Number(data.experience_years),
      });

      reset(res?.data);
      onSave(res?.data);
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error(error);
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
            <div className="max-h-[70vh] overflow-y-auto px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {formConfig.map((field) => {
                  const error = getError(formState.errors, field.name);
                  return (
                    <div key={field.name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder || field.label}
                        {...methods.register(field.name)}
                        className={`p-2 border rounded-lg text-sm sm:text-base outline-none transition ${error
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {(error as { message?: string })?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-sky-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-sky-900 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
