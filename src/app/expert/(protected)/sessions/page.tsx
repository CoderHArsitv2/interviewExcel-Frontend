"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

type Session = {
  id: number;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "completed" | "cancelled";
};

type AvailabilitySlot = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const dummySessions: Session[] = [
  {
    id: 1,
    studentName: "Aman Sharma",
    date: "2025-09-18",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
  },
  {
    id: 2,
    studentName: "Priya Singh",
    date: "2025-09-10",
    startTime: "15:00",
    endTime: "16:00",
    status: "completed",
  },
];

const dummySlots: AvailabilitySlot[] = [
  { id: 1, date: "2025-09-20", startTime: "14:00", endTime: "15:00", isBooked: false },
  { id: 2, date: "2025-09-21", startTime: "09:00", endTime: "10:00", isBooked: true },
];

const ExpertSessionsPage = () => {
  return (
    <div className="w-[90vw] max-w-[1200px] mx-auto mb-10 my-12">
      <Card className="rounded-3xl border border-teal-500 shadow-xl shadow-teal-300/40 p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-teal-700 tracking-tight">
            Manage Sessions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            {/* Tabs Navigation */}
            <TabsList className="flex w-full justify-around bg-gray-100 rounded-xl p-1 mb-6">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all hover:bg-teal-100 data-[state=active]:shadow-md"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all hover:bg-teal-100 data-[state=active]:shadow-md"
              >
                Past
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all hover:bg-teal-100 data-[state=active]:shadow-md"
              >
                Availability
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Sessions */}
            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {dummySessions
                .filter((s) => s.status === "upcoming")
                .map((session) => (
                  <Card
                    key={session.id}
                    className="p-4 rounded-xl flex justify-between items-center border border-gray-200 shadow-md hover:shadow-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-lg">{session.studentName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(session.date), "MMM dd, yyyy")} | {session.startTime} -{" "}
                        {session.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Mark Completed
                      </Button>
                      <Button size="sm" variant="destructive">
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            {/* Past Sessions */}
            <TabsContent value="past" className="mt-4 space-y-4">
              {dummySessions
                .filter((s) => s.status === "completed")
                .map((session) => (
                  <Card
                    key={session.id}
                    className="p-4 rounded-xl flex justify-between items-center border border-gray-200 shadow-md hover:shadow-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-lg">{session.studentName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(session.date), "MMM dd, yyyy")} | {session.startTime} -{" "}
                        {session.endTime}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold">Completed</span>
                  </Card>
                ))}
            </TabsContent>

            {/* Availability Slots */}
            <TabsContent value="availability" className="mt-4 space-y-4">
              {dummySlots.map((slot) => (
                <Card
                  key={slot.id}
                  className="p-4 rounded-xl flex justify-between items-center border border-gray-200 shadow-md hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {format(new Date(slot.date), "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {slot.isBooked ? (
                      <span className="text-red-500 font-semibold">Booked</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Available</span>
                    )}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
              <Button className="mt-4 bg-teal-700 hover:bg-teal-600">
                + Add New Slot
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertSessionsPage;
