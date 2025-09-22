"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyCalendar } from "@/app/components/Availability";
import { useState, useEffect } from "react";
import GenerateWeeklySlotsModal from "@/app/components/GenerateSlotModal";
import { useAuth } from "@/hooks/useAuth";
import { authenticatedGet } from "@/providers/api";

type AvailabilitySlot = {
  id: number;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isBooked: boolean;
};

const ExpertSessionsPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch slots from backend
  useEffect(() => {
    if (!user?.uuid) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        const res: any = await authenticatedGet(`/expert/all-slots`);
        const backendSlots = res?.data || [];

        const mappedSlots: AvailabilitySlot[] = backendSlots.map((slot: any) => ({
          id: slot.id,
          date: new Date(slot.date).toISOString().split("T")[0], // "2025-09-22"
          startTime: new Date(slot.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(slot.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isBooked: slot.is_booked,
        }));

        setSlots(mappedSlots);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [user?.uuid]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="w-[90vw] max-w-[1200px] mx-auto mb-10 my-12">
      <Card className="rounded-3xl border border-teal-500 shadow-xl shadow-teal-300/40 p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-teal-700 tracking-tight">
            Manage Availability
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="availability">
            <TabsList className="flex w-full h-15 rounded-xl gap-4 mb-6">
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

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
