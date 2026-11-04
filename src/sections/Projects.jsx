import React from 'react';
import { animate, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Layers3 } from 'lucide-react';
import { projectTagLabel, splitProjects } from '../data/projectsStore';
import { SectionHeading } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];
const MAX_STACK = 4;

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** How far the track overflows its viewport, kept current on resize and image load. */
function useOverflow(trackRef, viewportRef, deps) {
  const [distance, setDistance] = React.useState(0);
  React.useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return undefined;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return distance;
}

function SlideCard({ project, index }) {
  const href = `/project/${project.id}`;
  const stack = project.stack || [];
  const extra = stack.length - MAX_STACK;

  return (
    <li className="slide">
      <article className="slide-card">
        <a href={href} className="slide-media" tabIndex={-1} aria-hidden="true" draggable="false">
          {project.image ? (
            <img src={project.image} alt="" decoding="async" draggable="false" />
          ) : (
            <span className="slide-media-empty">
              <Layers3 size={30} />
            </span>
          )}
        </a>
        <div className="slide-body">
          <div className="slide-meta">
            <span className="slide-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.type}</span>
            {project.tag ? <span className="slide-tag">{projectTagLabel(project.tag)}</span> : null}
          </div>
          <h3 className="slide-title">
            <a href={href} draggable="false">{project.name}</a>
          </h3>
          <p className="slide-desc">{project.description}</p>
          {stack.length ? (
            <ul className="slide-stack" aria-label="Tech stack">
              {stack.slice(0, MAX_STACK).map((item) => (
                <li key={item}>{item}</li>
              ))}
              {extra > 0 ? <li>+{extra}</li> : null}
            </ul>
          ) : null}
          <div className="slide-actions">
            <a href={href} className="btn btn-primary btn-sm" draggable="false">
              Case study
              <ArrowUpRight size={15} />
            </a>
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" draggable="false">
                Live
                <ExternalLink size={14} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}

function SliderFoot({ progress, current, total, hint, onStep }) {
  return (
    <div className="slider-foot">
      <span className="slider-hint">{hint}</span>
      <span className="slider-bar" aria-hidden="true">
        <m.span className="slider-bar-fill" style={{ scaleX: progress }} />
      </span>
      <span className="slider-count">
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <span className="slider-nav">
        <button type="button" className="slider-btn" onClick={() => onStep(-1)} disabled={current <= 1} aria-label="Previous project">
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="slider-btn" onClick={() => onStep(1)} disabled={current >= total} aria-label="Next project">
          <ChevronRight size={18} />
        </button>
      </span>
    </div>
  );
}

/**
 * Projects as one horizontal reel. On wide screens the section pins and vertical scroll
 * drives the track sideways; on touch / narrow screens it is a native swipe strip.
 */
export default function Projects({ projects }) {
  const { defaultProjects, uploadedProjects } = splitProjects(projects);
  const items = [...uploadedProjects, ...defaultProjects];
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 900px) and (min-height: 560px)');
  const pinned = wide && !reduce;

  const sectionRef = React.useRef(null);
  const viewportRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const distance = useOverflow(trackRef, viewportRef, [items.length, pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // Hold the first card in place as the section pins (and the last as it releases) before sliding.
  const TRAVEL = [0.08, 0.94];
  const pinnedX = useTransform(scrollYProgress, TRAVEL, [0, -distance]);
  const x = useSpring(pinnedX, { stiffness: 140, damping: 28, mass: 0.4 });
  const [swipeProgress, setSwipeProgress] = React.useState(0);
  const [current, setCurrent] = React.useState(1);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!pinned) return;
    const travelled = Math.min(1, Math.max(0, (value - TRAVEL[0]) / (TRAVEL[1] - TRAVEL[0])));
    viewportRef.current?.classList.toggle('is-moved', travelled > 0.01);
    const size = cardStep();
    setCurrent(travelled > 0.995 || !size ? Math.max(1, Math.round(travelled * items.length)) : Math.min(items.length, Math.round((travelled * distance) / size) + 1));
  });

  const onSwipe = (event) => {
    const el = event.currentTarget;
    const max = Math.max(1, el.scrollWidth - el.clientWidth);
    const value = el.scrollLeft / max;
    setSwipeProgress(value);
    // At the far end the last card may never reach the snap line, so count it as reached.
    setCurrent(value > 0.995 ? items.length : nearestCard(snapLefts()) + 1);
  };

  // One card's width plus the gap: the same distance sideways or, when pinned, down the page.
  const cardStep = () => {
    const first = trackRef.current?.children[0];
    if (!first) return 0;
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(trackRef.current).columnGap || 0);
  };

  // Native smooth scrolling fights mandatory snap, so glide scrollLeft ourselves with snap paused.
  const glideTo = (left) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const target = Math.max(0, Math.min(max, left));
    viewport.classList.add('is-gliding');
    animate(viewport.scrollLeft, target, {
      duration: reduce ? 0 : 0.6,
      ease,
      onUpdate: (value) => {
        viewport.scrollLeft = value;
      },
      onComplete: () => viewport.classList.remove('is-gliding'),
    });
  };

  // scrollLeft at which card i sits on the snap line.
  const snapLefts = () => {
    const viewport = viewportRef.current;
    const pad = parseFloat(getComputedStyle(viewport).scrollPaddingLeft) || 0;
    const origin = viewport.getBoundingClientRect().left - viewport.scrollLeft + pad;
    return Array.from(trackRef.current.children, (card) => card.getBoundingClientRect().left - origin);
  };
  const nearestCard = (lefts) => {
    const at = viewportRef.current.scrollLeft;
    return lefts.reduce((best, left, index) => (Math.abs(left - at) < Math.abs(lefts[best] - at) ? index : best), 0);
  };

  const step = (direction) => {
    if (pinned) {
      window.scrollBy({ top: cardStep() * direction, behavior: 'smooth' });
      return;
    }
    const lefts = snapLefts();
    const index = Math.max(0, Math.min(lefts.length - 1, nearestCard(lefts) + direction));
    glideTo(lefts[index]);
  };

  // Mouse users on a narrow window can't swipe, so let them drag the strip.
  const drag = React.useRef(null);
  const onPointerDown = (event) => {
    if (pinned || event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { x: event.clientX, left: viewportRef.current.scrollLeft, moved: false, id: event.pointerId };
  };
  const onPointerMove = (event) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > 4) {
      state.moved = true;
      viewportRef.current.classList.add('is-dragging');
      viewportRef.current.setPointerCapture(state.id);
    }
    if (state.moved) viewportRef.current.scrollLeft = state.left - dx;
  };
  const endDrag = () => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    const viewport = viewportRef.current;
    viewport.classList.remove('is-dragging');
    // Settle on the nearest card, then swallow the click that ends the drag.
    const lefts = snapLefts();
    glideTo(lefts[nearestCard(lefts)]);
    viewport.addEventListener('click', (e) => e.preventDefault(), { capture: true, once: true });
  };

  const intro = (
    <div className="slider-intro">
      <SectionHeading
        index="05"
        eyebrow="Selected work"
        title="Projects that ship and keep running."
        lead="Client sites and products I've built. Open any card for the write-up of what it does and how I approached it."
      />
    </div>
  );

  return (
    <section
      id="projects"
      data-scene="projects"
      ref={sectionRef}
      className={`section projects slider ${pinned ? 'is-pinned' : 'is-swipe'}`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="slider-sticky">
        <div className="container slider-frame">
          {intro}
          <m.div
            className="slider-viewport"
            ref={viewportRef}
            onScroll={pinned ? undefined : onSwipe}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
            tabIndex={pinned ? undefined : 0}
            aria-label="Projects"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease }}
          >
            <m.ul
              className="slider-track"
              ref={trackRef}
              style={pinned ? { x } : undefined}
            >
              {items.map((project, index) => (
                <SlideCard key={project.id || project.name} project={project} index={index} />
              ))}
            </m.ul>
          </m.div>
          {items.length ? (
            <SliderFoot
              progress={pinned ? scrollYProgress : swipeProgress}
              current={current}
              total={items.length}
              hint={pinned ? 'Scroll to view' : 'Swipe or drag'}
              onStep={step}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
