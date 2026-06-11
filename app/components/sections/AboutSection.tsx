"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalTheme } from "../../context/ThemeContext";

export function AboutSection() {
  const { activeTheme } = useGlobalTheme();
  const [isLocalCvOpen, setIsLocalCvOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Viewport scroll-lock controller when the portal modal is active
  useEffect(() => {
    if (!isLocalCvOpen) return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalHtmlHeight = htmlElement.style.height;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalBodyHeight = bodyElement.style.height;

    htmlElement.style.overflow = "hidden";
    htmlElement.style.height = "100vh";
    bodyElement.style.overflow = "hidden";
    bodyElement.style.height = "100vh";

    return () => {
      htmlElement.style.overflow = originalHtmlOverflow;
      htmlElement.style.height = originalHtmlHeight;
      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.height = originalBodyHeight;
    };
  }, [isLocalCvOpen]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. ARCHITECTURAL PROFILE */}
      <div className="space-y-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Software Engineer</h2>
        <p 
          className="text-slate-600 text-lg leading-relaxed border-l-2 pl-6 transition-all duration-300"
          style={{ borderColor: activeTheme.fillColor }}
        >
          I am a Software Engineer passionate about building secure, intelligent, and scalable systems that solve real-world problems. My work combines cybersecurity research, artificial intelligence, distributed systems, system design, and modern software engineering to develop solutions that are both technically advanced and practically impactful.
        </p>
        <p className="text-slate-500 text-base leading-relaxed pl-6">
          Beyond compiling runtime logic and hardening networks, I thrive in high-tempo domains requiring strategic focus and creative expression. Whether executing plays on the field as an active sportsman, writing chord progressions as a musician, or breaking down macro metas as an analytical gamer, I approach everyday engineering with the same drive, rhythm, and tactical grit.
        </p>
      </div>

      {/* 4. PERSONAL INFO SECTION */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Personal Information</h4>
        
        <div className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <img src="/file.png" alt="Profile" className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-grow w-full">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
              <p className="text-sm text-slate-900 font-medium">W Shashika Madhushan Fernando</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
              <p className="text-sm text-slate-900 font-medium">Colombo, Sri Lanka</p>
            </div>
            
            {/* Socials & Trigger Actions */}
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              
              {/* GitHub Button - Theme Adapted */}
              <a 
                href="https://github.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm border"
                style={{ 
                  color: activeTheme.fillColor, 
                  backgroundColor: activeTheme.fillColor + '10',
                  borderColor: activeTheme.fillColor + '25'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = activeTheme.fillColor + '20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeTheme.fillColor + '10';
                }}
                aria-label="GitHub Profile"
              >
                <svg className="w-5 h-5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48.0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.008.069-.008 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              
              {/* LinkedIn Button - Theme Adapted */}
              <a 
                href="https://linkedin.com/in/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm border"
                style={{ 
                  color: activeTheme.fillColor, 
                  backgroundColor: activeTheme.fillColor + '10',
                  borderColor: activeTheme.fillColor + '25'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = activeTheme.fillColor + '20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeTheme.fillColor + '10';
                }}
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              
              <button 
                onClick={() => setIsLocalCvOpen(true)}
                style={{ backgroundImage: activeTheme.gradient }}
                className="ml-auto px-5 py-2.5 text-white rounded-lg text-sm font-semibold hover:brightness-110 shadow-md transition-all duration-300 border-none cursor-pointer"
              >
                View CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE PILLARS WITH HOVER SHADOWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[
          { title: "Cybersecurity & Cryptography", desc: "Focused on secure authentication and password storage. I explore advanced transformation techniques, mathematical modeling, and memory-hard hashing algorithms to improve security while maintaining usability." },
          { title: "Distributed Systems & Backend", desc: "Designing high-performance, reliable systems with a focus on efficient data flow. I enjoy structuring large-scale applications to handle real-world operational challenges." },
          { title: "AI & Neural Systems", desc: "Developing intelligent applications using CNN-based systems, intelligent analysis platforms, and deep learning solutions for complex data interpretation." },
          { title: "R&D Lifecycle", desc: "Bridging the gap between academic research and shipping industrial-strength software. I continuously explore emerging technologies through iterative prototyping and formal verification." }
        ].map((pillar, i) => (
          <div 
            key={i}
            className="group relative p-6 rounded-2xl border border-slate-200 bg-white 
                       shadow-[0_4px_12px_rgba(0,0,0,0.03)] 
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                       hover:-translate-y-1 
                       transition-all duration-300 ease-out"
          >
            <h4 className={`font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:${activeTheme.textColor} transition-colors duration-300`}>
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeTheme.accentColor}`} />
              {pillar.title}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. ADDITIONAL CAPABILITIES & PHILOSOPHY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-slate-900 text-slate-300 shadow-xl border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Immersive Design</h4>
          <p className="text-sm leading-relaxed text-slate-400">
            I enjoy creating immersive, interactive digital experiences that combine strong engineering principles with modern UI/UX concepts. From futuristic web interfaces to full-stack applications, I aim to build technology that balances functionality, performance, and user experience.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 text-slate-300 shadow-xl border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Professional Values</h4>
          <p className="text-sm leading-relaxed text-slate-400 italic">
            "I value problem-solving, critical thinking, adaptability, and continuous learning. I work effectively both independently and collaboratively, focusing on translating complex ideas into practical, scalable solutions driven by curiosity and innovation."
          </p>
        </div>
      </div>

      {/* 5. SUMMARY STATUS TICKER */}
      <div className="flex items-center gap-8 border-t border-slate-200 pt-8 mt-8">
        <div>
          <div className="text-xl font-extrabold text-slate-900">100%</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">Systems Driven</div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-slate-900">Secure</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">By Design</div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-slate-900">Adaptive</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">Research Ready</div>
        </div>
      </div>

      {/* ISOLATED GLOBAL PORTAL OVERLAY */}
      {mounted && ReactDOM.createPortal(
        <AnimatePresence>
          {isLocalCvOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto isolate">
              
              {/* Backdrop Mask Frame */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsLocalCvOpen(false)}
                className="absolute inset-0 cursor-pointer"
              />

              {/* Card Chassis */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                /* Type-safe separation of transition properties */
                exit={{ 
                  opacity: 0, 
                  scale: 0.98, 
                  y: 10,
                  transition: { type: "tween", ease: "easeIn", duration: 0.15 }
                }}
                transition={{ 
                  type: "spring", 
                  damping: 30, 
                  stiffness: 400
                }}
                className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden z-10"
                style={{ borderColor: activeTheme.fillColor + '40' }}
              >
                {/* Modal Header Controls */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeTheme.accentColor}`} />
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                      My CV - {new Date().getFullYear()}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsLocalCvOpen(false)}
                    className="px-3 py-1 rounded-md font-mono text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors border-none bg-transparent cursor-pointer"
                  >
                     ✕
                  </button>
                </div>

                {/* Live PDF Frame Layout */}
                <div className="flex-1 bg-slate-100 p-4 relative">
                  <iframe 
                    src="/cv.pdf" 
                    className="w-full h-full rounded-xl shadow-inner border border-slate-200 bg-white"
                    title="Curriculum Vitae Document Preview"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}