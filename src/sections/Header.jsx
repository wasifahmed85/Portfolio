import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { navItems, profile } from '../content';
import { setScrollLocked, useActiveSection } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];

export default function Header({ onHome = true, hasCv = false }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const items = React.useMemo(() => navItems.filter((item) => item !== 'CV' || hasCv), [hasCv]);
  const ids = React.useMemo(() => ['home', ...items.map((item) => item.toLowerCase())], [items]);
  const active = useActiveSection(onHome ? ids : []);

  const hrefFor = (id) => (onHome ? `#${id}` : `/#${id}`);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 24;
        setScrolled((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setScrollLocked(open);
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-bar">
          <a href={hrefFor('home')} className="brand" onClick={() => setOpen(false)} aria-label={`${profile.name}, home`}>
            <span className="brand-name">{profile.name}</span>
            <span className="brand-meta">
              {profile.shortRole}, {profile.location.split(',')[0]}
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {items.map((item) => {
              const id = item.toLowerCase();
              return (
                <a key={item} data-id={id} href={hrefFor(id)} className={`nav-link ${active === id && onHome ? 'is-active' : ''}`} aria-current={active === id && onHome ? 'location' : undefined}>
                  {item}
                </a>
              );
            })}
          </nav>

          <a href={`mailto:${profile.email}`} className="nav-hire">
            Hire me
            <ArrowUpRight size={15} />
          </a>

          <button
            className="nav-toggle"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="nav-toggle-label">{open ? 'Close' : 'Menu'}</span>
            <span className={`nav-toggle-lines ${open ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            transition={{ duration: 0.35, ease }}
          >
            <nav className="mobile-menu-links" aria-label="Mobile">
              {items.map((item, index) => (
                <m.a
                  key={item}
                  href={hrefFor(item.toLowerCase())}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.06 + index * 0.045 } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                >
                  <span className="mobile-index">0{index + 1}</span>
                  {item}
                </m.a>
              ))}
            </nav>
            <m.div
              className="mobile-menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.45 } }}
              exit={{ opacity: 0 }}
            >
              <a href={`mailto:${profile.email}`} className="btn btn-primary w-full" onClick={() => setOpen(false)}>
                Hire Me
                <ArrowUpRight size={16} />
              </a>
              <p>{profile.email}</p>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
