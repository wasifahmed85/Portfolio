import React from 'react';
import { m, useReducedMotion } from 'framer-motion';

const ease = [0.65, 0, 0.35, 1];
const GLYPHS = 'ABCDEFGHIJKLMNOPRSTUVWXYZ';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const show = (char) => (char === ' ' ? ' ' : char);

/** One column per letter: the old letter, a couple of random ones, then the new letter. */
function buildStrips(from, to, extra) {
  const source = from.padEnd(to.length, ' ');
  return to.split('').map((char, index) => {
    if (char === ' ') return [source[index], ' '];
    return [source[index], ...Array.from({ length: extra }, randomGlyph), char];
  });
}

/**
 * Slot-machine word morph: every letter rolls upward through a few glyphs and locks,
 * left to right, so one word visibly turns into another (e.g. PORTFOLIO → WASIF AHMED).
 * Each slot also eases from the old letter's width to the new one's, so both words
 * keep natural spacing. Hovering rolls the word again.
 */
export default function MorphText({
  from = '',
  to,
  play = true,
  delay = 0,
  stagger = 0.055,
  duration = 0.85,
  extra = 2,
  replayOnHover = false,
  className = '',
  charClassName = '',
}) {
  const reduce = useReducedMotion();
  const [round, setRound] = React.useState(0);
  const source = round === 0 ? from : to;
  const strips = React.useMemo(() => buildStrips(source, to, extra), [source, to, extra]);
  const rootRef = React.useRef(null);
  const [widths, setWidths] = React.useState(null);
  // Widths start at the old letters for one frame, then transition to the new ones.
  const [armed, setArmed] = React.useState(false);
  const rolling = React.useRef(false);

  // Measure each slot's start and end letter widths in the real font.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const pairs = Array.from(root.querySelectorAll('.morph-slot'), (slot) => {
        const [a, b] = slot.querySelectorAll('.morph-measure');
        return { from: a.getBoundingClientRect().width, to: b.getBoundingClientRect().width };
      });
      setWidths(pairs);
      requestAnimationFrame(() => requestAnimationFrame(() => alive && setArmed(true)));
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
    };
  }, [source, to]);

  const css = (value) => `cubic-bezier(${value.join(',')})`;

  const replay = () => {
    if (!replayOnHover || reduce || rolling.current || !play) return;
    rolling.current = true;
    setRound((value) => value + 1);
  };

  return (
    <span ref={rootRef} className={`morph ${className}`} onPointerEnter={replay}>
      <span className="sr-only">{to}</span>
      {strips.map((strip, index) => {
        const steps = strip.length - 1;
        const end = `${(-steps / strip.length) * 100}%`;
        const last = index === strips.length - 1;
        const done = play || reduce;
        const timing = {
          duration: reduce ? 0 : duration + steps * 0.08,
          ease,
          delay: round ? index * 0.03 : delay + index * stagger,
        };
        const size = widths?.[index];
        const widthStyle = size
          ? {
              width: (done && armed) || reduce ? size.to : size.from,
              transition: reduce ? 'none' : `width ${timing.duration}s ${css(ease)} ${timing.delay}s`,
            }
          : undefined;
        return (
          <span key={`${round}-${index}`} className="morph-slot" aria-hidden="true" style={widthStyle}>
            <span className={`morph-measure ${charClassName}`}>{show(source.padEnd(to.length, ' ')[index])}</span>
            <span className={`morph-measure ${charClassName}`}>{show(to[index])}</span>
            {size ? null : <span className={`morph-ghost ${charClassName}`}>{show(to[index])}</span>}
            <m.span
              className="morph-strip"
              style={{ x: '-50%' }}
              initial={{ y: reduce ? end : '0%' }}
              animate={{ y: done ? end : '0%' }}
              transition={timing}
              onAnimationComplete={last ? () => (rolling.current = false) : undefined}
            >
              {strip.map((char, step) => (
                <span key={step} className={`morph-char ${charClassName}`}>
                  {show(char)}
                </span>
              ))}
            </m.span>
          </span>
        );
      })}
    </span>
  );
}
