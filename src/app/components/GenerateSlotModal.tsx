"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authenticatedPost, ApiResponse } from "@/providers/api";
import { GenerateWeeklySlotFormValues } from "@/types/schemas/generateSlotSchema";
import { generateWeeklySlotFormFields } from "@/types/formConfig";
import { FormFields } from "@/app/components/form";
import { CalendarPlus, Loader2 } from "lucide-react";

interface GenerateWeeklySlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string | null;
  onSave: (slots: unknown[]) => void; // callback after success
}
export default function GenerateWeeklySlotsModal({
  isOpen,
  onClose,
  expertId,
  onSave,
}: GenerateWeeklySlotsModalProps) {
  const methods = useForm<GenerateWeeklySlotFormValues>({
    defaultValues: {
      start_time: "09:00",
      end_time: "17:00",
      duration: 60,
      days: [],
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: GenerateWeeklySlotFormValues) => {
    try {
      const res = await authenticatedPost<ApiResponse<unknown>>(
        "/expert/generate-slots",
        {
          ...data,
          expert_id: expertId,
        }
      );

      toast.success("Weekly slots generated successfully");

      onSave((res?.data as unknown[]) || []);
      reset();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.warn(error);
      toast.error(error?.message || "Failed to generate slots");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <CalendarPlus className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Generate Weekly Availability
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pick your hours and days — we&apos;ll split them into bookable
                slots.
              </p>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <FormFields
                fields={generateWeeklySlotFormFields.fields}
                accent="expert"
                columns={2}
                withIcons={false}
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
                  <CalendarPlus className="w-4 h-4" />
                )}
                <span>Generate Slots</span>
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
