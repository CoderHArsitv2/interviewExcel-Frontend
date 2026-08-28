"use client";

const partners = [
  { name: "Google", color: "hover:border-purple-300 dark:hover:border-purple-700" },
  { name: "Amazon", color: "hover:border-amber-300 dark:hover:border-amber-700" },
  { name: "Microsoft", color: "hover:border-sky-300 dark:hover:border-sky-700" },
  { name: "Meta", color: "hover:border-blue-300 dark:hover:border-blue-700" },
  { name: "Stripe", color: "hover:border-indigo-300 dark:hover:border-indigo-700" },
  { name: "Netflix", color: "hover:border-rose-300 dark:hover:border-rose-700" },
  { name: "Apple", color: "hover:border-slate-300 dark:hover:border-slate-600" },
  { name: "Uber", color: "hover:border-teal-300 dark:hover:border-teal-700" },
  { name: "OpenAI", color: "hover:border-emerald-300 dark:hover:border-emerald-700" },
  { name: "UPSC Toppers", color: "hover:border-purple-300 dark:hover:border-purple-700" },
];

export default function PartnersSection() {
  return (
    <section className="py-14 bg-white/60 dark:bg-slate-950/60 border-y border-purple-100/60 dark:border-white/5 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Learn directly from mentors working at top companies & institutions
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group mask-gradient">
        {/* Track 1 */}
        <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6">
          {[...partners, ...partners].map((p, idx) => (
            <div
              key={idx}
              className={`px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-default ${p.color}`}
            >
              <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 for seamless loop */}
        <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6" aria-hidden="true">
          {[...partners, ...partners].map((p, idx) => (
            <div
              key={`dup-${idx}`}
              className={`px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-default ${p.color}`}
            >
              <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
