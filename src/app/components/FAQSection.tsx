"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        q: "How do I schedule a mock interview?",
        a: "Simply sign up as a student, browse our list of verified experts, and book a slot that works for you. You'll receive a meeting link instantly."
    },
    {
        q: "Can I change my plan later?",
        a: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in the next billing cycle."
    },
    {
        q: "Are the mentors verified?",
        a: "Absolutely. Every mentor on InterviewExcel undergoes a rigorous verification process, including background checks and skill assessments."
    },
    {
        q: "What happens if I miss a session?",
        a: "If you cancel at least 24 hours in advance, you'll get a full refund. For missed sessions without notice, please check our cancellation policy."
    },
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="text-blue-600">Questions</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about the platform and billing.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-semibold text-gray-900">{faq.q}</span>
                                {activeIndex === i ? (
                                    <Minus className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {activeIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
