"use client";

import React, { useState } from 'react';
import { Mail, MessageCircle, ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: "How do I book a mock interview?",
    answer: "You can book a session by navigating to the 'Home' tab and selecting a mentor. From their profile, choose an available time slot that works for you and confirm the booking."
  },
  {
    question: "What happens if a mentor doesn't show up?",
    answer: "In the rare event a mentor misses a session, please reach out to our support team within 24 hours. We will investigate the issue and provide a full refund or a free reschedule credit."
  },
  {
    question: "How do I prepare for my first session?",
    answer: "Review the mentor's profile to understand their background. Have your resume ready, prepare a brief introduction, and note down specific areas or questions you want to focus on during the mock interview."
  },
  {
    question: "Where can I find the feedback after a session?",
    answer: "Once a session is marked as completed by the mentor, you can navigate to 'My Sessions', click on the 'Past Sessions' tab, and select 'View Feedback' on the relevant session card."
  },
  {
    question: "Can I cancel or reschedule a booked session?",
    answer: "Yes, you can cancel or reschedule up to 24 hours before the session starts without any penalty. Late cancellations may be subject to a fee depending on the mentor's policy."
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Help & Support</h1>
          <p className="text-gray-500 text-lg max-w-2xl">Find answers to common questions or reach out to our team directly. We are here to ensure you have the best experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Content: FAQs */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-blue-200 shadow-md ring-4 ring-blue-50/50' : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'}`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center bg-transparent focus:outline-none"
                  >
                    <span className={`font-semibold text-lg transition-colors ${openFaq === idx ? 'text-blue-700' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <div className={`p-1 rounded-full transition-colors ${openFaq === idx ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      {openFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
            <div className="bg-gradient-to-br from-blue-600 to-purple-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 ring-2 ring-white/30 shadow-inner backdrop-blur-md">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2 tracking-tight">Need more help?</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">Our support team is available 24/7 to assist you with any platform issues.</p>

              <div className="space-y-3">
                <Button className="w-full bg-white hover:bg-gray-50 text-blue-700 font-semibold rounded-full h-12 shadow-lg transition-all hover:scale-[1.02]">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="ghost" className="w-full hover:bg-white/10 text-white hover:text-white rounded-full h-12">
                  View Setup Guide
                </Button>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Quick Resources
              </h3>

              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors group">
                    <span className="font-medium">Terms of Service</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li className="h-px bg-gray-50 w-full" />
                <li>
                  <a href="#" className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors group">
                    <span className="font-medium">Privacy Policy</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li className="h-px bg-gray-50 w-full" />
                <li>
                  <a href="#" className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors group">
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