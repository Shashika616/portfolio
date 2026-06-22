"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion';

import { SECTIONS } from './sectionsData';
import ProfileHeader from './components/ProfileHeader';
import WatchDial from './components/WatchDial';
import ContentCard from './components/ContentCard';
import ThemeSelector from './components/ThemeSelector';
import LandingPage from './components/LandingPage'; 

export default function LuxuryInstrumentWatchPortfolio() {
  const [showLanding, setShowLanding] = useState(true); 
  const [currentIndex, setCurrentIndex] = useState(0);      
  const [cardScrollProgress, setCardScrollProgress] = useState(0); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);     
  const lastScrollTime = useRef(0);                          
  const boundaryIntentAccumulator = useRef(0); 

  const rawRotation = useMotionValue(0); 
  const smoothRotation = useSpring(rawRotation, { stiffness: 90, damping: 24, mass: 0.4 });

  const watchHandTransform = useTransform(smoothRotation, (value) => `rotate(${value}deg) translateZ(0)`);
  const structuralGearRotation = useTransform(smoothRotation, (value) => `rotate(${value * 0.4}deg)`);

  useEffect(() => {
    const targetDegree = -55 + (currentIndex * 22) + (cardScrollProgress * 22);
    rawRotation.set(targetDegree);
  }, [currentIndex, cardScrollProgress, rawRotation]);

  const handleCardScroll = useCallback((index: number) => {
    if (index !== currentIndex) return; 
    const el = cardRefs.current[index];
    if (!el) return;

    const totalScrollable = el.scrollHeight - el.clientHeight;
    if (totalScrollable <= 0) {
      setCardScrollProgress(0);
      return;
    }
    setCardScrollProgress(el.scrollTop / totalScrollable);
  }, [currentIndex]);

  const jumpToSection = useCallback((index: number) => {
    lastScrollTime.current = performance.now();
    boundaryIntentAccumulator.current = 0;
    setCurrentIndex(index);
    setCardScrollProgress(0);
  }, []);

  useEffect(() => {
    if (showLanding) return; 

    const handleGlobalWheel = (e: WheelEvent) => {
      const isModalPresent = document.querySelector('.modal-scroll-pane') || document.body.innerText.includes('ESC // CLOSE');
      
      if (isModalPresent) {
        e.stopPropagation();
        return;
      }

      const el = cardRefs.current[currentIndex];
      if (!el) return;

      const now = performance.now();
      if (now - lastScrollTime.current < 800) return; 

      const isScrollingDown = e.deltaY > 0;
      const isAtBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1;
      const isAtTop = el.scrollTop <= 0;

      if (isScrollingDown && isAtBottom) {
        if (currentIndex < SECTIONS.length - 1) {
          boundaryIntentAccumulator.current += Math.abs(e.deltaY);
          if (boundaryIntentAccumulator.current > 180) { 
            jumpToSection(currentIndex + 1);
          }
        }
        return;
      }

      if (!isScrollingDown && isAtTop) {
        if (currentIndex > 0) {
          boundaryIntentAccumulator.current += Math.abs(e.deltaY);
          if (boundaryIntentAccumulator.current > 180) {
            jumpToSection(currentIndex - 1);
          }
        }
        return;
      }

      boundaryIntentAccumulator.current = 0;
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [currentIndex, jumpToSection, showLanding]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLanding ? (
          /* ================= LANDING INITIALIZATION PHASE ================= */
          <motion.div
            key="landing-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-screen"
          >
            <LandingPage onEnter={() => setShowLanding(false)} />
          </motion.div>
        ) : (
          /* ================= MAIN INSTRUMENT PANEL DASHBOARD ================= */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            className="relative w-screen h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden select-none"
          >
            {/* ================= DESKTOP SIDEBAR NAVIGATION CHASSIS ================= */}
            <div className="hidden lg:flex fixed top-0 left-0 w-[24vw] h-screen border-r border-slate-200/80 bg-gradient-to-b from-slate-50 to-white flex-col justify-between py-12 z-40 pointer-events-none shadow-[6px_0_30px_rgba(148,163,184,0.05)] will-change-transform">
              <div className="px-8 pointer-events-auto">
                <ProfileHeader />
              </div>
              
              <WatchDial 
                sections={SECTIONS}
                currentIndex={currentIndex}
                watchHandTransform={watchHandTransform}
                structuralGearRotation={structuralGearRotation}
                jumpToSection={jumpToSection}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />

              <div className="h-4 w-full flex-shrink-0" />
            </div>

            {/* ================= MOBILE-FIRST HORIZONTAL TOP HEADER ================= */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-[90] flex items-center justify-between px-4 sm:px-6 pointer-events-auto shadow-xs">
              <div className="pt-5 pl-14 sm:pl-16">
                <ProfileHeader />
              </div>
            </div>

            {/* ================= WATCHDIAL BRIDGE LAYER ================= */}
            <div className="lg:hidden fixed inset-0 z-[1000] pointer-events-none">
              <WatchDial 
                sections={SECTIONS}
                currentIndex={currentIndex}
                watchHandTransform={watchHandTransform}
                structuralGearRotation={structuralGearRotation}
                jumpToSection={jumpToSection}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>

            {/* ================= MAIN CONTENT CARDS VIEWPORT ================= */}
            <div className="absolute top-24 lg:top-0 left-0 lg:left-[24vw] w-full lg:w-[76vw] h-[calc(100vh-6rem)] lg:h-screen bg-[#f8fafc] flex items-center justify-center lg:justify-start px-4 sm:px-8 lg:pl-16 lg:pr-24 overflow-hidden z-10">
              <div className="relative w-full max-w-5xl h-[76vh] lg:h-[84vh]">
                {SECTIONS.map((sec, idx) => (
                  <ContentCard 
                    key={sec.id}
                    sec={sec}
                    idx={idx}
                    currentIndex={currentIndex}
                    cardScrollProgress={cardScrollProgress}
                    handleCardScroll={handleCardScroll}
                    setRef={(el) => { cardRefs.current[idx] = el; }}
                  />
                ))}
              </div>
            </div>

            <ThemeSelector />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}