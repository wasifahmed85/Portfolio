import React from 'react';
import { animate, m, useInView, useReducedMotion } from 'framer-motion';
import { aboutBody, aboutStatement, highlights, skills } from '../content';
import { Eyebrow, ScrollWords } from '../experience/interactions';
import { Stagger, StaggerItem } from '../motion';

function Counter({ value, suffix = '', decimals = 0 }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!inView || reduce) {
      node.textContent = `${(reduce ? value : 0).toFixed(decimals)}${suffix}`;
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = `${latest.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, decimals]);

  return <span ref={ref}>{`${value.toFixed(decimals)}${suffix}`}</span>;
}

export default function About({ liveProjects = 0 }) {
  const stats = [
    { value: 1.8, decimals: 1, suffix: '+', label: 'years of production work' },
    liveProjects ? { value: liveProjects, suffix: '', label: 'live sites further down' } : null,
    { value: skills.length, suffix: '', label: 'areas I work across' },
  ].filter(Boolean);

  return (
    <section id="about" data-scene="about" className="section about">
      <div className="container about-grid">
        <div className="about-aside">
          <Eyebrow index="01">About</Eyebrow>
          <h2 className="section-title about-title">
            Modern technologies for scalable, secure digital solutions.
          </h2>
          <div className="about-stats">
            {stats.map((stat) => (
              <m.div
                key={stat.label}
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong className="stat-value">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </strong>
                <span className="stat-label">{stat.label}</span>
              </m.div>
            ))}
          </div>
        </div>

        <div className="about-main">
          <ScrollWords text={aboutStatement} className="about-statement" />
          <p className="about-body">{aboutBody}</p>

          <div className="about-highlights">
            <p className="micro-label">What I bring</p>
            <Stagger as="ol" className="highlight-list">
              {highlights.map((item, index) => (
                <StaggerItem key={item} as="li" className="highlight">
                  <span className="highlight-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="highlight-text">{item}</span>
                  <span className="highlight-rule" aria-hidden="true" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
