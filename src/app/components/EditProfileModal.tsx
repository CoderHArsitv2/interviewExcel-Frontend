"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authenticatedPut, ApiResponse } from "@/providers/api";
import { editProfileFormFields } from "@/types/formConfig";
import { EditProfileFormValues } from "@/types/schemas/EditProfileSchema";
import { FormFields } from "@/app/components/form";
import { Loader2, Save, UserCog } from "lucide-react";

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
  onSave: (updatedProfile: EditProfileFormValues) => void;
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
      about_me: profile.about_me,
      skills: profile.skills?.join(", "),
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const formattedDOB = data.dob ? new Date(data.dob).toISOString() : null;

      const res = await authenticatedPut<ApiResponse<EditProfileFormValues>>(
        "/student/profile",
        {
          ...data,
          role: "student",
          dob: formattedDOB, // better keep consistent key name
          skills: data.skills?.split(",").map((s) => s.trim()),
        }
      );

      reset(res?.data);
      onSave(res?.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.warn(error);
      toast.error(error?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <UserCog className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Profile
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your details so mentors know what you&apos;re preparing
                for.
              </p>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <FormFields
                fields={editProfileFormFields.fields}
                accent="student"
                columns={2}
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2"
              >
                {formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
