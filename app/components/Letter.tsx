"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROFILE } from "../data/profile";
import { Typewriter } from "./ui/Typewriter";

/**
 * A short letter between the title card and the room. It types itself in
 * real time (the view follows the caret), then the signature writes itself
 * and the button turns from "Skip" into the way in. Skip completes the text
 * instantly; pressing it again enters.
 * Copy is the user's own About text plus a factual summary of the work.
 */
export function Letter({ destination, onDone }: { destination: "dial" | "profile"; onDone: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(false);
  const [instant, setInstant] = useState(false);

  const paragraphs = [
    PROFILE.about[0],
    "What follows is the work so far: TieHere, a product I build and run with real people using it; systems built for clients, from offline-first field apps to AI analysts that answer only from the data; and research into password security and medical imaging.",
    PROFILE.about[1],
  ];

  // Keep the newest line in view while typing.
  const follow = useCallback(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const onButton = () => {
    if (typed) onDone();
    else setInstant(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-[#262626] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={scroller} className="h-full overflow-y-auto overscroll-contain">
        <div className="max-w-xl mx-auto px-6 pt-[16vh] pb-[30vh] space-y-10">
          <Typewriter
            paragraphs={paragraphs}
            instant={instant}
            onProgress={follow}
            onDone={() => { setTyped(true); window.setTimeout(follow, 50); }}
            className="space-y-8"
            paragraphClassName="text-[19px] sm:text-[22px] leading-[1.55] text-white/95"
          />
          {typed && (
            <div className="pt-4">
              <motion.p
                className="display italic text-[44px] sm:text-[56px] leading-none"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                onAnimationStart={follow}
              >
                {PROFILE.name}
              </motion.p>
              <motion.p
                className="mt-3 text-sm text-white/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {PROFILE.title}, {PROFILE.location.split(",")[0]}
              </motion.p>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 inset-x-0 flex justify-center">
        <motion.button
          layout
          type="button"
          onClick={onButton}
          data-cursor={typed ? "Enter" : "Skip"}
          className="pointer-events-auto h-10 px-5 rounded-md text-[13px] font-medium bg-white/12 hover:bg-white/20 text-white backdrop-blur-md ring-1 ring-white/15 transition-colors"
        >
          <motion.span key={typed ? "go" : "skip"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {typed ? (destination === "dial" ? "Enter the dial" : "Open the profile") : "Skip"}
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
