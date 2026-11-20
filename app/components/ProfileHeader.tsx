"use client";

import React from 'react';
import Image from 'next/image';
import { PROFILE } from '../data/profile';

/**
 * Identity block for the dashboard sidebar / mobile header. The avatar's
 * gradient ring is the one place the theme gradient appears in the chrome.
 */
export default function ProfileHeader() {
  return (
    <div className="flex items-center gap-3.5 select-none">
      <span
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] flex-shrink-0"
        style={{ backgroundImage: 'var(--accent-gradient)' }}
      >
        <span className="relative block w-full h-full rounded-full overflow-hidden ring-2 ring-white bg-slate-100">
          <Image src={PROFILE.avatar} alt={PROFILE.name} fill priority sizes="56px" className="object-cover" />
        </span>
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[15px] sm:text-base font-semibold tracking-[-0.01em] text-slate-900 truncate">{PROFILE.name}</p>
        <p className="text-[13px] text-slate-500 truncate">{PROFILE.title} · {PROFILE.location.split(',')[0]}</p>
      </div>
    </div>
  );
}
