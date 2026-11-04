import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { profile } from '../content';
import MorphText from '../experience/MorphText';

const ease = [0.22, 1, 0.36, 1];

/** Whether the intro will play on this page load (same rule the intro itself uses). */
export function introPending() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Fired when the curtain lifts, so the hero can start its own entrance. */
export const INTRO_DONE = 'xp:intro-done';

/**
 * Loading screen, on every visit: a falling dot and a stroke meet, the first name rolls
 * letter by letter into a big brushed-metal "PORTFOLIO", it holds, then the curtain lifts
 * on the site and the hero rolls the word back into the name. Click to skip; skipped
 * entirely for reduced motion.
 */
export default function Intro() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = React.useState(() => !reduce);
  const [phase, setPhase] = React.useState('mark');

  React.useEffect(() => {
    if (!visible) return undefined;
    document.documentElement.classList.add('intro-active');
    // A fresh arrival starts at the top, not wherever the browser wants to restore to.
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const timers = [
      window.setTimeout(() => setPhase('name'), 1050),
      window.setTimeout(() => setVisible(false), 3600),
    ];
    return () => {
      timers.forEach(window.clearTimeout);
      document.documentElement.classList.remove('intro-active');
    };
  }, [visible]);

  React.useEffect(() => {
    if (visible) return;
    document.documentElement.classList.remove('intro-active');
    window.dispatchEvent(new Event(INTRO_DONE));
  }, [visible]);

  // Portalled to <body> so it sits above the header, outside main's stacking context.
  return createPortal(
    <AnimatePresence>
      {visible ? (
        <m.div
          className="intro"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease } }}
          style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          onClick={() => setVisible(false)}
        >
          <div className="intro-glow" />
          {phase === 'mark' ? (
            <div className="intro-mark">
              <m.span
                className="intro-stroke"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.55, ease, delay: 0.15 }}
              />
              <m.span
                className="intro-dot"
                initial={{ y: '-40vh', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.5, 0, 0.75, 0], delay: 0.2 }}
              />
            </div>
          ) : (
            <m.p
              className="intro-name"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              <MorphText from={profile.firstName.toUpperCase()} to="PORTFOLIO" delay={0.25} charClassName="metal-text" />
            </m.p>
          )}
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
