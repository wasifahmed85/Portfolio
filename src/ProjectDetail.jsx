import React from 'react';
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

  if (loading) {
    return (
      <div className="detail-shell">
        <div className="detail-loading">Loading project details…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="detail-shell">
        <div className="detail-empty">
          <h1>Project not found</h1>
          <p>This project may have been removed or the link is incorrect.</p>
          <a href="/#projects" className="primary-button">
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
    <div className="detail-shell">
      <div className="detail-top">
        <a href="/#projects" className="detail-back">
          <ArrowLeft size={16} />
          All projects
        </a>
      </div>

      <section className={`detail-hero ${showcase ? 'is-showcase' : 'is-classic'}`}>
        {project.image ? (
          <div className="detail-hero-media">
            <img src={project.image} alt={project.name} />
          </div>
        ) : (
          <div className="detail-hero-fallback">
            <Layers3 size={36} />
          </div>
        )}

        <div className="detail-hero-copy">
          <p className="detail-type">{project.type}</p>
          <h1>{project.name}</h1>
          <p className="detail-summary">{project.description}</p>

          <div className="detail-meta">
            <span className={`project-tag tag-${project.tag === 'team' ? 'team' : 'individual'}`}>
              {projectTagLabel(project.tag)}
            </span>
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

          <div className="detail-stack">
            {(project.stack || []).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="detail-actions">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="primary-button">
                <ExternalLink size={16} />
                Live demo
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="secondary-button">
                <Github size={16} />
                Source code
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h2>Overview</h2>
          <p>{project.overview || project.description}</p>
          {project.challenges ? (
            <>
              <h3>Approach</h3>
              <p>{project.challenges}</p>
            </>
          ) : null}
        </article>

        <article className="detail-panel">
          <h2>Key features</h2>
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
      </section>

      {related.length ? (
        <section className="detail-related">
          <div className="section-heading">
            <p>More work</p>
            <h2>Other projects</h2>
          </div>
          <div className="detail-related-grid">
            {related.map((item) => (
              <a key={item.id} href={`/project/${item.id}`} className="detail-related-card">
                <strong>{item.name}</strong>
                <span>{item.type}</span>
                <em>
                  View details
                  <ArrowUpRight size={14} />
                </em>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
