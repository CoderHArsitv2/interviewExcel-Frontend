"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const plans = [
    {
        title: "Basic",
        price: "$19",
        period: "/mo",
        description: "Essential tools for beginners.",
        features: ["Access to 5 mock interviews", "Basic performance analytics", "Email support"],
        popular: false
    },
    {
        title: "Pro",
        price: "$49",
        period: "/mo",
        description: "Perfect for serious aspirants.",
        features: ["Unlimited mock interviews", "Advanced AI feedback", "Priority mentor access", "Resume review"],
        popular: true
    },
    {
        title: "Enterprise",
        price: "$99",
        period: "/mo",
        description: "For coaching institutes & teams.",
        features: ["Custom branding", "Bulk user management", "Dedicated success manager", "API access"],
        popular: false
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Simple, Transparent <span className="text-blue-600">Pricing</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Choose the plan that best fits your preparation needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative p-8 rounded-2xl border ${plan.popular ? 'bg-white border-blue-600 shadow-xl scale-105 z-10' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'} flex flex-col h-full`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                            <p className="text-gray-500 mb-6">{plan.description}</p>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 ml-1">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full py-6 text-lg rounded-xl ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-gray-900 hover:bg-gray-800'}`}
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
