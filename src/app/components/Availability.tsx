"use client";
import React, { useState } from "react";
import {
  addDays,
  format,
  startOfWeek,
  isToday,
  parse,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { AvailabilitySlot } from "../expert/(protected)/sessions/page";

// ⏰ Half-hour grid instead of full hours
const times = Array.from({ length: 24 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8; // Start at 8 AM
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minutes}`;
});

const NAV_BUTTON_CLASS =
  "h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-300 hover:shadow-sm transition-all";

interface props {
  slots: AvailabilitySlot[];
}
export const WeeklyCalendar = ({ slots }: props) => {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const availableCount = slots.filter(
    (s) => s.status?.toLowerCase() === "available"
  ).length;
  const bookedCount = slots.filter(
    (s) => s.status?.toLowerCase() === "booked"
  ).length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 shadow-sm">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
              {format(weekStart, "MMM dd")} –{" "}
              {format(addDays(weekStart, 6), "MMM dd, yyyy")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weekly availability overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
            className={`${NAV_BUTTON_CLASS} px-4 text-sm font-semibold`}
          >
            Today
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            aria-label="Previous week"
            className={`${NAV_BUTTON_CLASS} w-9`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            aria-label="Next week"
            className={`${NAV_BUTTON_CLASS} w-9`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500" />
          Available{" "}
          <span className="text-slate-400 dark:text-slate-500">
            ({availableCount})
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-500" />
          Booked{" "}
          <span className="text-slate-400 dark:text-slate-500">
            ({bookedCount})
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-white/10" />
          Free
        </span>
      </div>

      {/* Grid */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm bg-white/70 dark:bg-slate-900/40">
        <div className="grid grid-cols-8 min-w-[900px]">
          {/* Header Row */}
          <div className="bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky left-0 z-20 border-b border-slate-200 dark:border-white/10">
            Time
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`p-3 text-center border-b border-slate-200 dark:border-white/10 ${
                isToday(day)
                  ? "bg-amber-50 dark:bg-amber-950/40"
                  : "bg-slate-50/80 dark:bg-slate-800/60"
              }`}
            >
              <p
                className={`text-[11px] uppercase tracking-wide ${
                  isToday(day)
                    ? "text-amber-600 dark:text-amber-300 font-bold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {format(day, "EEE")}
              </p>
              <p
                className={`text-sm font-semibold ${
                  isToday(day)
                    ? "text-amber-700 dark:text-amber-200"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {format(day, "dd")}
              </p>
            </div>
          ))}

          {times.map((time, rowIdx) => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div className="border-t border-slate-100 dark:border-white/5 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm sticky left-0 z-10 flex items-center">
                {time}
              </div>

              {/* Slots */}
              {days.map((day) => {
                const cellTime = parse(time, "HH:mm", day);

                const slot = slots.find((s) => {
                  const slotStart = new Date(s.start_time);
                  const slotEnd = new Date(s.end_time);
                  return (
                    format(new Date(s.date), "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd") &&
                    isWithinInterval(cellTime, {
                      start: slotStart,
                      end: slotEnd,
                    })
                  );
                });

                const isBooked = slot?.status?.toLowerCase() === "booked";

                return (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    title={
                      slot
                        ? `${isBooked ? "Booked" : "Open"} · ${format(
                            day,
                            "EEE dd MMM"
                          )} ${time}`
                        : undefined
                    }
                    className={`border-t border-l border-slate-100 dark:border-white/5 h-11 flex items-center justify-center transition-colors
                      ${
                        slot
                          ? isBooked
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                          : rowIdx % 2 === 0
                          ? "bg-white/40 dark:bg-slate-900/20"
                          : "bg-slate-50/40 dark:bg-slate-800/20"
                      }
                      ${
                        isToday(day)
                          ? "border-l-amber-200 dark:border-l-amber-800/50"
                          : ""
                      }
                    `}
                  >
                    {slot && (
                      <span className="text-[11px] font-semibold tracking-wide">
                        {isBooked ? "Booked" : "Open"}
                      </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
