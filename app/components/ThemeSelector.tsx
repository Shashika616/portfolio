"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGlobalTheme, THEMES } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { activeTheme, setThemeById } = useGlobalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Responsive pinning: Anchored bottom-right on mobile screens for natural single-hand usage
    <div ref={menuRef} className="fixed bottom-4 right-4 sm:right-auto sm:left-6 z-[9999]">
      {/* FLOATING ACTION TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 transition-all border border-slate-700 font-mono text-xs font-bold touch-manipulation cursor-pointer"
      >
        <span>{activeTheme.icon}</span>
        <span className="uppercase tracking-wider">Themes</span>
      </button>

      {/* DROPDOWN SHEET FLYOUT */}
      {isOpen && (
        <div className="absolute bottom-full right-0 sm:right-auto sm:left-0 mb-3 w-60 sm:w-64 bg-white/90 backdrop-blur-lg border border-slate-200/80 shadow-2xl rounded-2xl p-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 px-2.5 py-2 border-b border-slate-100 mb-1">
            Select a Theme
          </div>
          <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setThemeById(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all touch-manipulation cursor-pointer ${
                  activeTheme.id === t.id 
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{t.icon}</span>
                  <span>{t.name}</span>
                </div>
                {activeTheme.id === t.id && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}