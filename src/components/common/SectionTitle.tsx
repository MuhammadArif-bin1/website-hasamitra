import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  dividerColor?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  badge,
  dividerColor = "bg-orange-500",
}: SectionTitleProps) {
  return (
    <div className="text-center space-y-2">
      {badge && (
        <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h2>
      <div className={`w-16 h-1 ${dividerColor} mx-auto rounded-full`}></div>
      {subtitle && (
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
