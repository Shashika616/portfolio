"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Section } from '../types';
import { useGlobalTheme } from '../context/ThemeContext';

// Import section layouts
import { WelcomeSection } from './sections/WelcomeSection';
import { AboutSection } from './sections/AboutSection';
import { EducationSection } from './sections/EducationSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ContactSection } from './sections/ContactSection';

interface ContentCardProps {
  sec: Section;
  idx: number;
  currentIndex: number;
  cardScrollProgress: number;
  handleCardScroll: (index: number) => void;
  setRef: (el: HTMLDivElement | null) => void;
}

function ContentCardComponent({
  sec,
  idx,
  currentIndex,
  cardScrollProgress,
  handleCardScroll,
  setRef
}: ContentCardProps) {
  const { activeTheme } = useGlobalTheme();
  const isCurrent = idx === currentIndex;
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCurrent) {
      setShowScrollTop(false);
    }
  }, [currentIndex, isCurrent]);

  const handleScroll = () => {
    handleCardScroll(idx);
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className="absolute inset-0 w-full h-full bg-white rounded-2xl border border-slate-200 lg:border-2 shadow-[0_10px_30px_rgba(148,163,184,0.04)] lg:shadow-[0_25px_60px_rgba(148,163,184,0.06)] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
      style={{
        opacity: isCurrent ? 1 : 0,
        transform: isCurrent 
          ? 'scale(1) translate3d(0, 0, 0)' 
          : 'scale(0.97) translate3d(0, 15px, 0)',
        pointerEvents: isCurrent ? 'auto' : 'none',
        zIndex: isCurrent ? 10 : 0,
        borderColor: isCurrent ? activeTheme.fillColor + '40' : '#e2e8f0' 
      }}
    >
      {/* CARD TOP BAR BOUNDS - Fluid spacing for mobile viewports */}
      <div className="px-5 sm:px-10 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeTheme.accentColor}`} />
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-slate-400 font-bold uppercase">
            {sec.title.toUpperCase()}
          </span>
        </div>
      </div>

      {/* CONTENT INNER WRAPPER - Padding steps down fluidly on smaller screens */}
      <div 
        ref={(el) => {
          scrollContainerRef.current = el;
          setRef(el); 
        }}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-10 lg:px-12 lg:py-12 space-y-8 scroll-smooth select-text will-change-scroll"
        style={{ scrollbarWidth: 'thin' }}
      >
        {sec.id === 'welcome' && <WelcomeSection />}
        {sec.id === 'about' && <AboutSection />}
        {sec.id === 'education' && <EducationSection sec={sec} />}
        {sec.id === 'projects' && <ProjectsSection sec={sec} />}
        {sec.id === 'experience' && <ExperienceSection sec={sec} />}
        {sec.id === 'contact' && <ContactSection sec={sec} />}

        {/* COMPONENT-ADAPTIVE SCROLL-TO-TOP BUTTON - Adjusted safe positions for mobile thumbs */}
        <button
          onClick={scrollToTop}
          style={{ backgroundImage: activeTheme.gradient }}
          className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-2.5 sm:p-3 text-white rounded-full shadow-lg border-none hover:brightness-110 transition-all duration-300 ease-out z-40 flex items-center justify-center pointer-events-auto ${
            showScrollTop && isCurrent
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* FOOTER PROGRESS LAYER */}
      <div className="h-1 bg-slate-100 w-full relative flex-shrink-0">
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-75 ease-out"
          style={{ 
            width: `${idx === currentIndex ? cardScrollProgress * 100 : 0}%`,
            backgroundImage: activeTheme.gradient
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(ContentCardComponent, (prevProps, nextProps) => {
  const isNowOrWasActive = prevProps.idx === prevProps.currentIndex || prevProps.idx === nextProps.currentIndex;
  return !isNowOrWasActive ? true : prevProps.currentIndex === nextProps.currentIndex && prevProps.cardScrollProgress === nextProps.cardScrollProgress;
});