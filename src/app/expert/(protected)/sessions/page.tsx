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
import { Badge } from "@/components/ui/badge";

type Session = {
  id: number;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "completed" | "cancelled";
};

export type AvailabilitySlot = {
  id: number;
  expert_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: false;
};

const ExpertSessionsPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [sessions] = useState<Session[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sessions + slots from backend
  useEffect(() => {
    if (!user?.uuid) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch sessions
        const sessionsRes = await authenticatedGet<AvailabilitySlot[]>(`/expert/all-slots`);
        setSlots(sessionsRes || []);
      } catch (err) {
        console.error("Error fetching sessions/slots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uuid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-secondary/20 p-1 rounded-xl mb-8">
            <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Past</TabsTrigger>
            <TabsTrigger value="availability" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Availability</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming" className="space-y-4">
            {sessions.filter((s) => s.status === "upcoming").length === 0 ? (
              <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No upcoming sessions scheduled</p>
                <p className="text-sm text-gray-400">Generate slots to get booked!</p>
              </div>
            ) : (
              sessions
                .filter((s) => s.status === "upcoming")
                .map((session) => (
                  <div
                    key={session.id}
                    className="bg-white/60 backdrop-blur-sm p-5 rounded-xl flex flex-col md:flex-row justify-between items-center border border-white/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">
                          {session.studentName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {format(new Date(session.date), "MMM dd, yyyy")} • {session.startTime} - {session.endTime}
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
            {sessions.filter((s) => s.status === "completed").length === 0 ? (
              <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No past sessions found</p>
              </div>
            ) : (
              sessions
                .filter((s) => s.status === "completed")
                .map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-50/50 p-5 rounded-xl flex justify-between items-center border border-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-700">
                        {session.studentName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(session.date), "MMM dd, yyyy")} | {session.startTime} - {session.endTime}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      Completed
                    </Badge>
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
              <WeeklyCalendar slots={slots} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GenerateWeeklySlotsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        expertId={user?.uuid || ""}
        onSave={() => setIsOpen(false)}
      />
    </div>
  );
};

export default ExpertSessionsPage;
