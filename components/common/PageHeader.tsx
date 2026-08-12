import React from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  description?: string;
}

export default function PageHeader({
  badge,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
      <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider mb-3">
        {badge}
      </span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
