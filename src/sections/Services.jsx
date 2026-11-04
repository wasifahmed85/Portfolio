import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { services } from '../content';

const ease = [0.22, 1, 0.36, 1];

/** Numbered service rows: hover lights a row, click opens its detail. */
export default function Services() {
  const [open, setOpen] = React.useState(null);

  return (
    <section id="services" data-scene="skills" className="section services">
      <div className="container">
        <m.h2
          className="services-title metal-text"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease }}
        >
          What I
          <br />
          can do
        </m.h2>
      </div>

      <ol className="services-list">
        {services.map((service, index) => {
          const isOpen = open === index;
          const panelId = `service-panel-${index}`;
          return (
            <m.li
              key={service.title}
              className={`service-row ${isOpen ? 'is-open' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease, delay: index * 0.06 }}
            >
              <button
                type="button"
                className="service-head"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="container service-head-inner">
                  <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="service-name">{service.title}</span>
                  <ArrowDownRight className="service-arrow" size={18} aria-hidden="true" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <m.div
                    id={panelId}
                    className="service-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <div className="container service-panel-inner">
                      <p>{service.body}</p>
                      <ul aria-label="Tools">
                        {service.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </m.li>
          );
        })}
      </ol>
    </section>
  );
}
