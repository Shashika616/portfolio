"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  MotionValue,
  animate,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

import { PROFILE } from "../data/profile";
import { CATALOG } from "../data/catalog";
import ThemeSelector from "./ThemeSelector";
import { Letter } from "./Letter";
import { NameLoader } from "./ui/NameLoader";
import { Typewriter } from "./ui/Typewriter";

/**
 * The entrance, staged like a gallery opening.
 *
 *   progress 0.00 → 0.18  the wordmark sharpens out of blur, then dissolves
 *   progress 0.10 → 0.78  a vortex of real system screenshots and
 *                         architecture diagrams spirals out of depth
 *   progress 0.70 → 1.00  two covers settle: The Dial and The Profile
 *
 * The page never scrolls. Wheel, touch and keys move one target value; a
 * critically damped spring smooths it, and every element derives its state
 * from that single value, so the sequence can be scrubbed and reversed at
 * any point. Choosing a cover flips it on its vertical axis, then enters.
 */

const WHEEL_SCALE = 1 / 2600;
const TOUCH_SCALE = 1 / 900;
const KEY_STEP = 0.14;

const VORTEX_COUNT = 26;

// Images for the vortex: covers first (live screenshots), then diagrams.
const VORTEX_IMAGES: string[] = (() => {
  const all = [...CATALOG.projects, ...CATALOG.researches, ...CATALOG.games];
  const urls = [
    ...all.map((p) => p.cover),
    ...all.flatMap((p) => p.mediaGroups?.flatMap((g) => g.items.map((i) => i.url)) ?? []),
  ].filter((u): u is string => !!u && !/\.(mp4|webm|ogg|mov)$/i.test(u));
  const unique = [...new Set(urls)];
  // Enough prints to read as a stream; repeat the set if there are fewer.
  return Array.from({ length: VORTEX_COUNT }, (_, i) => unique[i % unique.length]);
})();


/** Round to 2 dp so server- and client-rendered transforms match exactly (no hydration mismatch). */
const r2 = (v: number) => Math.round(v * 100) / 100;

