"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tentangKamiSubmenu } from "@/data/navigation";

export default function TentangKamiTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-3 border-b border-slate-200">
      {tentangKamiSubmenu.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold shrink-0 transition-all ${
              isActive
                ? "font-bold bg-orange-500 text-white shadow-md shadow-orange-500/25"
                : "bg-white text-slate-700 border border-slate-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/50 shadow-sm"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
