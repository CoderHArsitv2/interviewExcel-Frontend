"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AvailabilitySlot } from "@/app/expert/(protected)/sessions/page";
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

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

    const handleBook = () => {
        if (selectedSlotId) {
            onBook(selectedSlotId);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Book a Session</DialogTitle>
                        <p className="text-blue-100 text-sm mt-1">Select a time slot with {expertName}</p>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {slots.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No available slots found for this expert.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                            {slots.map((slot) => {
                                const startTime = new Date(slot.start_time);
                                const isSelected = selectedSlotId === slot.id;

                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlotId(slot.id)}
                                        className={`
                      relative p-3 rounded-xl border-2 text-left transition-all duration-200
                      ${isSelected
                                                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 ring-offset-1"
                                                : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className={`w-3 h-3 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                                            <span className={`text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-500"}`}>
                                                {format(startTime, "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                                            <span className={`text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                                                {format(startTime, "h:mm a")}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBook}
                            disabled={!selectedSlotId}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