export default function Exhibit({ onEnterDial }: { onEnterDial: () => void }) {
  const router = useRouter();
  const target = useMotionValue(0);
  const progress = useSpring(target, { bounce: 0, duration: 0.9 });
  const [intro, setIntro] = useState(true);       // wordmark reveal + loader
  const [chooserLive, setChooserLive] = useState(false);
  const [leaving, setLeaving] = useState<null | "dial" | "profile">(null);
  const touchY = useRef<number | null>(null);

  const reduced = !!useReducedMotion();

  const [hovered, setHovered] = useState<null | "dial" | "profile">(null);
  const [interim, setInterim] = useState<null | "dial" | "profile">(null);
  const [letter, setLetter] = useState<null | "dial" | "profile">(null);
  const autoplay = useRef<ReturnType<typeof animate> | null>(null);

  useMotionValueEvent(progress, "change", (v) => setChooserLive(v > 0.9));

  // The intro plays by itself, like a title sequence: the wordmark lands,
  // holds, dissolves, the vortex streams past, the covers settle. Any wheel,
  // touch or key input takes the timeline over from wherever it is.
  // Reduced motion: no vortex, straight to the covers.
  useEffect(() => {
    if (reduced) {
      target.set(1);
      progress.jump(1);
    }
    const t1 = window.setTimeout(() => setIntro(false), reduced ? 0 : 1600);
    const t2 = reduced
      ? 0
      : window.setTimeout(() => {
          autoplay.current = animate(target, 1, { duration: 4.8, ease: [0.3, 0, 0.45, 1] });
        }, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      autoplay.current?.stop();
    };
  }, [reduced, target, progress]);

  const nudge = useCallback(
    (delta: number) => {
      if (intro || leaving) return;
      autoplay.current?.stop();
      target.set(Math.min(1, Math.max(0, target.get() + delta)));
    },
    [intro, leaving, target]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => nudge(e.deltaY * WHEEL_SCALE);
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const y = e.touches[0].clientY;
      nudge((touchY.current - y) * TOUCH_SCALE);
      touchY.current = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); nudge(KEY_STEP); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); nudge(-KEY_STEP); }
      if (e.key === "End") target.set(1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [nudge, target]);

  const skip = () => {
    setIntro(false);
    autoplay.current?.stop();
    animate(target, 1, { duration: 0 });
  };

  // Cover flips on its spine → black → title card with a pulsing dot → enter.
  const choose = (which: "dial" | "profile") => {
    if (leaving) return;
    setLeaving(which);
    if (reduced) return enter(which);
    window.setTimeout(() => setInterim(which), 820);
    window.setTimeout(() => setLetter(which), 820 + 2300);
  };

  const enter = (which: "dial" | "profile") => (which === "dial" ? onEnterDial() : router.push("/profile"));

  // ---- derived values ----
  const wordOpacity = useTransform(progress, [0, 0.05, 0.13], [1, 1, 0]);
  const wordBlur = useTransform(progress, [0, 0.04, 0.13], ["blur(0px)", "blur(0px)", "blur(14px)"]);
  const wordScale = useTransform(progress, [0, 0.13], [1, 1.08]);
  const hintOpacity = useTransform(progress, [0, 0.12, 0.2], [1, 1, 0]);
  const chooserOpacity = useTransform(progress, [0.8, 0.95], [0, 1]);
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="exhibit fixed inset-0 overflow-hidden bg-[#060607] text-white select-none [@media(pointer:fine)]:cursor-none [&_*]:[@media(pointer:fine)]:cursor-none" style={{ touchAction: "none" }}>
      {/* Theme light: the original palettes colour the dark stage */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-[30vh] left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-[50%] blur-[90px] opacity-[0.22]" style={{ backgroundImage: "var(--accent-gradient)" }} />
        <div className="absolute -top-[35vh] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] rounded-[50%] blur-[100px] opacity-[0.10]" style={{ backgroundImage: "var(--accent-gradient)" }} />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-40 h-16 px-5 sm:px-8 flex items-center justify-between">
        <span className="text-[13px] tracking-[0.02em] text-white/70">{PROFILE.name}</span>
        <button onClick={skip} className="text-[13px] text-white/60 hover:text-white transition-colors px-3 h-9 rounded-lg hover:bg-white/5">
          Skip
        </button>
      </div>

      {/* Vortex */}
      <div className="absolute inset-0 z-10" style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }} aria-hidden>
        <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
          {!reduced && VORTEX_IMAGES.map((src, i) => <VortexCard key={i} src={src} index={i} count={VORTEX_IMAGES.length} progress={progress} />)}
        </div>
      </div>

      {/* Wordmark */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        style={{ opacity: wordOpacity, filter: wordBlur, scale: wordScale }}
      >
        <Reveal delay={0.15}>
          <span className="display italic block text-[clamp(1.1rem,2.2vw,1.7rem)]" style={{ color: "var(--accent)" }}>
            The work of
          </span>
        </Reveal>
        <Reveal delay={0.35}>
          <span className="display block text-[clamp(1.4rem,3.2vw,2.4rem)] tracking-[0.22em] uppercase text-white/85 mt-1">Shashika</span>
        </Reveal>
        <Reveal delay={0.55}>
          <span className="display block text-[clamp(3.6rem,13vw,10.5rem)] uppercase tracking-[0.02em]">Fernando</span>
        </Reveal>
        <Reveal delay={0.9}>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/65">
            Software engineer. Distributed systems, security and applied AI, built and shipped from {PROFILE.location.split(",")[0]}.
          </p>
        </Reveal>
      </motion.div>

      {/* Scroll hint / loader */}
      <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center gap-3 pointer-events-none">
        <NameLoader className="display text-[15px] tracking-[0.32em] text-white/85" />

      </motion.div>

      {/* Chooser */}
      <motion.div
        style={{ opacity: chooserOpacity }}
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center px-5 ${chooserLive ? "" : "pointer-events-none"}`}
      >
        {/* Hover backdrop: a giant serif word sharpens in behind the covers. */}
        <AnimatePresence>
          {hovered && !leaving && (
            <motion.p
              key={hovered}
              aria-hidden
              initial={{ opacity: 0, filter: "blur(16px)", x: hovered === "dial" ? -40 : 40 }}
              animate={{ opacity: 0.16, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(12px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`display uppercase absolute top-1/2 -translate-y-1/2 text-[22vw] leading-none whitespace-nowrap pointer-events-none select-none ${hovered === "dial" ? "left-[-2vw]" : "right-[-2vw]"}`}
            >
              {hovered === "dial" ? "The Dial" : "Profile"}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="flex gap-5 sm:gap-14" style={{ perspective: "1400px" }}>
          <Cover
            kind="dial"
            progress={progress}
            leaving={leaving}
            hovered={hovered}
            onHover={setHovered}
            onChoose={() => choose("dial")}
            disabled={!chooserLive}
          />
          <Cover
            kind="profile"
            progress={progress}
            leaving={leaving}
            hovered={hovered}
            onHover={setHovered}
            onChoose={() => choose("profile")}
            disabled={!chooserLive}
          />
        </div>
      </motion.div>

      {/* Progress hairline in the theme gradient */}
      <motion.div aria-hidden className="absolute bottom-0 left-0 right-0 h-[2px] origin-left z-40" style={{ scaleX: barScale, backgroundImage: "var(--accent-gradient)" }} />

      {/* Exit veil */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-50 bg-[#060607] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 1 : 0 }}
        transition={{ duration: 0.35, delay: leaving ? 0.45 : 0 }}
      />

      {/* Title card between rooms */}
      <AnimatePresence>
        {interim && (
          <motion.div
            className="absolute inset-0 z-[60] bg-[#0b0b0d] flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Reveal delay={0.1}>
              <span className="display italic block text-xl sm:text-2xl" style={{ color: "var(--accent)" }}>
                {interim === "dial" ? "Vol. 01" : "Vol. 02"}
              </span>
            </Reveal>
            <Typewriter
              paragraphs={[interim === "dial" ? "The Dial" : "The Profile"]}
              cps={11}
              startDelay={250}
              paragraphClassName="display uppercase text-[clamp(3rem,11vw,8rem)] leading-none"
            />
            <NameLoader className="mt-10 display text-[15px] tracking-[0.32em] text-white/85" />
          </motion.div>
        )}
      </AnimatePresence>

      {letter && <Letter destination={letter} onDone={() => enter(letter)} />}

      <div className="exhibit-theme">
        <ThemeSelector />
      </div>
    </div>
  );
}

/** Line reveal: rises out of a soft blur, like a print coming into focus. */
function Reveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * One print in the vortex, after the reference: prints are born small at the
 * centre, wind outward along one spiral arm while curling like paper, and
 * rush past the camera. Each print enters a little after the one before, so
 * the arm reads as a continuous stream.
 */
function VortexCard({ src, index, count, progress }: { src: string; index: number; count: number; progress: MotionValue<number> }) {
  const start = 0.1 + (index / count) * 0.55;   // staggered births along the timeline
  const end = start + 0.3;
  const arm = index * 31;                        // consecutive prints step around the arm

  const local = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const z = useTransform(local, [0, 1], [-1600, 900]);
  const turn = useTransform(local, (t) => arm + t * 210);
  const radius = useTransform(local, (t) => 12 + Math.pow(t, 1.7) * 560);
  const x = useTransform([turn, radius] as MotionValue<number>[], ([a, r]: number[]) => r2(Math.cos((a * Math.PI) / 180) * r));
  const y = useTransform([turn, radius] as MotionValue<number>[], ([a, r]: number[]) => r2(Math.sin((a * Math.PI) / 180) * r * 0.8));
  const rotZ = useTransform(turn, (a) => r2(a + 90));
  const bendX = useTransform(local, (t) => r2(Math.sin(t * Math.PI * 2.4 + index) * 48));
  const bendY = useTransform(local, (t) => r2(Math.cos(t * Math.PI * 1.8 + index * 0.7) * 54));
  const opacity = useTransform(local, [0, 0.06, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute -ml-[60px] -mt-[45px] sm:-ml-[75px] sm:-mt-[56px] w-[120px] sm:w-[150px] aspect-[4/3] will-change-transform"
      style={{ x, y, z, rotateZ: rotZ, rotateX: bendX, rotateY: bendY, opacity, transformStyle: "preserve-3d" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="w-full h-full object-cover rounded-[2px] shadow-[0_24px_50px_rgba(0,0,0,0.55)] bg-white"
        style={{ backfaceVisibility: "visible" }}
      />
    </motion.div>
  );
}

/** A magazine-style cover for each way in. Flips on its Y axis when chosen. */
function Cover({
  kind,
  progress,
  leaving,
  hovered,
  onHover,
  onChoose,
  disabled,
}: {
  kind: "dial" | "profile";
  progress: MotionValue<number>;
  leaving: null | "dial" | "profile";
  hovered: null | "dial" | "profile";
  onHover: (k: null | "dial" | "profile") => void;
  onChoose: () => void;
  disabled: boolean;
}) {
  const from = kind === "dial" ? -1 : 1;
  const local = useTransform(progress, [0.7, 0.97], [0, 1], { clamp: true });
  const z = useTransform(local, [0, 1], [-900, 0]);
  const rotY = useTransform(local, [0, 1], [from * 55, 0]);
  const x = useTransform(local, [0, 1], [from * 160, 0]);

  const chosen = leaving === kind;
  const other = leaving && leaving !== kind;
  const lifted = !leaving && hovered === kind;
  const dimmed = !leaving && hovered !== null && hovered !== kind;

  return (
    <motion.button
      type="button"
      onClick={onChoose}
      disabled={disabled}
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      data-cursor={kind === "dial" ? "Enter" : "Open"}
      aria-label={kind === "dial" ? "Enter the interactive dial view" : "Open the profile view"}
      className="group relative w-[42vw] max-w-[280px] aspect-[3/4] text-left outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      style={{ x, z, rotateY: rotY, transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", transformOrigin: kind === "dial" ? "left center" : "right center" }}
        animate={
          chosen
            ? { rotateY: kind === "dial" ? -110 : 110, opacity: 0.2, scale: 1, filter: "blur(0px)" }
            : other
              ? { opacity: 0, scale: 0.92, filter: "blur(4px)" }
              : lifted
                ? { rotateY: kind === "dial" ? 6 : -6, scale: 1.07, y: -10, opacity: 1, filter: "blur(0px)" }
                : dimmed
                  ? { rotateY: 0, scale: 0.95, y: 0, opacity: 0.4, filter: "blur(2px)" }
                  : { rotateY: 0, scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }
        }
        transition={leaving ? { duration: 0.75, ease: [0.65, 0, 0.35, 1] } : { type: "spring", bounce: 0, duration: 0.55 }}
      >
        {kind === "dial" ? <DialCoverArt /> : <ProfileCoverArt />}
        <span className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
      </motion.div>
    </motion.button>
  );
}

function CoverMasthead({ title, issue }: { title: string; issue: string }) {
  return (
    <div className="absolute top-0 inset-x-0 px-3 sm:px-4 pt-3 sm:pt-4 z-10">
      <p className="display uppercase text-[clamp(2rem,8vw,3.6rem)] leading-[0.85] tracking-[0.04em] text-white mix-blend-difference">{title}</p>
      <p className="mt-1.5 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-white/75">{issue}</p>
    </div>
  );
}

function CoverFooter({ line }: { line: string }) {
  return (
    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
      <p className="display italic text-[clamp(1rem,3.4vw,1.5rem)] leading-tight text-white">{line}</p>
    </div>
  );
}

/** The Dial cover: the instrument itself, lit by the theme gradient. */
function DialCoverArt() {
  const ticks = [];
  for (let d = 0; d < 360; d += 6) {
    const a = (d * Math.PI) / 180, major = d % 30 === 0;
    const r1 = 92, r2 = major ? 80 : 86;
    ticks.push(<line key={d} x1={(100 + r1 * Math.cos(a)).toFixed(2)} y1={(100 + r1 * Math.sin(a)).toFixed(2)} x2={(100 + r2 * Math.cos(a)).toFixed(2)} y2={(100 + r2 * Math.sin(a)).toFixed(2)} stroke="white" strokeOpacity={major ? 0.9 : 0.35} strokeWidth={major ? 1.4 : 0.7} />);
  }
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0d10]">
      <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "var(--accent-gradient)", filter: "blur(40px) saturate(1.2)", transform: "scale(1.2)" }} />
      <div className="absolute inset-0 bg-black/35" />
      <svg viewBox="0 0 200 200" className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[92%]">
        <circle cx="100" cy="100" r="95" fill="rgba(0,0,0,0.35)" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
        {ticks}
        <circle cx="100" cy="100" r="58" fill="none" stroke="white" strokeOpacity="0.18" strokeDasharray="1 4" />
        <line x1="100" y1="100" x2="160" y2="62" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="100" cy="100" r="3.5" fill="white" />
      </svg>
      <CoverMasthead title="The Dial" issue="Vol. 01 · Interactive" />
      <CoverFooter line="Six sections, one instrument." />
    </div>
  );
}

/** The Profile cover: a contact sheet of live systems. */
function ProfileCoverArt() {
  const shots = ["/work/tiehere.jpg", "/work/storefront.jpg", "/work/ashirulabs.jpg", "/work/algotrack.jpg", "/work/compiler.jpg", "/ev/evArch.png"];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0d10]">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-[3px] p-[3px]">
        {shots.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s} src={s} alt="" className="w-full h-full object-cover object-left-top" draggable={false} />
        ))}
      </div>
      {/* Solid band behind the masthead: the screenshots are busy, the title must read. */}
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#0d0d10] via-[#0d0d10]/90 to-transparent" />
      <CoverMasthead title="Profile" issue="Vol. 02 · The quick read" />
      <CoverFooter line="Every system, at a glance." />
    </div>
  );
}
