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
          <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-200/40 text-primary shadow-sm">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 leading-tight">
              {format(weekStart, "MMM dd")} –{" "}
              {format(addDays(weekStart, 6), "MMM dd, yyyy")}
            </h2>
            <p className="text-xs text-gray-500">Weekly availability overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
            className="px-4 h-9 rounded-full text-sm font-medium bg-white/70 border border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm transition-all"
          >
            Today
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            aria-label="Previous week"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/70 border border-gray-200 text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            aria-label="Next week"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/70 border border-gray-200 text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-medium text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500" />
          Available <span className="text-gray-400">({availableCount})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-500" />
          Booked <span className="text-gray-400">({bookedCount})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gray-100 border border-gray-200" />
          Free
        </span>
      </div>

      {/* Grid */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200/80 shadow-sm bg-white/70">
        <div className="grid grid-cols-8 min-w-[900px]">
          {/* Header Row */}
          <div className="bg-gray-50/80 backdrop-blur-sm p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky left-0 z-20 border-b border-gray-200">
            Time
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`p-3 text-center border-b border-gray-200 ${
                isToday(day)
                  ? "bg-gradient-to-b from-amber-50 to-white"
                  : "bg-gray-50/80"
              }`}
            >
              <p
                className={`text-[11px] uppercase tracking-wide ${
                  isToday(day) ? "text-amber-600 font-bold" : "text-gray-400"
                }`}
              >
                {format(day, "EEE")}
              </p>
              <p
                className={`text-sm font-semibold ${
                  isToday(day) ? "text-amber-700" : "text-gray-700"
                }`}
              >
                {format(day, "dd")}
              </p>
            </div>
          ))}

          {times.map((time, rowIdx) => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div className="border-t border-gray-100 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50/80 backdrop-blur-sm sticky left-0 z-10 flex items-center">
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
                    className={`border-t border-l border-gray-100 h-11 flex items-center justify-center transition-all
                      ${
                        slot
                          ? isBooked
                            ? "bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600"
                            : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 cursor-pointer"
                          : `${rowIdx % 2 === 0 ? "bg-white/40" : "bg-gray-50/30"} hover:bg-amber-50/60 cursor-pointer`
                      }
                      ${isToday(day) ? "border-l-amber-200" : ""}
                    `}
                    onClick={() => console.log("Clicked", day, time, slot)}
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
