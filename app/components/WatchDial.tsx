"use client";

import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { Section } from '../types';
import { useGlobalTheme } from '../context/ThemeContext';

interface WatchDialProps {
  sections: Section[];
  currentIndex: number;
  watchHandTransform: MotionValue<string>;
  structuralGearRotation: MotionValue<string>;
  jumpToSection: (index: number) => void;
}

function WatchDialComponent({
  sections,
  currentIndex,
  watchHandTransform,
  structuralGearRotation,
  jumpToSection
}: WatchDialProps) {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[28rem] h-[28rem] flex items-center justify-center rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-white border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_25px_60px_rgba(100,116,139,0.15)] pointer-events-auto z-50">
      
      <div className="absolute w-[96%] h-[96%] rounded-full bg-gradient-to-br from-slate-200 via-slate-50 to-slate-100 shadow-[inset_0_3px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
        <div className="absolute w-[94%] h-[94%] rounded-full bg-white border border-slate-200/40 flex items-center justify-center overflow-hidden">
          
          {/* ESCAPEMENT CONTROLS */}
          <motion.div style={{ transform: structuralGearRotation }} className="absolute top-1/3 left-1/3 w-14 h-14 rounded-full border border-slate-100 bg-[#fafcfd] shadow-[inset_0_2px_5px_rgba(0,0,0,0.04)] flex items-center justify-center opacity-40">
            <div className="w-10 h-10 rounded-full border border-dashed border-slate-200/80 flex items-center justify-center animate-[spin_40s_linear_infinite]">
              <div className="w-4 h-[0.5px] bg-slate-300" />
            </div>
          </motion.div>

          {/* CHRONOGRAPH INSTRUMENT DIALS */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="0.3 1.2" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

            {[...Array(120)].map((_, i) => {
              const angle = i * 3;
              if (angle < 0 || angle > 180) return null; 
              const rad = (angle - 90) * (Math.PI / 180);
              const isMajor = i % 10 === 0;   
              const isMedium = i % 5 === 0 && !isMajor;

              const tickLength = isMajor ? 9 : isMedium ? 6 : 4;
              const rOuter = 92;
              const rInner = rOuter - tickLength;

              return (
                <line 
                  key={i} 
                  x1={(100 + rOuter * Math.cos(rad)).toFixed(2)} 
                  y1={(100 + rOuter * Math.sin(rad)).toFixed(2)} 
                  x2={(100 + rInner * Math.cos(rad)).toFixed(2)} 
                  y2={(100 + rInner * Math.sin(rad)).toFixed(2)} 
                  stroke={isMajor ? "#334155" : isMedium ? "#64748b" : "#cbd5e1"} 
                  strokeWidth={isMajor ? "1" : "0.5"} 
                />
              );
            })}
          </svg>

          {/* DYNAMIC CHRONOGRAPH ARMATURE CHASSIS */}
          <motion.div 
            style={{ transform: watchHandTransform }}
            className="absolute top-1/2 left-1/2 w-[140px] h-[2px] bg-slate-800 origin-left z-20 will-change-transform shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
          >
            <svg className="absolute right-0 -top-[5px] w-3 h-3" viewBox="0 0 12 12">
              <path d="M2 1 L10 6 L2 11 Z" fill={activeTheme.fillColor || "#3b82f6"} />
            </svg>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-slate-200 via-white to-slate-100 z-30 shadow-[0_2px_5px_rgba(0,0,0,0.15)] border border-slate-300 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

        </div>
      </div>

      {/* FLYBACK LINKS */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
        {sections.map((sec, index) => {
            const isCurrent = currentIndex === index;
            const spreadArcDegree = -55 + (index * 22); 
            const rad = spreadArcDegree * (Math.PI / 180);
            const radiusDistance = 235; 
            
            const x = (radiusDistance * Math.cos(rad)).toFixed(2);
            const y = (radiusDistance * Math.sin(rad)).toFixed(2);

            return (
              <button
                key={sec.id}
                onClick={() => jumpToSection(index)}
                className="absolute pointer-events-auto flex items-center gap-2.5 group whitespace-nowrap focus:outline-none"
                style={{ transform: `translate3d(${x}px, ${y}px, 0) translateY(-50%)` }}
              >
                <span 
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    isCurrent ? 'w-5 shadow-[0_1px_4px_rgba(0,0,0,0.15)]' : 'bg-slate-300 w-2 group-hover:bg-slate-400'
                  }`}
                  style={isCurrent ? { backgroundImage: activeTheme.gradient } : {}}
                />

                <div className="flex flex-col items-start text-left leading-none bg-white/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
                  <span 
                    className="font-mono text-[9px] tracking-tight font-bold transition-all duration-200"
                    style={isCurrent ? { 
                      color: 'transparent', 
                      backgroundImage: activeTheme.gradient, 
                      WebkitBackgroundClip: 'text' 
                    } : { 
                      color: '#94a3b8' 
                    }}
                  >
                    0{index + 1}
                  </span>
                  <span className={`text-[13px] tracking-wider uppercase font-sans mt-0.5 transition-all duration-200 ${
                    isCurrent ? 'text-slate-950 font-extrabold scale-[1.02]' : 'text-slate-400 font-medium group-hover:text-slate-600'
                  }`}>
                    {sec.title}
                  </span>
                </div>
              </button>
            );
        })}
      </div>
    </div>
  );
}

export default React.memo(WatchDialComponent);