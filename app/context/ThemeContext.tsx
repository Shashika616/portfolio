"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. DEFINE THE STRUCTURE OF A THEME PROFILE
export interface ThemeProfile {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  accentColor: string; // Used for solid background badges
  textColor: string;   // Used for plain text accent configurations
  fillColor: string;   // Used for raw vector/SVG canvas mapping shapes
}

// 2. THE SYSTEM CONFIGURATION MATRIX 
export const THEMES: ThemeProfile[] = [
  {
    id: "gemini",
    name: "Gemini Aura",
    icon: "✨",
    gradient: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #eab308, #3b82f6)",
    accentColor: "bg-blue-600",
    textColor: "text-blue-600",
    fillColor: "#3b82f6"
  },
  {
    id: "cyberpunk",
    name: "Cyber Punk",
    icon: "⚡",
    gradient: "conic-gradient(from 0deg, #ff007f, #7928ca, #ff007f)",
    accentColor: "bg-pink-500",
    textColor: "text-pink-500",
    fillColor: "#ff007f"
  },
  {
    id: "matrix",
    name: "Matrix Code",
    icon: "🟢",
    gradient: "conic-gradient(from 0deg, #10b981, #059669, #34d399, #10b981)",
    accentColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    fillColor: "#10b981"
  },
  {
    id: "solar",
    name: "Solar Flare",
    icon: "🔥",
    gradient: "conic-gradient(from 0deg, #f97316, #ef4444, #eab308, #f97316)",
    accentColor: "bg-orange-500",
    textColor: "text-orange-500",
    fillColor: "#f97316"
  }
];

// 3. DEFINE THE INTERFACE OBJECT FOR CONSUMERS
interface ThemeContextType {
  activeTheme: ThemeProfile;
  setThemeById: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. MAIN PROVIDER COMPONENT WRAPPER
export function GlobalThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeProfile>(THEMES[0]);

  const setThemeById = (id: string) => {
    const target = THEMES.find(t => t.id === id);
    if (target) {
      setActiveTheme(target);
    }
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setThemeById }}>
      
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