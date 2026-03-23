"use client";

import React, { useState } from "react";
import {
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    FileText,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const faqs = [
    {
        question: "How do I create available slots for students?",
        answer:
            "Navigate to the 'Sessions' page and click 'Generate Slots'. You can select the days, start/end times, and duration for each slot. Once generated, these slots will be visible to students for booking.",
    },
    {
        question: "How do I get paid for my sessions?",
        answer:
            "Payments are processed automatically after a session is completed. The session fee (minus any platform charges) is credited to your registered bank account within 3–5 business days. You can view your earnings on the Home dashboard.",
    },
    {
        question: "What if a student doesn't show up?",
        answer:
            "If a student misses a scheduled session, you can mark it as a no-show. You will still receive the session fee. If this happens repeatedly with a student, please report it to our support team.",
    },
    {
        question: "How do I update my expertise and session fees?",
        answer:
            "Go to your 'Profile' page and click the edit button. You can update your bio, expertise areas, session fee, experience, and other details. Changes are reflected instantly to students browsing experts.",
    },
    {
        question: "What does the verification badge mean?",
        answer:
            "A verified badge indicates your profile has been reviewed and approved by the InterviewExcel team. Verified experts get higher visibility and student trust. If your verification is pending, ensure your profile is complete.",
    },
    {
        question: "Can I cancel a session after a student books it?",
        answer:
            "You can cancel up to 12 hours before the scheduled time without penalty. Late cancellations may affect your rating. Navigate to 'Sessions' → 'Upcoming' to manage your bookings.",
    },
];

export default function ExpertHelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Expert Support
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Help & Support
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Everything you need to know about mentoring on InterviewExcel. Can&apos;t
                        find what you&apos;re looking for? Reach out to our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content: FAQs */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx
                                            ? "border-amber-200 shadow-md ring-4 ring-amber-50/50"
                                            : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left px-6 py-5 flex justify-between items-center bg-transparent focus:outline-none"
                                    >
                                        <span
                                            className={`font-semibold text-lg transition-colors ${openFaq === idx ? "text-amber-700" : "text-gray-800"
                                                }`}
                                        >
                                            {faq.question}
                                        </span>
                                        <div
                                            className={`p-1 rounded-full transition-colors ${openFaq === idx
                                                    ? "bg-amber-100 text-amber-600"
                                                    : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            {openFaq === idx ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Contact & Resources */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/10 relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 ring-2 ring-white/30 shadow-inner backdrop-blur-md">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold mb-2 tracking-tight">
                                Need more help?
                            </h3>
                            <p className="text-amber-100 mb-8 leading-relaxed">
                                Our expert support team is available 24/7 to assist you with any
                                platform issues.
                            </p>

                            <div className="space-y-3">
                                <Button className="w-full bg-white hover:bg-gray-50 text-amber-700 font-semibold rounded-full h-12 shadow-lg transition-all hover:scale-[1.02]">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Support
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full hover:bg-white/10 text-white hover:text-white rounded-full h-12"
                                >
                                    View Expert Guide
                                </Button>
                            </div>
                        </div>

                        {/* Quick Links Card */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Quick Resources
                            </h3>

                            <ul className="space-y-4">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between text-gray-600 hover:text-amber-600 transition-colors group"
                                    >
                                        <span className="font-medium">Expert Agreement</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                                <li className="h-px bg-gray-50 w-full" />
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between text-gray-600 hover:text-amber-600 transition-colors group"
                                    >
                                        <span className="font-medium">Payout Policy</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                                <li className="h-px bg-gray-50 w-full" />
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between text-gray-600 hover:text-amber-600 transition-colors group"
                                    >
                                        <span className="font-medium">Mentoring Best Practices</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                                <li className="h-px bg-gray-50 w-full" />
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between text-gray-600 hover:text-amber-600 transition-colors group"
                                    >
                                        <span className="font-medium">Community Guidelines</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
