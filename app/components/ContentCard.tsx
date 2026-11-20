"use client";

import React, { useState, useRef } from 'react';
import { Section } from '../types';

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
  /** Jump to another section by id (used by in-content links such as "See all work"). */
  onNavigate?: (sectionId: string) => void;
  total: number;
}

function ContentCardComponent({
  sec,
  idx,
  currentIndex,
  cardScrollProgress,
  handleCardScroll,
  setRef,
  onNavigate,
  total
}: ContentCardProps) {
  const isCurrent = idx === currentIndex;
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);


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
    <section
      aria-labelledby={`card-title-${sec.id}`}
      aria-hidden={!isCurrent}
      inert={!isCurrent}
      className={`${isCurrent ? "is-active " : ""}absolute inset-0 w-full h-full bg-white rounded-3xl border shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_60px_rgba(15,23,42,0.07)] flex flex-col overflow-hidden card-page will-change-transform`}
      style={{
        // Page turn: a passed section swings away on its left spine, an
        // upcoming one waits folded on its right edge, both softly blurred.
        opacity: isCurrent ? 1 : 0,
        transformOrigin: idx < currentIndex ? 'left center' : 'right center',
        transform: isCurrent
          ? 'translate3d(0, 0, 0) rotateY(0deg)'
          : idx < currentIndex
            ? 'translate3d(-7%, 0, -120px) rotateY(-34deg)'
            : 'translate3d(7%, 0, -120px) rotateY(30deg)',
        filter: isCurrent ? 'blur(0px)' : 'blur(8px)',
        pointerEvents: isCurrent ? 'auto' : 'none',
        zIndex: isCurrent ? 10 : 0,
        borderColor: isCurrent ? 'color-mix(in srgb, var(--accent) 22%, #e2e8f0)' : '#e2e8f0'
      }}
    >
      {/* Card chrome: position in the sequence (matches the dial) + title */}
      <div className="px-5 sm:px-10 lg:px-12 h-14 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <span id={`card-title-${sec.id}`} className="text-sm font-semibold text-slate-900">
            {sec.title}
          </span>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* CONTENT INNER WRAPPER - Padding steps down fluidly on smaller screens */}
      <div 
        ref={(el) => {
          scrollContainerRef.current = el;
          setRef(el); 
        }}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-10 sm:py-10 lg:px-12 lg:py-12 scroll-smooth select-text outline-none"
        tabIndex={-1}
      >
        {sec.id === 'welcome' && <WelcomeSection onNavigate={onNavigate} />}
        {sec.id === 'about' && <AboutSection />}
        {sec.id === 'education' && <EducationSection sec={sec} />}
        {sec.id === 'projects' && <ProjectsSection sec={sec} />}
        {sec.id === 'experience' && <ExperienceSection sec={sec} />}
        {sec.id === 'contact' && <ContactSection sec={sec} />}

        {/* COMPONENT-ADAPTIVE SCROLL-TO-TOP BUTTON - Adjusted safe positions for mobile thumbs */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 right-4 sm:bottom-8 sm:right-8 w-11 h-11 rounded-full bg-white text-slate-800 ring-1 ring-slate-200 shadow-lg hover:bg-slate-50 transition-all duration-300 ease-out z-40 flex items-center justify-center pointer-events-auto ${
            showScrollTop && isCurrent
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }`}
          aria-label="Scroll to top"
          tabIndex={showScrollTop && isCurrent ? 0 : -1}
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
            background: 'var(--accent)'
          }}
        />
      </div>
    </section>
  );
}

export default React.memo(ContentCardComponent, (prevProps, nextProps) => {
  const isNowOrWasActive = prevProps.idx === prevProps.currentIndex || prevProps.idx === nextProps.currentIndex;
  return !isNowOrWasActive ? true : prevProps.currentIndex === nextProps.currentIndex && prevProps.cardScrollProgress === nextProps.cardScrollProgress;
});