import React from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Github, Mail, MapPin, Phone, Terminal } from 'lucide-react';
import { heroIntro, heroTags, profile, terminalCommands } from '../content';
import { downloadCvFile, hasCvFile } from '../data/cvStore';
import { Magnetic } from '../experience/interactions';
import MorphText from '../experience/MorphText';
import { INTRO_DONE, introPending } from './Intro';

const ease = [0.22, 1, 0.36, 1];

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease, delay },
});

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

/**
 * Whether the opening curtain has lifted (straight away when it isn't playing), and
 * how long to wait for it to clear the screen before the name starts rolling.
 */
function useIntroFinished() {
  const [hadIntro] = React.useState(introPending);
  const [done, setDone] = React.useState(!hadIntro);
  React.useEffect(() => {
    if (done) return undefined;
    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE, onDone);
    return () => window.removeEventListener(INTRO_DONE, onDone);
  }, [done]);
  return { introDone: done, rollDelay: hadIntro ? 0.75 : 0.15 };
}

export default function Hero({ cv }) {
  const ref = React.useRef(null);
  const reduce = useReducedMotion();
  const readyCv = hasCvFile(cv);
  const { introDone, rollDelay } = useIntroFinished();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);
  const sideY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section id="home" data-scene="home" ref={ref} className="hero hero-studio">
      <div className="container hero-inner hero-split">
        <m.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <m.p className="hero-kicker" {...rise(0.1)}>
            <span className="pulse-dot" aria-hidden="true" />
            Based in {profile.location.split(',')[0]} · {profile.experience} building scalable digital solutions
          </m.p>

          <h1 className="hero-mark" aria-label={profile.name}>
            {/* Same roll as the intro: "PORTFOLIO" turns into the name, letter by letter. */}
            <MorphText
              className="hero-mark-line"
              charClassName="metal-text"
              from="PORTF"
              to={profile.firstName.toUpperCase()}
              play={introDone}
              delay={rollDelay}
              replayOnHover
            />
            <MorphText
              className="hero-mark-line"
              charClassName="metal-text"
              from="OLIO"
              to={profile.lastName.toUpperCase()}
              play={introDone}
              delay={rollDelay + 0.25}
              replayOnHover
            />
          </h1>

          <m.p className="hero-role" {...rise(0.6)}>
            <strong>{profile.role.replace(/ Developer$/, '')}</strong> <em>Developer</em>
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
        </m.div>

        {/* The 3D sculpture fills this column from the fixed canvas behind; these cards float over it. */}
        <m.aside className="hero-side" style={{ y: sideY, opacity: copyOpacity }} aria-label="Current stack">
          <m.div className="hero-card hero-card-stack" {...rise(1)}>
            <p className="hero-card-label">Daily stack</p>
            <ul>
              {heroTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </m.div>
          <m.div className="hero-card hero-card-status" {...rise(1.1)}>
            <span className="pulse-dot" aria-hidden="true" />
            <div>
              <strong>Open to new projects</strong>
              <span>Laravel · React · DevOps</span>
            </div>
          </m.div>
          <m.div className="hero-card-terminal" {...rise(1.2)}>
            <TypedCommand />
          </m.div>
        </m.aside>
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
