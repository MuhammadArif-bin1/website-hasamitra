"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ManagementMember } from "@/data/management";

interface ManagementCardProps {
  member: ManagementMember;
  index: number;
  onClick: () => void;
}

export default function ManagementCard({
  member,
  index,
  onClick,
}: ManagementCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : customIndex * 0.12,
      },
    }),
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center max-w-[260px] w-full text-center focus:outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {/* Image Container with Orange Border */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-4 border-orange-500 shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-100">
        <Image
          src={member.photo}
          alt={`${member.name} - ${member.position}`}
          fill
          sizes="(max-width: 768px) 100vw, 260px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={index < 2}
        />
        {/* Hover Overlay Badge */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Lihat Detail Profile
          </span>
        </div>
      </div>

      {/* Name & Title */}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
          {member.name}
        </h3>
        <p className="text-sm font-semibold text-slate-600">
          {member.position}
        </p>
      </div>
    </motion.div>
  );
}
