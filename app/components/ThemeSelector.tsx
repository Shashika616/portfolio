"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useGlobalTheme, THEMES } from '../context/ThemeContext';

/** Small conic swatch that previews a theme's gradient. */
function Swatch({ gradient, size = 14 }: { gradient: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full ring-1 ring-black/10 flex-shrink-0"
      style={{ width: size, height: size, backgroundImage: gradient }}
    />
  );
}

export default function ThemeSelector() {
  const { activeTheme, setThemeById } = useGlobalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    // Bottom-right on mobile for thumb reach; bottom-left on larger screens.
    <div ref={menuRef} className="fixed bottom-4 right-4 sm:right-auto sm:left-6 z-[9999]">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme: ${activeTheme.name}. Change theme`}
        className="flex items-center gap-2 pl-2.5 pr-3.5 py-2.5 min-h-[44px] bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 active:scale-[0.97] transition-all border border-slate-700 font-mono text-xs font-bold touch-manipulation cursor-pointer"
      >
        <Swatch gradient={activeTheme.gradient} size={16} />
        <span className="uppercase tracking-wider">Themes</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Select a theme"
          className="absolute bottom-full right-0 sm:right-auto sm:left-0 mb-3 w-60 sm:w-64 bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-2xl rounded-2xl p-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500 px-2.5 py-2 border-b border-slate-100 mb-1">
            Select a theme
          </div>
          <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
            {THEMES.map((t) => {
              const isActive = activeTheme.id === t.id;
              return (
                <button
                  key={t.id}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setThemeById(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors touch-manipulation cursor-pointer ${
                    isActive ? 'font-semibold text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  style={isActive ? { backgroundColor: t.fillColor + '14' } : undefined}
                >
                  <span className="flex items-center gap-2.5">
                    <Swatch gradient={t.gradient} />
                    <span>{t.name}</span>
                  </span>
                  {isActive && <Check className="w-4 h-4" style={{ color: t.fillColor }} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
