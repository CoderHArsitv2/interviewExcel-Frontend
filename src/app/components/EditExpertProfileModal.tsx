"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { authenticatedPut, ApiResponse } from "@/providers/api";
import { editExpertProfileFormFields } from "@/types/formConfig";
import { FormFields } from "@/app/components/form";
import { EditExpertProfileFormValues } from "@/types/schemas/EditExpertProfileSchema";
import { Loader2, Sparkles, Save } from "lucide-react";
import toast from "react-hot-toast";

interface EditExpertProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    full_name: string;
    expertise: string;
    fees_per_session: number | null;
    about_me: string;
    experience: number;
    achievements: string;
    city: string;
    dob: string;
    phone: string;
    profile_picture_key?: string | null;
  };
  onSave: (updatedProfile: EditExpertProfileFormValues) => void;
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
      expertise: profile.expertise || "",
      fees_per_session: profile.fees_per_session || null,
      experience_years: profile.experience || 0,
      achievements: profile.achievements || "",
      city: profile.city || "",
      dob: profile.dob || "",
      phone: profile.phone || "",
      profile_picture_key: profile.profile_picture_key || null,
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: EditExpertProfileFormValues) => {
    try {
      const formattedDOB = data.dob ? new Date(data.dob).toISOString() : null;
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
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Expert Profile
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your professional credentials, fees, and consultation details.
              </p>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <FormFields
                fields={editExpertProfileFormFields.fields}
                accent="expert"
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
                className="btn-expert-primary text-sm flex items-center gap-2 disabled:opacity-60"
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
