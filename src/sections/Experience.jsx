import React from 'react';
import { m, useScroll, useSpring } from 'framer-motion';
import { experiences } from '../content';
import { SectionHeading } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];

export default function Experience() {
  const timelineRef = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.7', 'end 0.6'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section id="experience" data-scene="experience" className="section experience">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          title="Production experience across backend, frontend, and DevOps."
        />

        <div className="timeline" ref={timelineRef}>
          <div className="timeline-rail" aria-hidden="true">
            <m.span className="timeline-fill" style={{ scaleY: progress }} />
          </div>

          {experiences.map((job, jobIndex) => (
            <m.article
              key={job.company}
              className="timeline-entry"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease }}
            >
              <span className={`timeline-node ${job.current ? 'is-current' : ''}`} aria-hidden="true" />
              <div className="timeline-meta">
                <span className="timeline-date">{job.date}</span>
                {job.current ? <span className="badge-live">Current</span> : null}
              </div>
              <div className="timeline-card">
                <header className="timeline-head">
                  <span className="timeline-number" aria-hidden="true">
                    {String(jobIndex + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{job.title}</h3>
                    <p className="timeline-company">{job.company}</p>
                  </div>
                </header>
                <ul className="timeline-points">
                  {job.points.map((point, index) => (
                    <m.li
                      key={point}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.6, ease, delay: index * 0.05 }}
                    >
                      {point}
                    </m.li>
                  ))}
                </ul>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
