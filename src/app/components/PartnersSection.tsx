import React from 'react';

const partners = ["Logo1", "Logo2", "Logo3", "Logo4", "Logo5"];

export default function PartnersSection() {
    return (
        <section className="py-16 bg-sky-50">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">Our Trusted Partners</h2>
                <div className="flex flex-wrap justify-center items-center gap-8">
                    {partners.map((logo, i) => (
                        <div key={i} className="w-32 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
