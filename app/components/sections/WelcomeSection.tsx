"use client";

import React from "react";
import { useGlobalTheme } from "../../context/ThemeContext";

export function WelcomeSection() {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. HERO HEADLINE ARCHITECTURE */}
      <div className="space-y-4">
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 bg-white/50 ${activeTheme.textColor}`}
          style={{ borderColor: activeTheme.fillColor + '30' }}
        >
          RESEARCH AND DEVELOPMENT
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-2xl">
          Engineering Intelligent Systems Through{" "}
          <span 
            className="bg-clip-text text-transparent transition-all duration-300 font-black"
            style={{ backgroundImage: activeTheme.gradient }}
          >
            Research and Innovation.
          </span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
          Software engineer specializing in providing practical solutions, AI-driven applications, secure architectures, and immersive digital experiences.
        </p>
      </div>

      {/* 2. CORE TECHNICAL PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[
          { title: "Distributed Systems", desc: "Architecting high-concurrency environments, message brokers, and fault-tolerant nodes that maintain synchronization." },
          { title: "Secure Architecture", desc: "Implementing rigorous cryptographic protocols, identity management, and hardened backends to defend against threats." },
          { title: "AI & Deep Learning", desc: "Translating complex neural models into production-grade APIs, focusing on model quantization and inference speed." },
          { title: "R&D Lifecycle", desc: "Bridging the gap between academic formal verification and shipping industrial-strength code through iteration." }
        ].map((pillar, i) => (
          <div 
            key={i}
            className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                      shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                      hover:-translate-y-1 
                      transition-all duration-300 ease-out"
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
            <div className={`absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-slate-100 group-hover:${activeTheme.accentColor} transition-colors duration-300`} />
            <h3 className={`text-lg font-bold text-slate-900 mb-2 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
              {pillar.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. PROFESSIONAL VALUE PROPOSITION */}
      <div className="p-8 rounded-2xl bg-slate-900 text-slate-300 shadow-xl border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">The Innovation Framework</h4>
        <p className="text-sm leading-relaxed mb-6 italic text-slate-400">
          "I build technology that sits at the intersection of security, intelligence, and creativity. My goal is to transform abstract research concepts into scalable, user-centric software that feels futuristic yet remains structurally sound."
        </p>
        <div className="flex gap-4 border-t border-slate-800 pt-6">
          <div>
            <div 
              className="text-2xl font-bold bg-clip-text text-transparent transition-all duration-300"
              style={{ backgroundImage: activeTheme.gradient }}
            >
              100%
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Research Driven</div>
          </div>
          <div>
            <div 
              className="text-2xl font-bold bg-clip-text text-transparent transition-all duration-300"
              style={{ backgroundImage: activeTheme.gradient }}
            >
              Secure
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Architecture First</div>
          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION */}
      <div className="flex items-center gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500 font-mono italic">
          NAVIGATION TIP: Scroll freely to traverse the project sections or select from the side navigation menu.
        </p>
      </div>
    </div>
  );
}