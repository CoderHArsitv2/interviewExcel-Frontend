import React from 'react';

const plans = [
    { title: "Basic", price: "$19/mo", features: ["Access to 5 courses", "Email support"] },
    { title: "Pro", price: "$49/mo", features: ["Access to 20 courses", "Priority support"] },
    { title: "Enterprise", price: "$99/mo", features: ["Unlimited courses", "Dedicated mentor"] },
];

export default function PricingSection() {
    return (
        <section className="py-16 bg-sky-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className="p-6 bg-white rounded-xl shadow-md flex flex-col">
                            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                            <p className="text-2xl font-semibold mb-4">{plan.price}</p>
                            <ul className="mb-6 space-y-2">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className="text-gray-700">• {f}</li>
                                ))}
                            </ul>
                            <button className="mt-auto bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition">
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
