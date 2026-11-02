import React from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Pause, Play, Workflow as WorkflowIcon } from 'lucide-react';
import { workflowSteps } from '../content';
import { SectionHeading } from '../experience/interactions';

const STEP_MS = 3200;

export default function Workflow() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [inView, setInView] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const reduce = useReducedMotion();
  const sectionRef = React.useRef(null);
  const playing = inView && !paused && !reduce;

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(() => setActiveStep((value) => (value + 1) % workflowSteps.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, activeStep]);

  const step = workflowSteps[activeStep];

  return (
    <section id="workflow" data-scene="workflow" className="section workflow" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Workflow"
          title="Event-driven Laravel architecture, from request to response."
        />

        <div className="pipeline" style={{ '--steps': workflowSteps.length, '--active': activeStep }}>
          <div className="pipeline-track" aria-hidden="true">
            <span className="pipeline-progress" />
            <span className="pipeline-pulse" />
          </div>
          {workflowSteps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`pipeline-node ${activeStep === index ? 'is-active' : ''} ${index < activeStep ? 'is-done' : ''}`}
              onClick={() => setActiveStep(index)}
              aria-pressed={activeStep === index}
            >
              <span className="pipeline-dot" aria-hidden="true" />
              <span className="pipeline-index">0{index + 1}</span>
              <strong>{item.title}</strong>
              <small>{item.label}</small>
              {activeStep === index && playing ? <span className="pipeline-timer" style={{ animationDuration: `${STEP_MS}ms` }} /> : null}
            </button>
          ))}
        </div>

        <div className="console">
          <div className="console-bar">
            <span className="console-lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="console-file">
              <WorkflowIcon size={14} />
              request-flow.php
            </span>
            <button type="button" className="console-toggle" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play workflow' : 'Pause workflow'}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.pre
              key={step.title}
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.15 } }}
              transition={{ duration: 0.45 }}
            >
              <code>
                <span className="tok-comment">{`// ${step.title} — ${step.label}`}</span>
                {'\n'}
                <span className="tok-active">{step.code}</span>
                {'\n\n'}
                <span className="tok-var">$portfolio</span>
                {'->'}
                <span className="tok-fn">ship</span>
                {'(\n  '}
                <span className="tok-key">cleanCode</span>: <span className="tok-bool">true</span>
                {',\n  '}
                <span className="tok-key">responsiveUI</span>: <span className="tok-bool">true</span>
                {',\n  '}
                <span className="tok-key">apiReady</span>: <span className="tok-bool">true</span>
                {'\n);'}
              </code>
            </m.pre>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
