import React from 'react';

const blogs = [
    { title: "Top 10 Learning Tips", snippet: "Boost your productivity with these tips..." },
    { title: "How to Master React", snippet: "Step by step guide to becoming a React expert..." },
    { title: "Career in Tech", snippet: "Explore top tech roles and growth paths..." },
];

export default function BlogSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, i) => (
                        <div key={i} className="p-6 bg-gray-100 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                            <p className="text-gray-700">{blog.snippet}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
