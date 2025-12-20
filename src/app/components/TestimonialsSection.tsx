import React from 'react';

const testimonials = [
  { name: "Alice", review: "This platform transformed my learning experience!" },
  { name: "Bob", review: "Amazing content and super helpful mentors." },
  { name: "Charlie", review: "I improved my skills faster than I thought!" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-xl shadow-md">
              <p className="text-gray-700 mb-4">&quot;{t.review}&quot;</p>
              <p className="font-semibold text-gray-900">- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
