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
  useRevealAnimation(projects);

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
  return (
    <div className="motion-bg" aria-hidden="true">
      <img src="/animated-bg.svg" alt="" />
    </div>
  );
}

function useRevealAnimation(deps) {
  React.useEffect(() => {
    const targets = document.querySelectorAll('.reveal, .stagger-list > *');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -70px 0px' },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [deps]);
}

function Header({ menuOpen, setMenuOpen }) {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="brand-mark grid h-11 w-11 place-items-center rounded bg-brand text-base font-bold text-white">WA</span>
          <span>
            <span className="block text-sm font-bold leading-5">Wasif Ahmed</span>
            <span className="block text-xs text-slate-500">Laravel Developer</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </nav>

        <a href={`mailto:${profile.email}`} className="hire-button hidden items-center gap-2 rounded bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand lg:flex">
          <Mail size={16} />
          Hire Me
        </a>

        <button className="icon-button lg:hidden" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-2">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="rounded px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-mist" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
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
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-grid animated-grid hero-modern border-b border-line">
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.06fr_0.94fr] lg:py-16">
        <div className="hero-copy">
          <div className="hero-badge mb-5 inline-flex items-center gap-2 rounded border border-line bg-mist px-3 py-2 text-sm font-semibold text-brand">
            <Sparkles size={16} />
            {profile.experience} building Laravel web applications
          </div>
          <h1 className="headline max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            <span className="name-gradient">{profile.name}</span>
          </h1>
          <p className="hero-subtitle mt-4 max-w-2xl text-xl font-semibold text-brand sm:text-2xl">{profile.role}</p>
          <p className="hero-text mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Hands-on Laravel developer focused on scalable backend systems, clean REST APIs, payment gateway integrations, and responsive interfaces with React and Tailwind CSS.
          </p>

          <div className="button-row mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="primary-button">
              View Work
              <ArrowUpRight size={18} />
            </a>
            {readyCv ? (
              <button type="button" className="secondary-button" onClick={() => downloadCvFile(cv)}>
                <Download size={18} />
                Download CV
              </button>
            ) : (
              <a href={profile.github} target="_blank" rel="noreferrer" className="secondary-button">
                <Github size={18} />
                GitHub Profile
              </a>
            )}
          </div>

          <div className="mini-terminal mt-6">
            <Terminal size={16} />
            <span>{terminalCommands[commandIndex]}</span>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <InfoPill icon={MapPin} label={profile.location} />
            <InfoPill icon={Phone} label={profile.phone} />
            <InfoPill icon={Mail} label={profile.email} />
          </div>
        </div>

        <div className="hero-visual hero-stage relative">
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
            <div className="space-y-4 p-5 font-mono text-sm leading-7 text-slate-200">
              <p><span className="text-coral">Route</span>::get(<span className="text-emerald-300">'/portfolio'</span>, <span className="text-sky-300">WasifController</span>::class);</p>
              <p><span className="text-slate-500">// Core strengths</span></p>
              <p><span className="text-gold">$skills</span> = [<span className="text-emerald-300">'Laravel'</span>, <span className="text-emerald-300">'REST API'</span>, <span className="text-emerald-300">'MySQL'</span>];</p>
              <p><span className="text-sky-300">return</span> response()-&gt;json(<span className="text-gold">$cleanCode</span>);<span className="typing-cursor"></span></p>
            </div>
          </div>

          <div className="hero-metrics mt-5 grid grid-cols-2 gap-4">
            <Metric value="1.8+" label="Years Experience" />
            <Metric value="API" label="Integration Focus" />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section-band reveal">
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
        <div className="stagger-list grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item} className="check-row">
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section reveal">
      <div className="section-heading">
        <p>Skills</p>
        <h2>Backend depth with frontend awareness.</h2>
      </div>
      <StackOrbit />
      <div className="stagger-list grid gap-5 md:grid-cols-2">
        {skills.map(({ title, icon: Icon, items }) => (
          <article key={title} className="panel">
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
          </article>
        ))}
      </div>
      <div className="stagger-list mt-5 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span key={tool} className="tool-chip">{tool}</span>
        ))}
      </div>
    </section>
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
    <section id="experience" className="section section-band reveal">
      <div className="section-heading">
        <p>Experience</p>
        <h2>Hands-on work across backend delivery and responsive UI.</h2>
      </div>
      <div className="stagger-list space-y-5">
        {experiences.map((job) => (
          <article key={job.company} className="timeline-item">
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
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkflowLab() {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((value) => (value + 1) % workflowSteps.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="workflow" className="section reveal">
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
    </section>
  );
}

function Projects({ projects }) {
  const { defaultProjects, uploadedProjects } = splitProjects(projects);

  return (
    <>
      <section id="projects" className="section reveal">
        <div className="section-heading">
          <p>Projects</p>
          <h2>Portfolio-ready examples shaped from your CV strengths.</h2>
        </div>
        <div className="stagger-list grid gap-5 lg:grid-cols-3">
          {defaultProjects.map((project) => (
            <ClassicProjectCard key={project.id || project.name} project={project} />
          ))}
        </div>
      </section>

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
    <section id="uploaded-projects" className="section section-band reveal">
      <div className="section-heading">
        <p>Selected work</p>
        <h2>Built projects with clear features, demos, and case details.</h2>
      </div>
      <div className="stagger-list grid gap-5 lg:grid-cols-3">
        {pageItems.map((project) => (
          <ClassicProjectCard key={project.id || project.name} project={project} showTag />
        ))}
      </div>
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
    </section>
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
          <span className={`project-tag preview-tag tag-${project.tag === 'team' ? 'team' : 'individual'}`}>
            {projectTagLabel(project.tag)}
          </span>
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
      <a href={detailHref} className="project-link mt-5 inline-flex">
        View details
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}

function Education() {
  return (
    <section id="education" className="section section-band reveal">
      <div className="section-heading">
        <p>Education</p>
        <h2>Academic foundation in computer science.</h2>
      </div>
      <div className="stagger-list grid gap-4">
        {education.map((item) => (
          <article key={item.school} className="education-row">
            <GraduationCap className="text-brand" size={24} />
            <div>
              <h3>{item.school}</h3>
              <p className="text-sm font-semibold text-slate-700">{item.detail}</p>
              <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CvSection({ cv }) {
  if (!hasCvFile(cv)) return null;

  return (
    <section id="cv" className="section reveal">
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
    </section>
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
    <section id="contact" className="section reveal pb-16">
      <div className="contact-band">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-100">Contact</p>
          <h2>Need a Laravel developer for your web application?</h2>
          <p>Available for Laravel development, API integration, backend fixes, and responsive frontend work.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a href={`mailto:${profile.email}`} className="light-button">
            <Mail size={18} />
            Email Me
          </a>
          {readyCv ? (
            <button type="button" className="outline-light-button" onClick={() => downloadCvFile(cv)}>
              <Download size={18} />
              Download CV
            </button>
          ) : null}
          <button type="button" className="outline-light-button" onClick={copyEmail}>
            <ClipboardCopy size={18} />
            {copied ? 'Copied' : 'Copy Email'}
          </button>
          <a href={profile.github} target="_blank" rel="noreferrer" className="outline-light-button">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </section>
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

createRoot(document.getElementById('root')).render(<App />);
