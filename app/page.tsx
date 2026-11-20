"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useMotionValue, useSpring, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

import { SECTIONS, dialAngle, DIAL_STEP } from './sectionsData';
import ProfileHeader from './components/ProfileHeader';
import WatchDial from './components/WatchDial';
import ContentCard from './components/ContentCard';
import ThemeSelector from './components/ThemeSelector';
import Exhibit from './components/Exhibit';
import { introGate, clearIntroSkip } from './lib/navigation';

// Any open dialog (project/experience/certificate/CV) marks its scroll pane with
// this class so global wheel + keyboard section navigation stands down.
const isModalOpen = () => document.querySelector('.modal-scroll-pane, [role="dialog"]') !== null;

export default function LuxuryInstrumentWatchPortfolio() {
  // In-app "go to the dial" skips the intro; any reload starts from it.
  const [landingDismissed, setShowLandingDismissed] = useState(() => introGate.skipNext);
  useEffect(() => { clearIntroSkip(); }, []);
  const showLanding = !landingDismissed;
  const [currentIndex, setCurrentIndex] = useState(0);      
  const [cardScrollProgress, setCardScrollProgress] = useState(0); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);     
  const lastScrollTime = useRef(0);                          
  const boundaryIntentAccumulator = useRef(0);
  const lastWheelAt = useRef(0);
  const arrivedMidGesture = useRef(false);
  const notches = useRef(0);
  const lastNotchAt = useRef(0);
  const notchDir = useRef(0);
  const notchSpent = useRef(false);
  const lastDelta = useRef(0);
  const pullTimer = useRef<number | null>(null);
  // Rubber-band offset of the card stack while pushing past an edge.
  const pull = useMotionValue(0);
  const pullSpring = useSpring(pull, { bounce: 0, duration: 0.35 });


  const rawRotation = useMotionValue(0); 
  // Critically damped: the hand settles without overshoot (scrolling is not a throw).
  const smoothRotation = useSpring(rawRotation, { bounce: 0, duration: 0.5 });


  useEffect(() => {
    const targetDegree = dialAngle(currentIndex) + cardScrollProgress * DIAL_STEP;
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

  const navigateToId = useCallback((id: string) => {
    const i = SECTIONS.findIndex(s => s.id === id);
    if (i >= 0) jumpToSection(i);
  }, [jumpToSection]);

  useEffect(() => {
    if (showLanding) return; 

    /*
     * Natural but not twitchy paging between sections.
     * - Inside a card, the wheel just scrolls the card.
     * - At an edge, deliberate input builds "intent" toward the next section;
     *   trackpad momentum (strictly shrinking deltas) is ignored, so a flick
     *   that reaches the end doesn't spill into the next section.
     * - A fresh gesture (after a short pause) needs less intent than one that
     *   arrived at the edge mid-swipe.
     * - The card rubber-bands toward the scroll direction as intent builds
     *   and springs back when input stops (visible, physical feedback).
     */
    const GESTURE_GAP_MS = 260;
    const COOLDOWN_MS = 850;
    const PER_EVENT_CAP = 36;
    const FRESH_THRESHOLD = 200;
    const CONTINUING_THRESHOLD = 360;
    const MAX_PULL_PX = 34;
    // Mouse wheels move in discrete notches (|deltaY| ≥ 50, or line/page mode);
    // trackpads stream small, uneven deltas. Each gets its own paging rule.
    const NOTCHES_TO_TURN = 2;
    const NOTCH_WINDOW_MS = 1000;
    // A spin that scrolled content is "spent": its overshoot clicks (which land
    // while Chrome is still animating the scroll) never count. Counting starts
    // after a break of at least NOTCH_BREAK_MS between clicks.
    const NOTCH_BREAK_MS = 250;
    const isMouseNotch = (e: WheelEvent) => e.deltaMode !== 0 || (Math.abs(e.deltaY) >= 50 && Math.abs(e.deltaX) < 1);

    const releasePull = () => {
      if (pullTimer.current) window.clearTimeout(pullTimer.current);
      pullTimer.current = window.setTimeout(() => {
        pull.set(0);
        boundaryIntentAccumulator.current = 0;
      }, 240);
    };

    const handleGlobalWheel = (e: WheelEvent) => {
      if (isModalOpen()) {
        e.stopPropagation();
        return;
      }

      const el = cardRefs.current[currentIndex];
      if (!el) return;

      const now = performance.now();

      if (isMouseNotch(e)) {
        // ---- Mouse wheel: count deliberate notches past the edge. ----
        if (now - lastScrollTime.current < COOLDOWN_MS) return;
        const down = e.deltaY > 0;
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1;
        const atTop = el.scrollTop <= 0;
        const past = (down && atBottom && currentIndex < SECTIONS.length - 1) || (!down && atTop && currentIndex > 0);
        const gap = now - lastNotchAt.current;
        const sameRun = gap < NOTCH_WINDOW_MS && notchDir.current === (down ? 1 : -1);
        lastNotchAt.current = now;
        notchDir.current = down ? 1 : -1;
        if (!past) {
          // This notch scrolled content (or reached the edge): it never counts, and spends the spin.
          notches.current = 0;
          notchSpent.current = true;
          pull.set(0);
          return;
        }
        if (notchSpent.current) {
          if (gap < NOTCH_BREAK_MS && sameRun) return; // still the same spin's overshoot
          notchSpent.current = false;
          notches.current = 0;
        }
        notches.current = sameRun ? notches.current + 1 : 1;
        pull.set((down ? -1 : 1) * MAX_PULL_PX * Math.min(1, notches.current / NOTCHES_TO_TURN) * 0.7);
        releasePull();
        if (notches.current >= NOTCHES_TO_TURN) {
          notches.current = 0;
          pull.set(0);
          jumpToSection(currentIndex + (down ? 1 : -1));
        }
        return;
      }

      // ---- Trackpad: continuous intent with momentum filtering. ----
      const fresh = now - lastWheelAt.current > GESTURE_GAP_MS;
      lastWheelAt.current = now;
      const mag = Math.abs(e.deltaY);
      // Trackpad momentum tails off quickly; ignore only clearly decaying deltas
      // (a deliberate finger push can also shrink a little, so the margin matters).
      const decaying = !fresh && mag < lastDelta.current * 0.92;
      lastDelta.current = mag;

      if (fresh) {
        arrivedMidGesture.current = false;
        boundaryIntentAccumulator.current = 0;
      }
      if (now - lastScrollTime.current < COOLDOWN_MS) return;

      const isScrollingDown = e.deltaY > 0;
      const isAtBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1;
      const isAtTop = el.scrollTop <= 0;
      const pushingPastEdge = (isScrollingDown && isAtBottom && currentIndex < SECTIONS.length - 1) ||
        (!isScrollingDown && isAtTop && currentIndex > 0);

      if (!pushingPastEdge) {
        // Content is still scrolling: if this gesture reaches the edge, it arrives mid-swipe.
        arrivedMidGesture.current = true;
        boundaryIntentAccumulator.current = 0;
        pull.set(0);
        return;
      }

      if (decaying) return; // momentum tail: never turns the page

      const threshold = arrivedMidGesture.current ? CONTINUING_THRESHOLD : FRESH_THRESHOLD;
      boundaryIntentAccumulator.current += Math.min(mag, PER_EVENT_CAP);
      const t = Math.min(1, boundaryIntentAccumulator.current / threshold);
      // Rubber band: eases out as it approaches the limit.
      pull.set((isScrollingDown ? -1 : 1) * MAX_PULL_PX * (1 - Math.pow(1 - t, 2)));
      releasePull();

      if (boundaryIntentAccumulator.current >= threshold) {
        boundaryIntentAccumulator.current = 0;
        arrivedMidGesture.current = true;
        pull.set(0);
        jumpToSection(currentIndex + (isScrollingDown ? 1 : -1));
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [currentIndex, jumpToSection, showLanding, pull]);

  // Keyboard: Alt+Arrow / PageUp / PageDown move between sections when the
  // focused element isn't a text field and no dialog is open.
  useEffect(() => {
    if (showLanding) return;
    const onKey = (e: KeyboardEvent) => {
      if (isModalOpen()) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const next = e.key === 'PageDown' || (e.altKey && e.key === 'ArrowDown');
      const prev = e.key === 'PageUp' || (e.altKey && e.key === 'ArrowUp');
      if (next && currentIndex < SECTIONS.length - 1) { e.preventDefault(); jumpToSection(currentIndex + 1); }
      if (prev && currentIndex > 0) { e.preventDefault(); jumpToSection(currentIndex - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
            className="w-full h-dvh"
          >
            <Exhibit onEnterDial={() => setShowLandingDismissed(true)} />
          </motion.div>
        ) : (
          /* ================= MAIN INSTRUMENT PANEL DASHBOARD ================= */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            className="relative w-full h-dvh bg-[#f8fafc] text-slate-800 font-sans overflow-hidden select-none"
          >
            {/* ================= DESKTOP SIDEBAR NAVIGATION CHASSIS ================= */}
            <nav aria-label="Sections" className="hidden lg:flex fixed top-0 left-0 w-[24vw] h-dvh border-r border-slate-200/80 bg-gradient-to-b from-slate-50 to-white flex-col justify-between py-12 z-40 pointer-events-none shadow-[6px_0_30px_rgba(148,163,184,0.05)] will-change-transform">
              <div className="px-8 pointer-events-auto space-y-3">
                <ProfileHeader />
                <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  <LayoutGrid className="w-4 h-4" /> Profile view
                </Link>
              </div>
              
              <WatchDial
                variant="desktop"
                sections={SECTIONS}
                currentIndex={currentIndex}
                rotation={smoothRotation}
                jumpToSection={jumpToSection}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />

              <div className="h-4 w-full flex-shrink-0" />
            </nav>

            {/* ================= MOBILE-FIRST HORIZONTAL TOP HEADER ================= */}
            <header className="lg:hidden fixed top-0 left-0 w-full h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-[90] flex items-center justify-between px-4 sm:px-6 pointer-events-auto shadow-xs">
              <div className="pl-14">
                <ProfileHeader />
              </div>
            </header>

            {/* ================= WATCHDIAL BRIDGE LAYER ================= */}
            <div className="lg:hidden fixed inset-0 z-[1000] pointer-events-none">
              <WatchDial
                variant="mobile"
                sections={SECTIONS}
                currentIndex={currentIndex}
                rotation={smoothRotation}
                jumpToSection={jumpToSection}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>

            {/* ================= MAIN CONTENT CARDS VIEWPORT ================= */}
            <main className="absolute top-24 lg:top-0 left-0 lg:left-[24vw] w-full lg:w-[76vw] h-[calc(100dvh-6rem)] lg:h-dvh bg-[#f8fafc] flex items-center justify-center lg:justify-start px-4 sm:px-8 lg:pl-16 lg:pr-24 overflow-hidden z-10">
              <motion.div className="relative w-full max-w-5xl h-[calc(100dvh-8.5rem)] lg:h-[84dvh]" style={{ perspective: '1800px', y: pullSpring }}>
                {SECTIONS.map((sec, idx) => (
                  <ContentCard 
                    key={sec.id}
                    sec={sec}
                    idx={idx}
                    currentIndex={currentIndex}
                    cardScrollProgress={cardScrollProgress}
                    handleCardScroll={handleCardScroll}
                    setRef={(el) => { cardRefs.current[idx] = el; }}
                    onNavigate={navigateToId}
                  />
                ))}
              </motion.div>
            </main>

            <ThemeSelector />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}