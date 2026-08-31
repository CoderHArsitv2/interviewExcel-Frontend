"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { AvailabilitySlot } from "@/app/expert/(protected)/sessions/page";
import { useState } from "react";
import { Calendar, CalendarX2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: AvailabilitySlot[];
  expertName: string;
  onBook: (slotId: number) => void;
}

export default function SlotSelectionModal({
  isOpen,
  onClose,
  slots,
  expertName,
  onBook,
}: SlotSelectionModalProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // Only available slots can be booked; booked ones must not be offered.
  const availableSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "available"
  );

  const handleBook = () => {
    if (selectedSlotId) {
      onBook(selectedSlotId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-0 overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-700 dark:via-purple-800 dark:to-indigo-800 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold text-white">
              Book a Session
            </DialogTitle>
            <p className="text-sm opacity-80 mt-1">
              Select a time slot with {expertName}
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          {availableSlots.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30">
              <CalendarX2 className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No available slots
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This expert hasn&apos;t opened any bookable times yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {availableSlots.map((slot) => {
                const startTime = new Date(slot.start_time);
                const isSelected = selectedSlotId === slot.id;

                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "relative p-3 rounded-2xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-200 dark:ring-purple-800/50 ring-offset-1 ring-offset-white dark:ring-offset-slate-900"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-white dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className={cn(
                          "w-3 h-3",
                          isSelected
                            ? "text-purple-600 dark:text-purple-300"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isSelected
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {format(startTime, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        className={cn(
                          "w-4 h-4",
                          isSelected
                            ? "text-purple-600 dark:text-purple-300"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isSelected
                            ? "text-purple-900 dark:text-purple-200"
                            : "text-slate-700 dark:text-slate-200"
                        )}
                      >
                        {format(startTime, "h:mm a")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBook}
              disabled={!selectedSlotId}
              className="btn-student-primary text-sm disabled:opacity-50 disabled:hover:scale-100"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
