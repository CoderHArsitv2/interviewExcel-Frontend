"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { WeeklyCalendar } from "@/app/components/Availability";
import { useState, useEffect } from "react";
import GenerateWeeklySlotsModal from "@/app/components/GenerateSlotModal";
import { useAuth } from "@/hooks/useAuth";
import { authenticatedGet } from "@/providers/api"; // ✅ assumes your wrapper for GET with token

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
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }
  return (
    <div className="w-[90vw] max-w-[1200px] mx-auto mb-10 my-12">
      <Card className="rounded-3xl border border-teal-500 shadow-xl shadow-teal-300/40 p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-teal-700 tracking-tight">
            Manage Sessions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="flex w-full h-15 rounded-xl gap-4 mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            {/* Upcoming Sessions */}
            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {sessions.filter((s) => s.status === "upcoming").length === 0 ? (
                <p className="text-gray-500">No upcoming sessions</p>
              ) : (
                sessions
                  .filter((s) => s.status === "upcoming")
                  .map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 rounded-xl flex justify-between items-center border shadow-md"
                    >
                      <div>
                        <p className="font-semibold text-lg">
                          {session.studentName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(session.date), "MMM dd, yyyy")} |{" "}
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          Mark Completed
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>

            {/* Past Sessions */}
            <TabsContent value="past" className="mt-4 space-y-4">
              {sessions.filter((s) => s.status === "completed").length === 0 ? (
                <p className="text-gray-500">No past sessions</p>
              ) : (
                sessions
                  .filter((s) => s.status === "completed")
                  .map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 rounded-xl flex justify-between items-center border shadow-md"
                    >
                      <div>
                        <p className="font-semibold text-lg">
                          {session.studentName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(session.date), "MMM dd, yyyy")} |{" "}
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    </Card>
                  ))
              )}
            </TabsContent>

            {/* Availability */}
            <TabsContent
              value="availability"
              className="flex flex-col justify-center items-center gap-6"
            >
              <Button
                size="lg"
                className="bg-teal-800 hover:bg-teal-900 text-white font-semibold"
                onClick={() => setIsOpen(true)}
              >
                + Generate Available Slots
              </Button>

              <WeeklyCalendar slots={slots} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
