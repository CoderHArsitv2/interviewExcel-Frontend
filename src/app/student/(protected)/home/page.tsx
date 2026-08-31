"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet, authenticatedPost } from "@/providers/api";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Star, MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { AvailabilitySlot } from "@/app/expert/(protected)/sessions/page";
import toast from "react-hot-toast";
import SlotSelectionModal from "@/app/components/SlotSelectionModal";
import RemoteAvatar from "@/app/components/RemoteAvatar";
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

/** The expert record's own `full_name` is often blank; the user record has it. */
const expertName = (expert: Expert) =>
  expert.user?.full_name || expert.full_name || "Unnamed Expert";

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

  // Load Razorpay's checkout script on demand (it eagerly prefetches many
  // chunks once loaded, so we avoid pulling it in until checkout is initiated).
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load payment gateway. Please try again.");
          return;
        }
        openRazorpayCheckout(res, slotId);
      }
    } catch {
      toast.error("Booking failed"); // Handled globally
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Left: Experts */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header & Search */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find Your <span className="text-gradient">Expert Mentor</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Connect with industry leaders and boost your career.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search experts by name, skill, or company..."
              className="pl-11 h-14 text-base rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-500/15 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Experts List */}
        <div className="space-y-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="profile-card p-6 flex flex-col md:flex-row gap-6"
              >
                <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
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
          ) : experts.length === 0 ? (
            <div className="text-center py-14 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30">
              <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No mentors available right now
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Check back shortly — new experts join every week.
              </p>
            </div>
          ) : (
            experts.map((expert, idx) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="profile-card p-5 sm:p-6 group hover:-translate-y-0.5 hover:border-purple-300/70 dark:hover:border-purple-700/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
                  {/* Profile Picture */}
                  <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28">
                    <RemoteAvatar
                      src={expert.profile_picture_url}
                      fallbackSrc={expert.user?.picture}
                      name={expertName(expert)}
                      role="expert"
                      className="w-full h-full rounded-2xl shadow-lg ring-4 ring-purple-100/70 dark:ring-purple-900/40 text-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-1 rounded-full shadow-md">
                      <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                          {expertName(expert)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{expert.city || "Remote"}</span>
                          <span>•</span>
                          <Briefcase className="w-4 h-4 shrink-0" />
                          <span>
                            {expert.experience_years > 0
                              ? `${expert.experience_years} Yrs Exp`
                              : "Fresher"}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/40 px-3 py-1 rounded-full font-semibold text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{expert.rating || "New"}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
                      {expert.about_me ||
                        "Passionate about mentoring and helping students achieve their career goals."}
                    </p>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-2">
                      {parseExpertise(expert.expertise).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-white/10">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                          Session Fee
                        </p>
                        <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                          {expert.fees_per_session
                            ? `₹${Math.round(expert.fees_per_session / 100).toLocaleString("en-IN")}`
                            : "Free"}{" "}
                          <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">
                            / 60 min
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookNow(expert)}
                        className="btn-student-primary text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 shrink-0 space-y-6">
        {/* Upcoming Sessions */}
        <div className="profile-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Sessions
            </h3>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30 text-center py-8 px-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No upcoming sessions
            </p>
            <button
              onClick={() => router.push("/student/sessions")}
              className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline mt-1"
            >
              View all sessions
            </button>
          </div>
        </div>

        {/* Promo Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-700 dark:via-purple-800 dark:to-indigo-800 p-6 text-white shadow-xl shadow-purple-500/25 dark:shadow-purple-950/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none" />

          <h3 className="font-bold text-lg relative z-10">Become an Expert</h3>
          <p className="text-sm opacity-80 mt-2 relative z-10 mb-4">
            Share your knowledge and earn by mentoring students.
          </p>
          <button
            onClick={() => router.push("/expert/auth")}
            className="relative z-10 w-full h-11 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 font-semibold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Now
          </button>
        </div>
      </div>

      <SlotSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slots={slots}
        expertName={selectedExpert ? expertName(selectedExpert) : "Expert"}
        onBook={handleConfirmBooking}
      />
    </div>
  );
};

export default StudentHomePage;
