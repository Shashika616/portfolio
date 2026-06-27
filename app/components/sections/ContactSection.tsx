"use client";

import React from "react";
import { Section } from "../../types";
import { useGlobalTheme } from "../../context/ThemeContext";

interface ContactSectionProps {
  sec: Section;
}

export function ContactSection({ sec }: ContactSectionProps) {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{sec.title}</h2>
        <h4 className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${activeTheme.textColor}`}>
          — {sec.subtitle || "Let's Connect"}
        </h4>
        <p className="text-slate-600 text-base leading-relaxed border-l-2 pl-6 transition-all duration-300" style={{ borderColor: activeTheme.fillColor }}>
          Looking to configure a performant systems cluster or review language architectures? Let's initialize a direct network socket link sequence.
        </p>
      </div>

      {/* CONTACT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* LinkedIn Card */}
        <a
          href="https://www.linkedin.com/in/shashika-fernando-5399062b5/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                    shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                    hover:-translate-y-1 
                    transition-all duration-300 ease-out flex items-center gap-4 cursor-pointer"
          style={{
            ['--theme-shadow' as any]: `${activeTheme.fillColor}25`,
            ['--theme-shadow-hover' as any]: `${activeTheme.fillColor}30`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.03)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 40px var(--theme-shadow-hover), 0 2px 8px var(--theme-shadow)`;
            e.currentTarget.style.borderColor = activeTheme.fillColor + '40';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          {/* Icon Container - Theme colored */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ 
              backgroundColor: activeTheme.fillColor + '15',
              color: activeTheme.fillColor
            }}
          >
            <svg className="w-6 h-6 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold text-slate-900 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
              LinkedIn
            </h3>
            <p className="text-sm text-slate-500 truncate">
              Connect with me professionally
            </p>
          </div>
          
          {/* Arrow */}
          <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        {/* GitHub Card */}
        <a
          href="https://github.com/Shashika616"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                    shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                    hover:-translate-y-1 
                    transition-all duration-300 ease-out flex items-center gap-4 cursor-pointer"
          style={{
            ['--theme-shadow' as any]: `${activeTheme.fillColor}25`,
            ['--theme-shadow-hover' as any]: `${activeTheme.fillColor}30`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.03)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 40px var(--theme-shadow-hover), 0 2px 8px var(--theme-shadow)`;
            e.currentTarget.style.borderColor = activeTheme.fillColor + '40';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          {/* Icon Container - Theme colored */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ 
              backgroundColor: activeTheme.fillColor + '15',
              color: activeTheme.fillColor
            }}
          >
            <svg className="w-6 h-6 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold text-slate-900 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
              GitHub
            </h3>
            <p className="text-sm text-slate-500 truncate">
              Explore my open-source projects
            </p>
          </div>
          
          {/* Arrow */}
          <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* EMAIL CTA */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 bg-slate-50/80">
        <div>
          <p className="text-sm text-slate-600 font-medium">
            Prefer email? Let's start a conversation.
          </p>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Direct line to my inbox
          </p>
        </div>
        <a 
          href="mailto:shashikauda@gmail.com" 
          className={`font-mono text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 text-white shadow-md hover:brightness-110 hover:-translate-y-0.5 text-center whitespace-nowrap`}
          style={{ backgroundImage: activeTheme.gradient }}
        >
          INITIATE_CONTACT_SEQUENCE
        </a>
      </div>

      {/* FOOTER NOTE */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono text-slate-400 font-medium uppercase tracking-widest">
          Ready for collaboration
        </span>
      </div>
    </div>
  );
}