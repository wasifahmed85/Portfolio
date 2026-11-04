import React from 'react';
import { createRoot } from 'react-dom/client';
import ProjectDetail from './ProjectDetail';
import { hasCvFile, loadCv } from './data/cvStore';
import { loadProjects } from './data/projectsStore';
import WorldCanvas from './experience/WorldCanvas';
import { MotionProvider } from './motion';
import About from './sections/About';
import { Contact, CvSection, Education, Footer } from './sections/Closing';
import Experience from './sections/Experience';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Skills from './sections/Skills';
import Workflow from './sections/Workflow';
import './styles.css';

const Admin = React.lazy(() => import('./Admin'));

function usePathname() {
  const [pathname, setPathname] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return pathname;
}

function App() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <React.Suspense fallback={null}>
        <Admin />
      </React.Suspense>
    );
  }

  const projectMatch = pathname.match(/^\/project\/([^/]+)\/?$/);
  if (projectMatch) {
    return <ProjectPage projectId={decodeURIComponent(projectMatch[1])} />;
  }

  return <Portfolio />;
}

function usePortfolioData() {
  const [projects, setProjects] = React.useState([]);
  const [cv, setCv] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const [projectData, cvData] = await Promise.all([
        loadProjects({ preferLocal: true }),
        loadCv({ preferLocal: true }),
      ]);
      if (alive) {
        setProjects(projectData);
        setCv(cvData);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { projects, cv };
}

/** Shared chrome for every public page: 3D world, nav and footer. */
function ExperienceShell({ children, onHome, hasCv }) {
  return (
    <div className="xp-shell">
      <WorldCanvas />
      <Header onHome={onHome} hasCv={hasCv} />
      <main id="main" className="xp-main" tabIndex={-1}>
        {children}
      </main>
      <Footer onHome={onHome} hasCv={hasCv} />
    </div>
  );
}

function ProjectPage({ projectId }) {
  return (
    <ExperienceShell onHome={false}>
      <ProjectDetail projectId={projectId} />
    </ExperienceShell>
  );
}

function Portfolio() {
  const { projects, cv } = usePortfolioData();
  const hasCv = hasCvFile(cv);
  const liveProjects = projects.filter((project) => project.liveUrl).length;

  // Arriving from another page with a hash (e.g. /#projects): jump once content exists.
  React.useEffect(() => {
    const { hash } = window.location;
    if (!hash || !projects.length) return;
    const target = document.querySelector(hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }, [projects.length]);

  return (
    <ExperienceShell onHome hasCv={hasCv}>
      <Intro />
      <Hero cv={cv} />
      <About liveProjects={liveProjects} />
      <Services />
      <Skills />
      <Experience />
      <Workflow />
      <Projects projects={projects} />
      <CvSection cv={cv} />
      <Education hasCv={hasCv} />
      <Contact cv={cv} />
    </ExperienceShell>
  );
}

export default App;

createRoot(document.getElementById('root')).render(
  <MotionProvider>
    <App />
  </MotionProvider>,
);
