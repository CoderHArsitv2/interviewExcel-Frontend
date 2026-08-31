"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { WeeklyCalendar } from "@/app/components/Availability";
import { useState, useEffect } from "react";
import GenerateWeeklySlotsModal from "@/app/components/GenerateSlotModal";
import { useAuth } from "@/hooks/useAuth";
import { authenticatedGet } from "@/providers/api";
import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import StatusPill from "@/app/components/StatusPill";

export type SlotStatus = "available" | "booked";

export type AvailabilitySlot = {
  id: number;
  expert_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: SlotStatus;
};

// Which tab maps to which `filter` query param on /expert/all-slots.
type SlotFilter = "upcoming" | "past" | "all";
const TAB_TO_FILTER: Record<string, SlotFilter> = {
  upcoming: "upcoming",
  past: "past",
  availability: "all",
};

const TAB_TRIGGER_CLASS =
  "rounded-xl h-9 font-semibold text-slate-600 dark:text-slate-400 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300 data-[state=active]:shadow-sm";

const SlotsLoader = () => (
  <div className="flex justify-center items-center py-16">
    <span className="h-10 w-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Calendar;
  title: string;
  hint?: string;
}) => (
  <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30">
    <Icon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
    <p className="font-semibold text-slate-700 dark:text-slate-200">{title}</p>
    {hint && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>
    )}
  </div>
);

const formatSlotRange = (slot: AvailabilitySlot) =>
  `${format(new Date(slot.start_time), "MMM dd, yyyy")} • ${format(
    new Date(slot.start_time),
    "h:mm a"
  )} – ${format(new Date(slot.end_time), "h:mm a")}`;

const ExpertSessionsPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  // Cache slots per filter so switching tabs doesn't refetch.
  const [slotsByFilter, setSlotsByFilter] = useState<
    Record<SlotFilter, AvailabilitySlot[] | undefined>
  >({ upcoming: undefined, past: undefined, all: undefined });
  const [loading, setLoading] = useState(false);

  const activeFilter = TAB_TO_FILTER[activeTab];

  // Fetch the active tab's slots (if not already cached) using a query param.
  useEffect(() => {
    if (!user?.uuid) return;
    if (slotsByFilter[activeFilter]) return; // already loaded

    let cancelled = false;
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const res = await authenticatedGet<AvailabilitySlot[]>(
          `/expert/all-slots?filter=${activeFilter}`
        );
        if (!cancelled) {
          setSlotsByFilter((prev) => ({ ...prev, [activeFilter]: res || [] }));
        }
      } catch (err) {
        console.warn("Error fetching slots:", err);
        if (!cancelled) {
          setSlotsByFilter((prev) => ({ ...prev, [activeFilter]: [] }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [user?.uuid, activeFilter, slotsByFilter]);

  // Invalidate a cached filter so it refetches next time it's viewed.
  const invalidate = (filter: SlotFilter) =>
    setSlotsByFilter((prev) => ({ ...prev, [filter]: undefined }));

  // Upcoming = booked slots, soonest first.
  const upcomingSlots = (slotsByFilter.upcoming || [])
    .filter((s) => s.status?.toLowerCase() === "booked")
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

  // Past = most recent first.
  const pastSlots = (slotsByFilter.past || []).sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  );

  const allSlots = slotsByFilter.all || [];

  const isTabLoading = loading && !slotsByFilter[activeFilter];

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="profile-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="shrink-0 p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
            <Calendar className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Manage Sessions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              View upcoming meetings and manage your weekly availability.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="btn-expert-primary shrink-0 flex items-center justify-center gap-2"
        >
          <CalendarPlus className="w-4 h-4" />
          Generate Slots
        </button>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-auto w-full md:w-[420px] grid-cols-3 gap-1 p-1 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 mb-5">
          <TabsTrigger value="upcoming" className={TAB_TRIGGER_CLASS}>
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className={TAB_TRIGGER_CLASS}>
            Past
          </TabsTrigger>
          <TabsTrigger value="availability" className={TAB_TRIGGER_CLASS}>
            Availability
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Sessions */}
        <TabsContent value="upcoming" className="space-y-3">
          {isTabLoading ? (
            <SlotsLoader />
          ) : upcomingSlots.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming sessions scheduled"
              hint="Generate slots to get booked!"
            />
          ) : (
            upcomingSlots.map((slot) => (
              <div
                key={slot.id}
                className="profile-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300/70 dark:hover:border-amber-700/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="shrink-0 p-3 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
                    <Calendar className="w-6 h-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        Booked Session
                      </p>
                      <StatusPill status={slot.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="truncate">{formatSlotRange(slot)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 font-semibold border border-rose-200/70 dark:border-rose-800/40 shadow-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Past Sessions */}
        <TabsContent value="past" className="space-y-3">
          {isTabLoading ? (
            <SlotsLoader />
          ) : pastSlots.length === 0 ? (
            <EmptyState icon={Clock} title="No past sessions found" />
          ) : (
            pastSlots.map((slot) => (
              <div
                key={slot.id}
                className="profile-card p-4 sm:p-5 flex items-center justify-between gap-4 opacity-90"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="shrink-0 p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-6 h-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-base sm:text-lg text-slate-700 dark:text-slate-200">
                      {slot.status?.toLowerCase() === "booked"
                        ? "Booked Session"
                        : "Open Slot"}
                    </p>
                    <p className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="truncate">{formatSlotRange(slot)}</span>
                    </p>
                  </div>
                </div>
                <StatusPill status={slot.status} className="shrink-0" />
              </div>
            ))
          )}
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability">
          <div className="profile-card p-4 sm:p-6">
            {isTabLoading ? (
              <SlotsLoader />
            ) : (
              <WeeklyCalendar slots={allSlots} />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <GenerateWeeklySlotsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        expertId={user?.uuid || ""}
        onSave={() => {
          setIsOpen(false);
          // New slots affect availability + upcoming — refetch those next view.
          invalidate("all");
          invalidate("upcoming");
        }}
      />
    </div>
  );
};

export default ExpertSessionsPage;
