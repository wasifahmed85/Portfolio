import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Code2,
  Cpu,
  Database,
  Download,
  FileText,
  Github,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from 'lucide-react';
import Admin from './Admin';
import ProjectDetail from './ProjectDetail';
import { downloadCvFile, hasCvFile, loadCv } from './data/cvStore';
import { loadProjects, projectTagLabel, splitProjects } from './data/projectsStore';
import { FadeUp, HoverLift, MotionProvider, Reveal, Stagger, StaggerItem } from './motion';
import './styles.css';

const profile = {
  name: 'Wasif Ahmed',
  role: 'Laravel Developer',
  location: 'Dhaka, Bangladesh',
  phone: '+880 1314 118535',
  email: 'dev.wasifahmed@gmail.com',
  github: 'https://github.com/wasifahmed85',
  experience: '1.8+ Years',
};

const navItems = ['About', 'Skills', 'Experience', 'Workflow', 'Projects', 'CV', 'Education', 'Contact'];

const highlights = [
  'Laravel web application development',
  'REST API development and integration',
  'Payment gateway implementation',
  'Responsive frontend with React and Tailwind CSS',
];

const skills = [
  {
    title: 'Frontend',
    icon: Code2,
    items: ['HTML & CSS', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'React (Basic)', 'Responsive Design'],
  },
  {
    title: 'Backend',
    icon: Server,
    items: ['PHP', 'Laravel Framework', 'REST API Development', 'Payment Gateway Integration', 'Authentication', 'Authorization'],
  },
  {
    title: 'Database',
    icon: Database,
    items: ['MySQL', 'ORM / Eloquent', 'Query Optimization'],
  },
  {
    title: 'Leadership',
    icon: ShieldCheck,
    items: ['Team Management', 'Task Delegation', 'Code Review'],
  },
];

const tools = ['Git', 'VS Code', 'Windows OS', 'Cross-browser Compatibility', 'Performance Optimization'];

const terminalCommands = [
  'php artisan make:portfolio Wasif',
  'Route::apiResource("projects", ProjectController::class)',
  'npm run build && deploy --portfolio',
  'return response()->json($cleanWork);',
];

const workflowSteps = [
  {
    title: 'Request',
    label: 'User action hits a clean route',
    code: "GET /portfolio/projects",
  },
  {
    title: 'Controller',
    label: 'Business logic stays organized',
    code: 'ProjectController@index',
  },
  {
    title: 'Model',
    label: 'Eloquent handles data clearly',
    code: 'Project::latest()->get()',
  },
  {
    title: 'Response',
    label: 'Fast API response reaches UI',
    code: 'JSON 200 OK',
  },
];

const experiences = [
  {
    company: 'Eoneral Developer',
    title: 'Laravel Developer',
    date: 'Feb 2025 - Present',
    points: [
      'Developing and maintaining scalable Laravel web applications.',
      'Building and integrating RESTful APIs for frontend and third-party services.',
      'Implementing payment gateway integrations for production workflows.',
      'Designing and optimizing MySQL databases with Eloquent ORM.',
      'Coordinating team tasks, reviewing code, and maintaining quality standards.',
    ],
  },
  {
    company: 'Unplug Tech Design Intern',
    title: 'Responsive Web Design Intern',
    date: 'Jun 2024 - Aug 2024',
    points: [
      'Designed responsive interfaces using mobile-first design principles.',
      'Collaborated with developers on clean layout systems and UI consistency.',
      'Improved hands-on experience with JavaScript interactivity and layout polish.',
    ],
  },
];

const education = [
  {
    school: 'World University of Bangladesh',
    detail: 'BSc in Computer Science & Engineering',
    meta: 'Currently Running | Dhaka, Bangladesh',
  },
  {
    school: 'Kurigram Polytechnic Institute',
    detail: 'Diploma in Computer Science',
    meta: 'Kurigram, Bangladesh',
  },
  {
    school: 'Keshabpur High School',
    detail: 'Department of Science',
    meta: 'GPA 4.87/5.00 | Rangpur, Bangladesh',
  },
];

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
    return <Admin />;
  }

  const projectMatch = pathname.match(/^\/project\/([^/]+)\/?$/);
  if (projectMatch) {
    return <ProjectPage projectId={decodeURIComponent(projectMatch[1])} />;
  }

  return <Portfolio />;
}

