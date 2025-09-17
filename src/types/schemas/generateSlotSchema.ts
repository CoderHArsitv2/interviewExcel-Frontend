import { z } from "zod";

export const GenerateWeeklySlotSchema = z.object({
  start_time: z.string().nonempty("Start time is required"),

  end_time: z.string().nonempty("End time is required"),

  duration: z
    .number("Duration is required")
    .min(15, "Minimum duration should be 15 minutes")
    .max(240, "Maximum duration can be 4 hours"),

  days: z
    .array(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
    )
    .nonempty("At least one day must be selected"),
});

// ✅ Type inference for TypeScript
export type GenerateWeeklySlotFormValues = z.infer<
  typeof GenerateWeeklySlotSchema
>;
