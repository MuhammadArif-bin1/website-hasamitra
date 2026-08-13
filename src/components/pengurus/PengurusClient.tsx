"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TentangKamiTabs from "@/components/tentang-kami/TentangKamiTabs";
import ManagementCard from "@/components/pengurus/ManagementCard";
import ProfileModal from "@/components/pengurus/ProfileModal";
import SectionTitle from "@/components/common/SectionTitle";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";
import {
  commissioners,
  directors,
  type ManagementMember,
} from "@/data/management";

export default function PengurusClient() {
  const [selectedMember, setSelectedMember] =
    useState<ManagementMember | null>(null);
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMember]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenProfile = (member: ManagementMember) => {
    setActiveTab("image");
    setSelectedMember(member);
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <TentangKamiTabs />

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md text-center space-y-4"
        >
          <span className="px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Pengurus Perusahaan
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Jajaran Dewan Komisaris dan Manajemen PT BPR Hasamitra Jawa Barat
            yang profesional, berpengalaman, dan terpercaya.
          </p>
        </motion.div>

        {/* Dewan Komisaris Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-10">
          <SectionTitle title="Dewan Komisaris" />

          <div className="flex flex-wrap justify-center items-stretch gap-8 lg:gap-16 pt-4">
            {commissioners.map((member, index) => (
              <ManagementCard
                key={member.id}
                member={member}
                index={index}
                onClick={() => handleOpenProfile(member)}
              />
            ))}
          </div>
        </div>

        {/* Dewan Direksi Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-10">
          <SectionTitle title="Dewan Direksi" />

          <div className="flex flex-wrap justify-center items-stretch gap-8 lg:gap-16 pt-4">
            {directors.map((member, index) => (
              <ManagementCard
                key={member.id}
                member={member}
                index={index + commissioners.length}
                onClick={() => handleOpenProfile(member)}
              />
            ))}
          </div>

          {/* OJK & LPS Guarantees Notice */}
          <div className="pt-8 border-t border-slate-200">
            <OjkLpsNotice />
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedMember && (
        <ProfileModal
          member={selectedMember}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
