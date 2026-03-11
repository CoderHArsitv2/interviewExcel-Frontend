"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldErrors, FieldValues, FormProvider, get, Path, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authenticatedPost, ApiResponse } from "@/providers/api";
import { GenerateWeeklySlotFormValues } from "@/types/schemas/generateSlotSchema";
import { Fields, generateWeeklySlotFormFields } from "@/types/formConfig";

interface GenerateWeeklySlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string | null;
  onSave: (slots: unknown[]) => void; // callback after success
}
function getError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>
) {
  return get(errors, name);
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
      const res = await authenticatedPost<ApiResponse<unknown>>("/expert/generate-slots", {
        ...data,
        expert_id: expertId,
      });

      toast.success("Weekly slots generated successfully");

      onSave((res?.data as unknown[]) || []);
      reset();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error(error);
      toast.error(error.message || "Failed to generate slots");
    }
  };

  const formConfig = generateWeeklySlotFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<GenerateWeeklySlotFormValues> }
  >;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white border-theme rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Generate Weekly Availability</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formConfig.map((field) => {
              const error = getError(formState.errors, field.name);

              if (field.type === "checkbox" && field.options) {
                return (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="font-medium text-sm">{field.label}</label>
                    <div className="flex flex-wrap gap-3">
                      {field.options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={option.value}
                            {...methods.register(field.name)}
                            className="w-4 h-4 accent-amber-600"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {(error as { message?: string })?.message}
                      </p>
                    )}
                  </div>
                );
              }

              // default input (time, number, text, etc.)
              return (
                <div key={field.name} className="flex flex-col">
                  <label className="font-medium text-sm mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder || field.label}
                    {...methods.register(field.name, { valueAsNumber: field.type === "number" })}
                    className={`p-3 border-2 rounded-lg outline-none transition text-sm sm:text-base ${error
                      ? "border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-amber-500"
                      }`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">
                      {(error as { message?: string })?.message}
                    </p>
                  )}
                </div>
              );
            })}


            {/* Submit Button */}
            <button
              type="submit"
              className="bg-amber-600 text-white p-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Generate Slots
            </button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