function ProjectPage({ projectId }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="site-shell min-h-screen text-ink">
      <AnimatedBackground />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="relative z-10">
        <ProjectDetail projectId={projectId} />
      </main>
      <Footer />
    </div>
  );
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = React.useState(false);
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

  return (
    <div className="site-shell min-h-screen text-ink">
      <AnimatedBackground />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="relative z-10">
        <Hero cv={cv} />
        <About />
        <Skills />
        <Experience />
        <WorkflowLab />
        <Projects projects={projects} />
        <CvSection cv={cv} />
        <Education />
        <Contact cv={cv} />
      </main>
      <Footer />
    </div>
  );
}

function AnimatedBackground() {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const syncPause = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      root.classList.toggle('is-paused', document.hidden || reduce);
    };

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    syncPause();
    document.addEventListener('visibilitychange', syncPause);
    media.addEventListener('change', syncPause);
    return () => {
      document.removeEventListener('visibilitychange', syncPause);
      media.removeEventListener('change', syncPause);
    };
  }, []);

  return (
    <div className="motion-bg" aria-hidden="true" ref={rootRef}>
      <span className="motion-orb one" />
      <span className="motion-orb two" />
      <span className="motion-orb three" />
      <img
        src="/animated-bg.svg"
        alt=""
        decoding="async"
        fetchPriority="low"
        width="1200"
        height="800"
      />
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const next = window.scrollY > 18;
        setScrolled((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setMenuOpen]);

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`site-header sticky top-0 z-40 border-b border-white/70 bg-white/95 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <a href="#home" className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-sm font-bold text-white sm:h-11 sm:w-11 sm:text-base">WA</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-5">Wasif Ahmed</span>
            <span className="block truncate text-xs text-slate-500">Laravel Developer</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </nav>

        <a href={`mailto:${profile.email}`} className="hire-button hidden items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand lg:flex">
          <Mail size={16} />
          Hire Me
        </a>

        <button className="icon-button shrink-0 lg:hidden" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu border-t border-line bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-mist" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="hire-button mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white" onClick={() => setMenuOpen(false)}>
              <Mail size={16} />
              Hire Me
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero({ cv }) {
  const [commandIndex, setCommandIndex] = React.useState(0);
  const readyCv = hasCvFile(cv);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setCommandIndex((value) => (value + 1) % terminalCommands.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-grid animated-grid hero-modern border-b border-line">
      <div className="mx-auto grid min-h-0 max-w-6xl items-start gap-6 px-4 py-8 sm:gap-8 sm:px-5 sm:py-12 lg:min-h-[calc(100vh-76px)] lg:items-center lg:grid-cols-[1.06fr_0.94fr] lg:gap-10 lg:py-16">
        <Stagger className="hero-copy min-w-0" delay={0.05} immediate>
          <StaggerItem className="hero-badge mb-4 inline-flex max-w-full items-center gap-2 rounded border border-line bg-mist px-3 py-2 text-xs font-semibold text-brand sm:mb-5 sm:text-sm">
            <Sparkles size={16} className="shrink-0" />
            <span className="min-w-0 leading-snug">{profile.experience} building Laravel web applications</span>
          </StaggerItem>
          <StaggerItem as="h1" className="headline max-w-3xl text-3xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            <span className="name-gradient">{profile.name}</span>
          </StaggerItem>
          <StaggerItem as="p" className="hero-subtitle mt-3 max-w-2xl text-lg font-semibold text-brand sm:mt-4 sm:text-2xl">{profile.role}</StaggerItem>
          <StaggerItem as="p" className="hero-text mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            Hands-on Laravel developer focused on scalable backend systems, clean REST APIs, payment gateway integrations, and responsive interfaces with React and Tailwind CSS.
          </StaggerItem>

          <StaggerItem className="button-row mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row">
            <a href="#projects" className="primary-button w-full justify-center sm:w-auto">
              View Work
              <ArrowUpRight size={18} />
            </a>
            {readyCv ? (
              <button type="button" className="secondary-button w-full justify-center sm:w-auto" onClick={() => downloadCvFile(cv)}>
                <Download size={18} />
                Download CV
              </button>
            ) : (
              <a href={profile.github} target="_blank" rel="noreferrer" className="secondary-button w-full justify-center sm:w-auto">
                <Github size={18} />
                GitHub Profile
              </a>
            )}
          </StaggerItem>

          <StaggerItem className="mini-terminal mt-5 w-full sm:mt-6">
            <Terminal size={16} />
            <span>{terminalCommands[commandIndex]}</span>
          </StaggerItem>

          <StaggerItem className="mt-6 grid gap-3 text-sm text-slate-600 sm:mt-8 sm:grid-cols-3">
            <InfoPill icon={MapPin} label={profile.location} />
            <InfoPill icon={Phone} label={profile.phone} />
            <InfoPill icon={Mail} label={profile.email} />
          </StaggerItem>
        </Stagger>

        <FadeUp className="hero-visual hero-stage relative min-w-0" delay={0.2}>
          <div className="profile-panel">
            <div>
              <span className="profile-avatar">WA</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white">{profile.name}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-100">Laravel Developer - API Builder</p>
              <div className="mt-4 grid gap-2">
                <span className="progress-line"><span style={{ width: '88%' }}></span></span>
                <span className="progress-line muted"><span style={{ width: '72%' }}></span></span>
              </div>
            </div>
          </div>

          <div className="tech-ribbon" aria-hidden="true">
            <span>Laravel</span>
            <span>React</span>
            <span>Tailwind</span>
            <span>MySQL</span>
          </div>

          <div className="code-window code-float shadow-soft">
            <div className="flex items-center gap-2 border-b border-slate-800/70 px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-coral"></span>
              <span className="h-3 w-3 rounded-full bg-gold"></span>
              <span className="h-3 w-3 rounded-full bg-brand"></span>
            </div>
            <div className="space-y-3 overflow-x-auto p-4 font-mono text-xs leading-6 text-slate-200 sm:space-y-4 sm:p-5 sm:text-sm sm:leading-7">
              <p className="whitespace-nowrap sm:whitespace-normal"><span className="text-coral">Route</span>::get(<span className="text-emerald-300">'/portfolio'</span>, <span className="text-sky-300">WasifController</span>::class);</p>
              <p><span className="text-slate-500">// Core strengths</span></p>
              <p className="whitespace-nowrap sm:whitespace-normal"><span className="text-gold">$skills</span> = [<span className="text-emerald-300">'Laravel'</span>, <span className="text-emerald-300">'REST API'</span>, <span className="text-emerald-300">'MySQL'</span>];</p>
              <p className="whitespace-nowrap sm:whitespace-normal"><span className="text-sky-300">return</span> response()-&gt;json(<span className="text-gold">$cleanCode</span>);<span className="typing-cursor"></span></p>
            </div>
          </div>

          <div className="hero-metrics mt-5 grid grid-cols-2 gap-4">
            <Metric value="1.8+" label="Years Experience" />
            <Metric value="API" label="Integration Focus" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function About() {
  return (
    <Reveal as="section" id="about" className="section section-band">
      <div className="section-heading">
        <p>About</p>
        <h2>Reliable Laravel development for real business workflows.</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel feature-panel">
          <BriefcaseBusiness className="text-brand" size={30} />
          <h3>What I bring</h3>
          <p>
            I build practical web applications with organized backend logic, responsive UI, and careful database handling. My work experience includes Laravel, payment systems, team coordination, and production-minded feature delivery.
          </p>
        </div>
        <Stagger className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <StaggerItem key={item} className="check-row">
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Reveal>
  );
}

function Skills() {
  return (
    <Reveal as="section" id="skills" className="section">
      <div className="section-heading">
        <p>Skills</p>
        <h2>Backend depth with frontend awareness.</h2>
      </div>
      <StackOrbit />
      <Stagger className="grid gap-5 md:grid-cols-2">
        {skills.map(({ title, icon: Icon, items }) => (
          <StaggerItem key={title} as="article" className="panel">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded bg-brand/10 text-brand">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span key={item} className="skill-chip">{item}</span>
              ))}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-5 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span key={tool} className="tool-chip">{tool}</span>
        ))}
      </div>
    </Reveal>
  );
}

function StackOrbit() {
  return (
    <div className="stack-orbit mb-6">
      <div className="orbit-core">
        <Cpu size={24} />
        <span>Laravel Core</span>
      </div>
      <span className="orbit-item orbit-one">REST API</span>
      <span className="orbit-item orbit-two">MySQL</span>
      <span className="orbit-item orbit-three">React</span>
      <span className="orbit-item orbit-four">Tailwind</span>
    </div>
  );
}

function Experience() {
  return (
    <Reveal as="section" id="experience" className="section section-band">
      <div className="section-heading">
        <p>Experience</p>
        <h2>Hands-on work across backend delivery and responsive UI.</h2>
      </div>
      <Stagger className="space-y-5">
        {experiences.map((job) => (
          <StaggerItem key={job.company} as="article" className="timeline-item">
            <div className="flex flex-col gap-2 border-b border-line pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3>{job.title}</h3>
                <p className="font-semibold text-brand">{job.company}</p>
              </div>
              <span className="rounded bg-mist px-3 py-1 text-sm font-semibold text-slate-600">{job.date}</span>
            </div>
            <ul className="mt-5 grid gap-3">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 shrink-0 text-brand" size={16} />
                  {point}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}

function WorkflowLab() {
  const [activeStep, setActiveStep] = React.useState(0);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (!entry.isIntersecting) return;
        timer = window.setInterval(() => {
          setActiveStep((value) => (value + 1) % workflowSteps.length);
        }, 2800);
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Reveal as="section" id="workflow" className="section">
      <div ref={sectionRef}>
        <div className="section-heading">
          <p>Workflow</p>
          <h2>A Laravel request, visualized like a small product system.</h2>
        </div>
        <div className="workflow-lab">
          <div className="workflow-map">
            {workflowSteps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`workflow-node ${activeStep === index ? 'active' : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <span className="node-index">0{index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.label}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="workflow-console">
            <div className="console-top">
              <Workflow size={18} />
              <span>request-flow.php</span>
            </div>
            <pre>
              <code>{`// ${workflowSteps[activeStep].title}
${workflowSteps[activeStep].code}

$portfolio->ship(
  cleanCode: true,
  responsiveUI: true,
  apiReady: true
);`}</code>
            </pre>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Projects({ projects }) {
  const { defaultProjects, uploadedProjects } = splitProjects(projects);

  return (
    <>
      <Reveal as="section" id="projects" className="section">
        <div className="section-heading">
          <p>Projects</p>
          <h2>Portfolio-ready examples shaped from your CV strengths.</h2>
        </div>
        <Stagger className="grid gap-5 lg:grid-cols-3">
          {defaultProjects.map((project) => (
            <StaggerItem key={project.id || project.name}>
              <HoverLift className="h-full">
                <ClassicProjectCard project={project} />
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      {uploadedProjects.length ? <UploadedProjectsSection projects={uploadedProjects} /> : null}
    </>
  );
}

const UPLOADED_PAGE_SIZE = 10;

function UploadedProjectsSection({ projects }) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(projects.length / UPLOADED_PAGE_SIZE));
  const showPagination = projects.length > UPLOADED_PAGE_SIZE;

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageItems = projects.slice((page - 1) * UPLOADED_PAGE_SIZE, page * UPLOADED_PAGE_SIZE);

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    setPage(safePage);
    const section = document.getElementById('uploaded-projects');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Reveal as="section" id="uploaded-projects" className="section section-band">
      <div className="section-heading">
        <p>Selected work</p>
        <h2>Built projects with clear features, demos, and case details.</h2>
      </div>
      <Stagger className="grid gap-5 lg:grid-cols-3" key={page}>
        {pageItems.map((project) => (
          <StaggerItem key={project.id || project.name}>
            <HoverLift className="h-full">
              <ClassicProjectCard project={project} showTag />
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
      {showPagination ? (
        <div className="projects-pagination">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={`pagination-page ${page === pageNumber ? 'active' : ''}`}
                  onClick={() => goToPage(pageNumber)}
                  aria-current={page === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </Reveal>
  );
}

function ClassicProjectCard({ project, showTag = false }) {
  const detailHref = `/project/${project.id}`;

  return (
    <article className={`project-card ${showTag ? 'project-card-with-preview' : ''}`}>
      {showTag ? (
        <a href={detailHref} className="project-card-preview">
          {project.image ? (
            <img src={project.image} alt="" loading="lazy" />
          ) : (
            <span className="project-card-preview-empty">
              <Layers3 size={28} />
              <span>No image</span>
            </span>
          )}
        </a>
      ) : (
        <div className="project-card-top">
          <Layers3 className="text-coral" size={26} />
        </div>
      )}
      <p className="mt-4 text-sm font-bold uppercase text-brand">{project.type}</p>
      <h3>
        <a href={detailHref} className="project-title-link">
          {project.name}
        </a>
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(project.stack || []).map((item) => (
          <span key={item} className="stack-chip">{item}</span>
        ))}
      </div>
      <div className="project-card-footer">
        <a href={detailHref} className="project-link inline-flex">
          View details
          <ArrowUpRight size={14} />
        </a>
        {showTag ? (
          <span className={`project-tag tag-${project.tag === 'team' ? 'team' : 'individual'}`}>
            {projectTagLabel(project.tag)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function Education() {
  return (
    <Reveal as="section" id="education" className="section section-band">
      <div className="section-heading">
        <p>Education</p>
        <h2>Academic foundation in computer science.</h2>
      </div>
      <Stagger className="grid gap-4">
        {education.map((item) => (
          <StaggerItem key={item.school} as="article" className="education-row">
            <GraduationCap className="text-brand" size={24} />
            <div>
              <h3>{item.school}</h3>
              <p className="text-sm font-semibold text-slate-700">{item.detail}</p>
              <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}

function CvSection({ cv }) {
  if (!hasCvFile(cv)) return null;

  return (
    <Reveal as="section" id="cv" className="section">
      <div className="cv-panel">
        <div className="cv-panel-copy">
          <span className="cv-panel-icon">
            <FileText size={24} />
          </span>
          <div>
            <p>Curriculum Vitae</p>
            <h2>{cv.label || 'Wasif Ahmed CV'}</h2>
            <p className="cv-meta">
              {cv.fileName}
              {cv.updatedAt ? ` · Updated ${new Date(cv.updatedAt).toLocaleDateString()}` : ''}
            </p>
          </div>
        </div>
        <button type="button" className="primary-button" onClick={() => downloadCvFile(cv)}>
          <Download size={18} />
          Download CV
        </button>
      </div>
    </Reveal>
  );
}

function Contact({ cv }) {
  const [copied, setCopied] = React.useState(false);
  const readyCv = hasCvFile(cv);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Reveal as="section" id="contact" className="section pb-16">
      <div className="contact-band">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-100">Contact</p>
          <h2>Need a Laravel developer for your web application?</h2>
          <p>Available for Laravel development, API integration, backend fixes, and responsive frontend work.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col">
          <a href={`mailto:${profile.email}`} className="light-button w-full justify-center lg:min-w-[160px]">
            <Mail size={18} />
            Email Me
          </a>
          {readyCv ? (
            <button type="button" className="outline-light-button w-full justify-center lg:min-w-[160px]" onClick={() => downloadCvFile(cv)}>
              <Download size={18} />
              Download CV
            </button>
          ) : null}
          <button type="button" className="outline-light-button w-full justify-center lg:min-w-[160px]" onClick={copyEmail}>
            <ClipboardCopy size={18} />
            {copied ? 'Copied' : 'Copy Email'}
          </button>
          <a href={profile.github} target="_blank" rel="noreferrer" className="outline-light-button w-full justify-center lg:min-w-[160px]">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-white px-5 py-6 text-center text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row sm:text-left">
        <p>Copyright {new Date().getFullYear()} Wasif Ahmed. Built with React, Tailwind CSS, and Laravel-minded care.</p>
        <a href="/admin" className="font-semibold text-brand hover:underline">
          Admin
        </a>
      </div>
    </footer>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric-card rounded border border-line bg-white p-5">
      <p className="text-3xl font-black text-brand">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}

function InfoPill({ icon: Icon, label }) {
  return (
    <span className="flex min-w-0 items-center gap-2 rounded border border-line bg-white px-3 py-2">
      <Icon className="shrink-0 text-brand" size={16} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export default App;

createRoot(document.getElementById('root')).render(
  <MotionProvider>
    <App />
  </MotionProvider>,
);
