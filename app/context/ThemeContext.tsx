"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

const STORAGE_KEY = 'portfolio-theme';

// 1. DEFINE THE STRUCTURE OF A THEME PROFILE
export interface ThemeProfile {
  id: string;
  name: string;
  gradient: string;
  accentColor: string; // Used for solid background badges
  textColor: string;   // Tailwind class only — never pass to an inline `style`. Use fillColor or var(--accent) there.
  fillColor: string;   // Brand accent: SVG/canvas strokes, tints, focus rings
  strongColor: string; // AA-contrast shade (≥4.5:1 vs white) for primary button fills and accent text
}

// 2. THE SYSTEM CONFIGURATION MATRIX 
export const THEMES: ThemeProfile[] = [
  {
    id: "gemini",
    name: "Aurora",
    gradient: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #eab308, #3b82f6)",
    accentColor: "bg-blue-600",
    textColor: "text-blue-600",
    fillColor: "#3b82f6",
    strongColor: "#2563eb"
  },
  {
    id: "cyberpunk",
    name: "Violet",
    gradient: "conic-gradient(from 0deg, #ff007f, #7928ca, #ff007f)",
    accentColor: "bg-pink-500",
    textColor: "text-pink-500",
    fillColor: "#ff007f",
    strongColor: "#be185d"
  },
  {
    id: "matrix",
    name: "Emerald",
    gradient: "conic-gradient(from 0deg, #10b981, #059669, #34d399, #10b981)",
    accentColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    fillColor: "#10b981",
    strongColor: "#047857"
  },
  {
    id: "solar",
    name: "Fire Red",
    gradient: "conic-gradient(from 0deg, #f97316, #ef4444, #eab308, #f97316)",
    accentColor: "bg-orange-500",
    textColor: "text-orange-500",
    fillColor: "#f97316",
    strongColor: "#c2410c"
  },
  {
    id: "mono",
    name: "Monochrome",
    gradient: "conic-gradient(from 0deg, #000000, #333333, #666666, #999999, #000000)",
    accentColor: "bg-black",
    textColor: "text-black",
    fillColor: "#000000",
    strongColor: "#0f172a"
  }
];

// 3. DEFINE THE INTERFACE OBJECT FOR CONSUMERS
interface ThemeContextType {
  activeTheme: ThemeProfile;
  setThemeById: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. MAIN PROVIDER COMPONENT WRAPPER
// The saved theme id lives in localStorage; expose it as an external store so
// React reads it without an effect, and every tab stays in sync.
const THEME_EVENT = 'portfolio-theme-change';
function subscribeTheme(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(THEME_EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(THEME_EVENT, cb);
  };
}
function readThemeId() {
  try { return window.localStorage.getItem(STORAGE_KEY) ?? THEMES[0].id; } catch { return THEMES[0].id; }
}

export function GlobalThemeProvider({ children }: { children: ReactNode }) {
  const themeId = useSyncExternalStore(subscribeTheme, readThemeId, () => THEMES[0].id);
  const activeTheme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  // Publish the accent as CSS variables so plain CSS (globals.css) can follow the theme.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', activeTheme.fillColor);
    root.style.setProperty('--accent-strong', activeTheme.strongColor);
    root.style.setProperty('--accent-gradient', activeTheme.gradient);
    root.dataset.theme = activeTheme.id;
  }, [activeTheme]);

  const setThemeById = (id: string) => {
    if (!THEMES.some(t => t.id === id)) return;
    try { window.localStorage.setItem(STORAGE_KEY, id); } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setThemeById }}>
    <MotionConfig reducedMotion="user">
      
      {/* CENTRAL REGISTRATION FOR THE INFINITE KEYFRAME ROTATION ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes global-gemini-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-global-glow {
          animation: global-gemini-rotate 6s linear infinite;
        }
      `}} />
      
      {children}
    </MotionConfig>
    </ThemeContext.Provider>
  );
}

// 5. CUSTOM SECURE EXPORT HOOK FOR THE SUB-COMPONENTS
export function useGlobalTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useGlobalTheme must be called from inside a GlobalThemeProvider component trees.");
  }
  return context;
}