"use client";

import React from 'react';
import Image from 'next/image';
import { useGlobalTheme } from '../context/ThemeContext';

export default function ProfileHeader() {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="relative p-[2px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.08)] w-full max-w-[290px] sm:max-w-sm group">
      
      {/* GLOBAL BACKGROUND TRACER */}
      <div 
        style={{ backgroundImage: activeTheme.gradient }}
        className="absolute inset-[-200%] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 animate-global-glow" 
      />

      {/* INNER SOLID BODY */}
      <div className="relative flex items-center gap-3 sm:gap-4 select-none bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 sm:px-5 py-3 rounded-[14px] w-full h-full z-10">
        <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-slate-200/80 shadow-sm bg-slate-100 flex-shrink-0">
          <Image src="/pic.jpeg" alt="Profile" fill priority sizes="(max-width: 640px) 44px, 56px" className="object-cover" />
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-sans font-extrabold text-sm sm:text-base tracking-tight text-slate-900 truncate">
              Shashika Fernando
            </span>
            <span className={`font-mono text-[8px] sm:text-[9px] font-bold text-white px-1.5 py-0.5 rounded-sm flex-shrink-0 tracking-wide transition-colors duration-300 ${activeTheme.accentColor}`}>
              DEV
            </span>
          </div>
          <span className="font-mono text-[11px] sm:text-xs text-slate-400 mt-0.5"><strong>Software Engineer</strong></span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase">STATUS: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}