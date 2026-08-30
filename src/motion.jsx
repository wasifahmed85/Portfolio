import React from 'react';
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from 'framer-motion';

/** Lightweight Framer — transform/opacity only, smooth easing */
export function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={smoothOut}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

/** Soft expo-out — smoother than spring bounce for scroll reveals */
const smoothOut = {
  type: 'tween',
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1],
};

const hoverSpring = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.65,
};

const viewportOnce = {
  once: true,
  amount: 0.14,
  margin: '0px 0px -5% 0px',
};

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  as = 'div',
  ...props
}) {
  const reduce = useReducedMotion();
  const Tag = m[as] || m.div;

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...smoothOut, delay }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Stagger({ children, className = '', delay = 0, immediate = false, ...props }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: viewportOnce })}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: delay,
          },
        },
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className = '', as = 'div', ...props }) {
  const reduce = useReducedMotion();
  const Tag = m[as] || m.div;

  return (
    <Tag
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: smoothOut,
        },
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function FadeUp({ children, className = '', delay = 0, as = 'div', ...props }) {
  const reduce = useReducedMotion();
  const Tag = m[as] || m.div;

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...smoothOut, delay }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function HoverLift({ children, className = '', ...props }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={hoverSpring}
      {...props}
    >
      {children}
    </m.div>
  );
}

export { m, smoothOut, hoverSpring };
