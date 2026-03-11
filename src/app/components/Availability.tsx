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

  return (
    <div className="w-full overflow-x-auto">
      {/* Week navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          ⬅️ Prev
        </button>
        <h2 className="font-bold text-lg">
          {format(weekStart, "MMM dd")} -{" "}
          {format(addDays(weekStart, 6), "MMM dd")}
        </h2>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Next ➡️
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 border border-gray-300 rounded-lg shadow-sm min-w-[900px]">
        {/* Header Row */}
        <div className="bg-gray-50 p-2 text-sm font-semibold sticky left-0 z-10">
          Time
        </div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 text-center text-sm font-semibold ${isToday(day)
              ? "bg-amber-100 text-amber-600 border-b-2 border-amber-500"
              : "bg-gray-50"
              }`}
          >
            {format(day, "EEE dd")}
          </div>
        ))}

        {times.map((time) => (
          <React.Fragment key={time}>
            {/* Time Column */}
            <div className="border-t border-gray-200 p-2 text-sm font-medium bg-gray-50 sticky left-0 z-10">
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
                  isWithinInterval(cellTime, { start: slotStart, end: slotEnd })
                );
              });

              return (
                <div
                  key={`${day.toISOString()}-${time}`}
                  className={`border-t border-l h-12 flex items-center justify-center cursor-pointer transition-all
            ${slot
                      ? slot.is_booked
                        ? "bg-red-100 text-red-600 font-medium"
                        : "bg-green-100 text-green-600 font-medium"
                      : "hover:bg-gray-100"
                    }
            ${isToday(day) ? "border-amber-300" : ""}
          `}
                  onClick={() => console.log("Clicked", day, time, slot)}
                >
                  {slot ? (slot.is_booked ? "Booked" : "Available") : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
