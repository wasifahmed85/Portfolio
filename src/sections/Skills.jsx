import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { skills, toolSections } from '../content';
import { SectionHeading, Tilt } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];

/** Deterministic depth per chip so the layout is stable between renders. */
const depthFor = (index) => [28, 64, 12, 48, 80, 20, 56, 36, 70][index % 9];

function Marquee({ items, reverse = false }) {
  const loop = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? 'is-reverse' : ''}`}>
      <div className="marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item" aria-hidden={index >= items.length}>
            {item}
            <span className="marquee-sep" aria-hidden="true">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef([]);
  const current = skills[active];
  const Icon = current.icon;

  const onKeyDown = (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (event.key in keys) next = (active + keys[event.key] + skills.length) % skills.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = skills.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="skills" data-scene="skills" className="section skills">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Skills"
          title="Technical expertise across the full development stack."
          lead="What I use day to day, grouped by where it sits in the stack."
        />

        <div className="skills-grid">
          <div className="skill-tabs" role="tablist" aria-label="Skill categories" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {skills.map(({ title, icon: TabIcon, items }, index) => (
              <button
                key={title}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`skill-tab-${index}`}
                aria-selected={active === index}
                aria-controls="skill-panel"
                tabIndex={active === index ? 0 : -1}
                className={`skill-tab ${active === index ? 'is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span className="skill-tab-icon">
                  <TabIcon size={18} />
                </span>
                <span className="skill-tab-title">{title}</span>
                <span className="skill-tab-count">{String(items.length).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <Tilt className="skill-stage" max={6} id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${active}`}>
            <div className="skill-stage-glow" aria-hidden="true" />
            <div className="skill-stage-grid" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current.title}
                className="skill-stage-inner"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease }}
              >
                <div className="skill-stage-head" data-depth="40">
                  <span className="skill-stage-icon">
                    <Icon size={28} />
                  </span>
                  <div>
                    <p className="micro-label">
                      {String(active + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}
                    </p>
                    <h3>{current.title}</h3>
                  </div>
                </div>
                <ul className="skill-chips">
                  {current.items.map((item, index) => (
                    <m.li
                      key={item}
                      className="skill-chip"
                      style={{ '--z': `${depthFor(index)}px` }}
                      initial={{ opacity: 0, scale: 0.85, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.55, ease, delay: 0.08 + index * 0.045 }}
                    >
                      {item}
                    </m.li>
                  ))}
                </ul>
              </m.div>
            </AnimatePresence>
          </Tilt>
        </div>

        <div className="tool-rows">
          {toolSections.map(({ label, items }, index) => (
            <div key={label} className="tool-row">
              <p className="micro-label">{label}</p>
              <Marquee items={items} reverse={index % 2 === 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
