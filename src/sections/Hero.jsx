import React from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Github, Mail, MapPin, Phone, Terminal } from 'lucide-react';
import { heroIntro, heroTags, profile, terminalCommands } from '../content';
import { downloadCvFile, hasCvFile } from '../data/cvStore';
import { Magnetic, SplitWords } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease, delay },
});

/** Positions (in vh around the sculpture's centre) for the floating stack labels. */
const TAG_ORBIT = [
  [-38, -22, 0.9],
  [24, -32, 1.4],
  [34, 6, 0.7],
  [-42, 14, 1.2],
  [6, 33, 1],
  [-14, -38, 0.6],
];

function TypedCommand() {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [length, setLength] = React.useState(reduce ? terminalCommands[0].length : 0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const full = terminalCommands[index];
    if (reduce) {
      setLength(full.length);
      const timer = window.setTimeout(() => setIndex((value) => (value + 1) % terminalCommands.length), 4000);
      return () => window.clearTimeout(timer);
    }
    let delay = deleting ? 18 : 38 + Math.random() * 40;
    if (!deleting && length === full.length) delay = 2200;
    if (deleting && length === 0) delay = 320;

    const timer = window.setTimeout(() => {
      if (!deleting && length === full.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((value) => (value + 1) % terminalCommands.length);
      } else setLength((value) => value + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [index, length, deleting, reduce]);

  return (
    <div className="hero-terminal">
      <span className="hero-terminal-icon">
        <Terminal size={14} />
      </span>
      <span className="hero-terminal-prompt">~/wasif $</span>
      <code>
        {terminalCommands[index].slice(0, length)}
        <span className="caret" aria-hidden="true" />
      </code>
    </div>
  );
}

/** Live clock for the studio city — a small, real detail rather than another stat. */
function LocalTime() {
  const format = React.useCallback(
    () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' }).format(new Date()),
    [],
  );
  const [time, setTime] = React.useState(format);
  React.useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 20000);
    return () => window.clearInterval(timer);
  }, [format]);
  return <strong className="local-time">{time}</strong>;
}

/** Loose, pen-like underline drawn once under the surname. */
function Scribble() {
  return (
    <svg className="hero-scribble" viewBox="0 0 220 26" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <m.path
        d="M3 17c28-6 61-11 98-11 31 0 62 3 86 7 9 1.6 18 3.6 29 6M41 21c34-4 77-5 118-2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.9 }}
      />
    </svg>
  );
}

export default function Hero({ cv }) {
  const ref = React.useRef(null);
  const reduce = useReducedMotion();
  const readyCv = hasCvFile(cv);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -220]);

  return (
    <section id="home" data-scene="home" ref={ref} className="hero">
      <m.div className="hero-stage" style={{ y: stageY }} aria-hidden="true">
        {heroTags.map((tag, index) => {
          const [ax, ay, depth] = TAG_ORBIT[index % TAG_ORBIT.length];
          return (
            <m.span
              key={tag}
              className="hero-tag"
              style={{ '--ax': ax, '--ay': ay, '--depth': depth }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease, delay: 1 + index * 0.12 }}
            >
              <span className="hero-tag-dot" />
              {tag}
            </m.span>
          );
        })}
      </m.div>

      <div className="container hero-inner">
        <m.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <m.p className="hero-kicker" {...rise(0.1)}>
            <span className="pulse-dot" aria-hidden="true" />
            Based in {profile.location.split(',')[0]} · {profile.experience} building scalable digital solutions
          </m.p>

          <h1 className="hero-title">
            <SplitWords text={profile.firstName} immediate delay={0.2} className="hero-title-line" />
            <span className="hero-title-line hero-title-accent">
              <SplitWords text={profile.lastName} immediate delay={0.32} />
              <Scribble />
            </span>
          </h1>

          <m.p className="hero-role" {...rise(0.6)}>
            {profile.role}
          </m.p>

          <m.p className="hero-intro" {...rise(0.72)}>
            {heroIntro}
          </m.p>

          <m.div className="hero-actions" {...rise(0.86)}>
            <Magnetic>
              <a href="#projects" className="btn btn-primary btn-lg">
                View Work
                <ArrowUpRight size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              {readyCv ? (
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => downloadCvFile(cv)}>
                  <Download size={18} />
                  Download CV
                </button>
              ) : (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">
                  <Github size={18} />
                  GitHub Profile
                </a>
              )}
            </Magnetic>
          </m.div>

          <m.div {...rise(1)}>
            <TypedCommand />
          </m.div>
        </m.div>
      </div>

      <m.div className="container hero-foot" {...rise(1.15)}>
        <ul className="hero-contact" aria-label="Contact details">
          <li>
            <MapPin size={15} />
            <span>{profile.location}</span>
          </li>
          <li>
            <Phone size={15} />
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
          </li>
          <li>
            <Mail size={15} />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
        </ul>
        <div className="hero-metrics">
          <div>
            <strong>1.8+</strong>
            <span>Years Experience</span>
          </div>
          <div>
            <strong>Full-Stack</strong>
            <span>Laravel + React</span>
          </div>
          <div>
            <LocalTime />
            <span>Local time, {profile.location.split(',')[0]}</span>
          </div>
        </div>
        <a href="#about" className="scroll-cue" aria-label="Scroll to About">
          <span className="scroll-cue-track">
            <span className="scroll-cue-thumb" />
          </span>
          <ArrowDown size={14} />
        </a>
      </m.div>
    </section>
  );
}
