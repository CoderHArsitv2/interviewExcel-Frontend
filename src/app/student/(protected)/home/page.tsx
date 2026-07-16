"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet, authenticatedPost } from "@/providers/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Star, MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AvailabilitySlot } from "@/app/expert/(protected)/sessions/page";
import toast from "react-hot-toast";
import SlotSelectionModal from "@/app/components/SlotSelectionModal";
import type { Expert } from "./type";

interface RazorpayCheckoutResponse {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface BookingConfirmationResponse {
  session_uuid: string;
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayOptions extends RazorpayCheckoutResponse {
  name: string;
  description: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const StudentHomePage = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const router = useRouter();

  const FetchExperts = async () => {
    try {
      setIsLoading(true);
      const res: Expert[] = await authenticatedGet("/student/experts");
      if (res) {
        setExperts(res);
      }
    } catch (err) {
      console.warn("Error fetching experts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchExperts();
  }, []);

  // helper: format expertise string → array
  const parseExpertise = (expertise: string) =>
    expertise ? expertise.split(",").map((e) => e.trim()) : [];

  const handleBookNow = async (expert: Expert) => {
    try {
      const res: AvailabilitySlot[] = await authenticatedGet(`/student/expert/${expert.user_uuid}/slots`);
      if (res) {
        setSlots(res);
        setSelectedExpert(expert);
        setIsModalOpen(true);
      }
    } catch {
      toast.error("Error getting slots");
    }
  };
  const openRazorpayCheckout = (
    data: RazorpayCheckoutResponse,
    slotId: number
  ) => {
    const options: RazorpayOptions = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "InterviewExcel",
      description: "Expert Session Booking",
      handler: function (response: RazorpaySuccessResponse) {
        verifyPayment(response, slotId);
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (
    response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    slotId: number
  ) => {
    try {
      const res = await authenticatedPost<BookingConfirmationResponse>("/student/confirm-booking", {
        slot_id: slotId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (res) {
        toast.success("Payment successful!");
        router.push(`/student/sessions/${res.session_uuid}`);
      }
    } catch {
      toast.error("Payment verification failed");
    }
  };

  const handleConfirmBooking = async (slotId: number) => {
    try {
      const res = await authenticatedPost<RazorpayCheckoutResponse>(`/student/book-slot/${slotId}`, {
        slot_id: slotId,
        amount_in_paise: selectedExpert?.fees_per_session,
      });
      if (res) {
        toast.success("Initiating payment...");
        setIsModalOpen(false);
        openRazorpayCheckout(res, slotId);
      }
    } catch {
      toast.error("Booking failed"); // Handled globally
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Left: Experts */}
      <div className="flex-1 space-y-8">
        {/* Header & Search */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Find Your <span className="text-gradient">Expert Mentor</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Connect with industry leaders and boost your career.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search experts by name, skill, or company..."
              className="pl-10 py-6 text-lg bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Experts List */}
        <div className="space-y-6">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6"
              >
                <Skeleton className="w-24 h-24 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            experts.map((expert, idx) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-white/40 group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white/50">
                      <Image
                        src={expert.profile_picture_url || "/mascot.png"}
                        alt={expert.full_name || "Expert"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md">
                      <div className="bg-green-100 text-green-700 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {expert.user.full_name || "Unnamed Expert"}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{expert.city || "Remote"}</span>
                          <span>•</span>
                          <Briefcase className="w-4 h-4" />
                          <span>{expert.experience_years > 0 ? `${expert.experience_years} Yrs Exp` : "Fresher"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{expert.rating || "New"}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                      {expert.about_me || "Passionate about mentoring and helping students achieve their career goals."}
                    </p>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-2">
                      {parseExpertise(expert.expertise).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Session Fee</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{expert.fees_per_session / 100 || "Free"} <span className="text-sm text-gray-400 font-normal">/ 60 min</span>
                        </p>
                      </div>
                      <Button
                        onClick={() => { handleBookNow(expert) }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 rounded-xl px-6">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 space-y-6">
        {/* Upcoming Sessions */}
        <div className="glass rounded-3xl border border-white/40 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
          </div>

          <div className="space-y-4">
            {/* Placeholder for upcoming sessions */}
            <div className="bg-white/50 rounded-xl p-4 border border-white/60 text-center py-8">
              <p className="text-gray-500 text-sm">No upcoming sessions</p>
              <Button variant="link" className="text-blue-600 text-sm mt-1">
                Browse experts
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Experts (Mini List) */}
        <div className="glass rounded-3xl border border-white/40 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Star className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Top Rated</h2>
          </div>

          <div className="space-y-4">
            {["Alice Johnson", "David Smith", "Sarah Wilson"].map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/40 rounded-xl transition cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500">Ex-Google, 5 YOE</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-12 -mb-12 blur-xl"></div>

          <h3 className="font-bold text-lg relative z-10">Become an Expert</h3>
          <p className="text-indigo-100 text-sm mt-2 relative z-10 mb-4">
            Share your knowledge and earn by mentoring students.
          </p>
          <Button variant="secondary" size="sm" className="w-full relative z-10 bg-white text-indigo-600 hover:bg-indigo-50 border-none">
            Apply Now
          </Button>
        </div>
      </div>
      <SlotSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slots={slots}
        expertName={selectedExpert?.full_name || "Expert"}
        onBook={handleConfirmBooking}
      />
    </div>
  );
};

export default StudentHomePage;
