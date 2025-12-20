import React from 'react';

const faqs = [
    { q: "How do I sign up?", a: "Click the Sign Up button and fill the form." },
    { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade anytime." },
    { q: "Do you provide mentorship?", a: "Yes, our Pro and Enterprise plans include mentor support." },
];

export default function FAQSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="p-4 border rounded-lg bg-gray-50">
                            <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                            <p className="mt-2 text-gray-700">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
