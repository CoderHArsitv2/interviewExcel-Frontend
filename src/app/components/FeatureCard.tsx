import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title?: string;
  description?: string;
  role?: string;
  icon?: LucideIcon;
}

const FeatureCard = ({ title, description, role = "expert", icon: Icon }: FeatureCardProps) => {
  const isExpert = role === "expert";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 w-full ${
        isExpert
          ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-100 hover:border-amber-300"
          : "bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-800/40 text-purple-900 dark:text-purple-100 hover:border-purple-300"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-5 h-5 mb-1.5 ${
            isExpert ? "text-amber-600 dark:text-amber-400" : "text-purple-600 dark:text-purple-400"
          }`}
        />
      )}
      <span
        className={`font-extrabold text-base sm:text-lg tracking-tight ${
          isExpert ? "text-amber-800 dark:text-amber-300" : "text-purple-700 dark:text-purple-300"
        }`}
      >
        {title || "-"}
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
        {description}
      </span>
    </div>
  );
};

export default FeatureCard;
