import React from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Layers3 } from 'lucide-react';
import { projectTagLabel, splitProjects } from '../data/projectsStore';
import { scrollToTarget, SectionHeading, Tilt } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 10;
const MAX_STACK = 5;

function ProjectMedia({ project, href, priority = false }) {
  return (
    // The observer sits on the unclipped link: a fully clipped element reports zero intersection.
    <m.a
      href={href}
      className="work-media"
      tabIndex={-1}
      aria-hidden="true"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
    >
      <m.span
        className="work-media-reveal"
        variants={{
          hidden: { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
          shown: { clipPath: 'inset(0% 0% 0% 0% round 18px)', transition: { duration: 1.2, ease } },
        }}
      >
        {project.image ? (
          <img src={project.image} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" />
        ) : (
          <span className="work-media-empty">
            <Layers3 size={32} />
          </span>
        )}
      </m.span>
    </m.a>
  );
}

function ShowcaseCard({ project, index, featured }) {
  const href = `/project/${project.id}`;
  const stack = project.stack || [];
  const extra = stack.length - MAX_STACK;

  return (
    <m.li
      className={`work-item ${featured ? 'is-featured' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease, delay: featured ? 0 : (index % 2) * 0.12 }}
    >
      <Tilt as="article" className="work-card" max={featured ? 5 : 8}>
        <ProjectMedia project={project} href={href} priority={featured} />
        <div className="work-body" data-depth="30">
          <div className="work-meta">
            <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.type}</span>
            <span className={`work-tag tag-${project.tag === 'team' ? 'team' : 'individual'}`}>{projectTagLabel(project.tag)}</span>
          </div>
          <h3 className="work-title">
            <a href={href}>{project.name}</a>
          </h3>
          <p className="work-desc">{project.description}</p>
          <ul className="work-stack" aria-label="Tech stack">
            {stack.slice(0, MAX_STACK).map((item) => (
              <li key={item}>{item}</li>
            ))}
            {extra > 0 ? <li className="is-more">+{extra}</li> : null}
          </ul>
          <div className="work-actions">
            <a href={href} className="btn btn-primary btn-sm">
              Case study
              <ArrowUpRight size={15} />
            </a>
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                Live site
                <ExternalLink size={14} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </Tilt>
    </m.li>
  );
}

function BuildCard({ project, index }) {
  const href = `/project/${project.id}`;
  return (
    <m.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
    >
      <Tilt as="article" className="build-card" max={10}>
        <div className="build-top" data-depth="40">
          <span className="build-icon">
            <Layers3 size={20} />
          </span>
          <span className="build-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="build-type">{project.type}</p>
        <h4 className="build-title">
          <a href={href}>{project.name}</a>
        </h4>
        <p className="build-desc">{project.description}</p>
        <ul className="work-stack">
          {(project.stack || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a href={href} className="text-link">
          View details
          <ArrowUpRight size={14} />
        </a>
      </Tilt>
    </m.li>
  );
}

function Pagination({ page, totalPages, onChange }) {
  return (
    <nav className="pager" aria-label="Projects pages">
      <button type="button" className="pager-btn" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          className={`pager-page ${number === page ? 'is-active' : ''}`}
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
        >
          {number}
        </button>
      ))}
      <button type="button" className="pager-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default function Projects({ projects }) {
  const { defaultProjects, uploadedProjects } = splitProjects(projects);
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(uploadedProjects.length / PAGE_SIZE));

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageItems = uploadedProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goToPage = (next) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    scrollToTarget('#projects');
  };

  return (
    <section id="projects" data-scene="projects" className="section projects">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Selected work"
          title="Built projects with clear features, demos, and case details."
          lead="Client sites and products I've built. Each one has a short write-up of what it does and how I approached it."
        />

        {pageItems.length ? (
          <ul className="work-grid" key={page}>
            {pageItems.map((project, index) => (
              <ShowcaseCard
                key={project.id || project.name}
                project={project}
                index={(page - 1) * PAGE_SIZE + index}
                featured={index === 0}
              />
            ))}
          </ul>
        ) : null}

        {totalPages > 1 ? <Pagination page={page} totalPages={totalPages} onChange={goToPage} /> : null}

        {defaultProjects.length ? (
          <div className="builds">
            <div className="builds-head">
              <p className="micro-label">Smaller builds</p>
              <p className="builds-copy">Focused projects covering inventory, payments, and responsive sites.</p>
            </div>
            <ul className="build-grid">
              {defaultProjects.map((project, index) => (
                <BuildCard key={project.id || project.name} project={project} index={index} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
