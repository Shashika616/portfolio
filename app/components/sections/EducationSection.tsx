"use client";

import React from "react";
import { Section } from "../../types";
import { useGlobalTheme } from "../../context/ThemeContext";

interface EducationSectionProps {
  sec: Section;
}

export function EducationSection({ sec }: { sec: Section }) {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. INTRODUCTORY SEGMENT */}
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{sec.title}</h2>
        <h4 className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${activeTheme.textColor}`}>
          — Higher Education
        </h4>
        <p 
          className="text-slate-600 text-lg leading-relaxed border-l-2 pl-6 transition-all duration-300"
          style={{ borderColor: activeTheme.fillColor }}
        >
          A fusion of advanced computational theory with practical industrial execution. The curriculum establishes a deep foundation in algorithms, distributed systems, and secure architecture. A core cornerstone of the degree is an intensive period of mandatory industrial training, translating academic principles into production-grade environments by building high-concurrency backend systems and navigating real-world software development lifecycles.
        </p>
      </div>

      {/* 2. ACADEMIC TIMELINE CARDS */}
      <div className="space-y-6 pt-2">
        {/* Higher Education Node */}
        <div className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                      shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                      hover:-translate-y-0.5 
                      transition-all duration-300 ease-out flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeTheme.accentColor}`} />
              <h3 className={`text-lg font-bold text-slate-900 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
                University of Ruhuna
              </h3>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              BCS (Hons) in Computer Science 
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              Specialized focus in full-stack systems architecture, advanced database management, cryptography, and artificial intelligence frameworks along with engineering + coding best practices.
            </p>
          </div>
          
          <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 min-w-[120px]">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
              2026
            </span>
            <span 
              className="text-xs font-mono font-bold border px-2.5 py-1 rounded-md transition-colors duration-300 bg-white"
              style={{ color: activeTheme.fillColor, borderColor: activeTheme.fillColor + '40' }}
            >
              GPA: 3.87 / 4.0
            </span>
          </div>
        </div>

        {/* Secondary Education Node */}
        <div className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                      shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                      hover:-translate-y-0.5 
                      transition-all duration-300 ease-out flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:${activeTheme.accentColor} transition-colors duration-300`} />
              <h3 className={`text-lg font-bold text-slate-900 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
                Ananda College Colombo 10
              </h3>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              GCE Advanced Levels (Physical Science Stream)
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              Core focus on Combined Mathematics, Physics, and Chemistry. Developed an early foundational base in formal logic and analytical scientific computation.
            </p>
          </div>
          
          <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 min-w-[120px]">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
              2019
            </span>
          </div>
        </div>
      </div>

      {/* 3. UNDERLYING LOGIC CAPABILITY BLOCK */}
      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
          Core Academic Competencies
        </h4>
        <div className="flex flex-wrap gap-2 pt-1">
          {['Predicate Calculus', 'Formal Verification', 'Algebra', 'Compiler Design', 
            'Automata Theory', 'Discrete Mathematics', 'Relational Models', 
            'Data Structures & Algorithms', 'Computer Systems', 'Database Management',
            'Data & Network Security', 'Distributed Systems', 'OOSD & OOP', 
            'Operating Systems', 'Computer Graphics & Image Processing',
            'Project Management', 'E-Commerce & Professional Practices', 'Data warehousing & Data Mining',
            'Neural Networks & AI', 'Internet Services & Protocols', 'Design Patterns', 'Software Architecture'
          ].map((topic, i) => (
            <span 
              key={i} 
              className="text-[11px] font-mono font-medium bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm hover:border-slate-300 transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}