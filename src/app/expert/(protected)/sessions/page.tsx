"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { WeeklyCalendar } from "@/app/components/Availability";
import { useState, useEffect } from "react";
import GenerateWeeklySlotsModal from "@/app/components/GenerateSlotModal";
import { useAuth } from "@/hooks/useAuth";
import { authenticatedGet } from "@/providers/api";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
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

const SlotsLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
  </div>
);

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
    <div className="max-w-7xl mx-auto mb-10 my-6 px-4">
      <div className="glass rounded-3xl border border-white/40 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Manage <span className="text-primary">Sessions</span>
            </h1>
            <p className="text-gray-500 mt-1">
              View upcoming meetings and manage your availability.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
            onClick={() => setIsOpen(true)}
          >
            + Generate Slots
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-amber-50 p-1 rounded-xl mb-8">
            <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Past</TabsTrigger>
            <TabsTrigger value="availability" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Availability</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming" className="space-y-4">
            {isTabLoading ? (
              <SlotsLoader />
            ) : upcomingSlots.length === 0 ? (
              <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No upcoming sessions scheduled</p>
                <p className="text-sm text-gray-400">Generate slots to get booked!</p>
              </div>
            ) : (
              upcomingSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white/60 backdrop-blur-sm p-5 rounded-xl flex flex-col md:flex-row justify-between items-center border border-white/50 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-gray-900">
                          Booked Session
                        </p>
                        <StatusPill status={slot.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {format(new Date(slot.start_time), "MMM dd, yyyy")} • {format(new Date(slot.start_time), "h:mm a")} - {format(new Date(slot.end_time), "h:mm a")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button
                      size="sm"
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1 md:flex-none">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Past Sessions */}
          <TabsContent value="past" className="space-y-4">
            {isTabLoading ? (
              <SlotsLoader />
            ) : pastSlots.length === 0 ? (
              <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No past sessions found</p>
              </div>
            ) : (
              pastSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gray-50/50 p-5 rounded-xl flex justify-between items-center border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-200 p-3 rounded-full text-gray-500">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-700">
                        {slot.status?.toLowerCase() === "booked"
                          ? "Booked Session"
                          : "Open Slot"}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {format(new Date(slot.start_time), "MMM dd, yyyy")} • {format(new Date(slot.start_time), "h:mm a")} - {format(new Date(slot.end_time), "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={slot.status} />
                </div>
              ))
            )}
          </TabsContent>

          {/* Availability */}
          <TabsContent
            value="availability"
            className="flex flex-col gap-6"
          >
            <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm">
              {isTabLoading ? (
                <SlotsLoader />
              ) : (
                <WeeklyCalendar slots={allSlots} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
