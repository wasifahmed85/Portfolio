import React from 'react';
import { m } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { loadProjectById, loadProjects, isShowcaseProject, projectTagLabel } from './data/projectsStore';
import { Magnetic, SplitWords, Tilt } from './experience/interactions';
import { FadeUp, Reveal, Stagger, StaggerItem } from './motion';

const ease = [0.22, 1, 0.36, 1];

export default function ProjectDetail({ projectId }) {
  const [project, setProject] = React.useState(null);
  const [related, setRelated] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    (async () => {
      setLoading(true);
      const [found, all] = await Promise.all([loadProjectById(projectId), loadProjects({ preferLocal: true })]);
      if (!alive) return;
      setProject(found);
      setRelated(all.filter((item) => item.id !== projectId).slice(0, 3));
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [projectId]);

  React.useEffect(() => {
    if (project?.name) document.title = `${project.name} | Wasif Ahmed`;
  }, [project]);

  if (loading) {
    return (
      <div className="container detail" data-scene="detail">
        <div className="detail-loading">
          <span className="loader" aria-hidden="true" />
          Loading project details…
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container detail" data-scene="detail">
        <div className="detail-empty">
          <h1>Project not found</h1>
          <p>This project may have been removed or the link is incorrect.</p>
          <a href="/#projects" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to projects
          </a>
        </div>
      </div>
    );
  }

  const features = project.features || [];
  const showcase = isShowcaseProject(project);

  return (
    <div className="container detail" data-scene="detail">
      <FadeUp>
        <a href="/#projects" className="detail-back">
          <ArrowLeft size={16} />
          All projects
        </a>
      </FadeUp>

      <section className={`detail-hero ${project.image ? 'has-media' : ''}`}>
        <div className="detail-copy">
          <m.p className="detail-type" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            {project.type}
          </m.p>
          <h1 className="detail-title">
            <SplitWords text={project.name} immediate delay={0.1} stagger={0.05} />
          </h1>
          <FadeUp delay={0.35}>
            <p className="detail-summary">{project.description}</p>

            <div className="detail-meta">
              <span className={`work-tag tag-${project.tag === 'team' ? 'team' : 'individual'}`}>{projectTagLabel(project.tag)}</span>
              {project.role ? (
                <span>
                  <UserRound size={15} />
                  {project.role}
                </span>
              ) : null}
              {showcase ? (
                <span>
                  <Sparkles size={15} />
                  Featured upload
                </span>
              ) : null}
            </div>

            <ul className="work-stack detail-stack" aria-label="Tech stack">
              {(project.stack || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="detail-actions">
              {project.liveUrl ? (
                <Magnetic>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
                    <ExternalLink size={16} />
                    Live demo
                  </a>
                </Magnetic>
              ) : null}
              {project.githubUrl ? (
                <Magnetic>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">
                    <Github size={16} />
                    Source code
                  </a>
                </Magnetic>
              ) : null}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="detail-visual">
          <Tilt className="detail-frame" max={6}>
            {project.image ? (
              <m.img
                src={project.image}
                alt={`${project.name} screenshot`}
                decoding="async"
                initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                transition={{ duration: 1.3, ease, delay: 0.25 }}
              />
            ) : (
              <span className="detail-frame-empty">
                <Layers3 size={40} />
              </span>
            )}
          </Tilt>
        </FadeUp>
      </section>

      <Reveal as="section" className="detail-grid" delay={0.08}>
        <article className="detail-panel">
          <p className="micro-label">Overview</p>
          <p className="detail-lead">{project.overview || project.description}</p>
          {project.challenges ? (
            <>
              <p className="micro-label">Approach</p>
              <p>{project.challenges}</p>
            </>
          ) : null}
        </article>

        <article className="detail-panel">
          <p className="micro-label">Key features</p>
          {features.length ? (
            <ul className="detail-features">
              {features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Feature list will appear here once added from the admin panel.</p>
          )}
        </article>
      </Reveal>

      {related.length ? (
        <Reveal as="section" className="detail-related" delay={0.04}>
          <p className="micro-label">More work</p>
          <h2 className="section-title">Other projects</h2>
          <Stagger className="related-grid">
            {related.map((item) => (
              <StaggerItem key={item.id} as="a" href={`/project/${item.id}`} className="related-card">
                {item.image ? <img src={item.image} alt="" loading="lazy" decoding="async" /> : <span className="related-empty" />}
                <span className="related-body">
                  <strong>{item.name}</strong>
                  <span>{item.type}</span>
                  <em>
                    View details
                    <ArrowUpRight size={14} />
                  </em>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      ) : null}
    </div>
  );
}
