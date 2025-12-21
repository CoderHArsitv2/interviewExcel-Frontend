"use client";



const partners = [
    "Google", "Amazon", "Microsoft", "Uber", "Stripe", "Netflix", "Airbnb", "Meta"
];

export default function PartnersSection() {
    return (
        <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Trusted by mentors from top companies
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...partners, ...partners, ...partners].map((partner, i) => (
                        <div key={i} className="mx-8 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-300 hover:text-blue-600 transition-colors cursor-default">
                                {partner}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
                    {[...partners, ...partners, ...partners].map((partner, i) => (
                        <div key={i} className="mx-8 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-300 hover:text-blue-600 transition-colors cursor-default">
                                {partner}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add custom tailwind animation in globals.css if not present, or use inline styles for marquee */}
            <style jsx>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
        </section>
    );
}
