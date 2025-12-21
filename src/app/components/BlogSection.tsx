"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const blogs = [
    {
        title: "Top 10 Tips to Crack the UPSC Interview",
        snippet: "Discover the secrets shared by previous year toppers and retired bureaucrats...",
        date: "Oct 12, 2023",
        readTime: "5 min read",
        category: "UPSC"
    },
    {
        title: "Mastering System Design for FAANG",
        snippet: "A comprehensive guide to approaching scalable system design problems...",
        date: "Oct 15, 2023",
        readTime: "8 min read",
        category: "Tech"
    },
    {
        title: "Banking Awareness: Key Topics for PO",
        snippet: "Essential banking terms and concepts you must know for your interview...",
        date: "Oct 18, 2023",
        readTime: "4 min read",
        category: "Banking"
    },
];

export default function BlogSection() {
    return (
        <section id="blog" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                            Latest <span className="text-blue-600">Insights</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-xl">
                            Expert advice, success stories, and preparation strategies.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2">
                        View All Articles <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {/* Placeholder for blog image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wide">
                                    {blog.category}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {blog.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {blog.readTime}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 mb-6 line-clamp-2 flex-1">
                                    {blog.snippet}
                                </p>

                                <Link href="#" className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all">
                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full">
                        View All Articles
                    </Button>
                </div>
            </div>
        </section>
    );
}
