import React from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/** Native smooth scroll to an element or y position (CSS scroll-padding handles the nav offset). */
export function scrollToTarget(target) {
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function setScrollLocked(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

/** Tracks which section is in the middle band of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = React.useState(ids[0]);
  const key = ids.join('|');

  React.useEffect(() => {
    const nodes = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** Kept as a plain wrapper so call sites stay unchanged; the pointer-follow effect was removed for smoothness. */
export function Magnetic({ children, className = '' }) {
  return <span className={`magnetic ${className}`}>{children}</span>;
}

/** Card wrapper with a CSS-only hover lift (no pointer-driven 3D tilt). */
export function Tilt({ children, className = '', max, as: Tag = 'div', ...props }) {
  return (
    <Tag className={`tilt ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/** Masked word-by-word rise, for headlines. */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.06, immediate = false }) {
  const reduce = useReducedMotion();
  const words = String(text).split(' ');
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.3 } };

  return (
    <m.span className={`split ${className}`} initial={reduce ? false : 'hidden'} {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="split-mask" aria-hidden="true">
            <m.span
              className="split-word"
              variants={{
                hidden: { y: '110%', rotate: 4 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.95, ease, delay: delay + index * stagger } },
              }}
            >
              {word}
            </m.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </m.span>
  );
}

function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <m.span className="scroll-word" style={{ opacity }}>
      {children}{' '}
    </m.span>
  );
}

/** Words light up as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className = '' }) {
  const ref = React.useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = String(text).split(' ');

  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <ScrollWord key={`${word}-${index}`} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}

/** Section eyebrow with index, e.g. "01 — About". */
export function Eyebrow({ index, children }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-index">{index}</span>
      <span className="eyebrow-line" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Standard section header: eyebrow + split headline + optional lead. */
export function SectionHeading({ index, eyebrow, title, lead, align = 'left' }) {
  return (
    <header className={`section-head align-${align}`}>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 className="section-title">
        <SplitWords text={title} />
      </h2>
      {lead ? (
        <m.p
          className="section-lead"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          {lead}
        </m.p>
      ) : null}
    </header>
  );
}
