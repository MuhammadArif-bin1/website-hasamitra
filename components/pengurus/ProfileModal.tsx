"use client";

import React from "react";
import Image from "next/image";
import type { ManagementMember } from "@/data/management";

interface ProfileModalProps {
  member: ManagementMember;
  activeTab: "image" | "text";
  onTabChange: (tab: "image" | "text") => void;
  onClose: () => void;
}

export default function ProfileModal({
  member,
  activeTab,
  onTabChange,
  onClose,
}: ProfileModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {member.fullName}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {member.position} - PT BPR Hasamitra Jawa Barat
              </p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => onTabChange("image")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "image"
                    ? "bg-orange-500 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Gambar Poster
              </button>
              <button
                onClick={() => onTabChange("text")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "text"
                    ? "bg-orange-500 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Teks Profile
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Tutup Modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          {activeTab === "image" ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                <Image
                  src={member.profileImage}
                  alt={member.profileImageAlt}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <p className="text-xs text-slate-500 italic text-center">
                *Gambar profil resmi {member.fullName} ({member.position} PT BPR
                Hasamitra Jawa Barat)
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-extrabold text-orange-600">
                  {member.fullName}
                </h3>
                <p className="text-sm font-bold text-slate-600">
                  {member.position}
                </p>
              </div>

              <div className="space-y-4 text-justify">
                {member.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
