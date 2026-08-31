import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Cloud,
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
  Search,
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
  role: 'Laravel & Full-Stack Developer',
  location: 'Dhaka, Bangladesh',
  phone: '+880 1314 118535',
  email: 'dev.wasifahmed@gmail.com',
  github: 'https://github.com/wasifahmed85',
  experience: '1.8+ Years',
};

const navItems = ['About', 'Skills', 'Experience', 'Workflow', 'Projects', 'CV', 'Education', 'Contact'];

const highlights = [
  'Scalable Laravel applications with clean architecture',
  'React, Next.js & Inertia.js full-stack delivery',
  'Real-time systems, queues, jobs & event-driven workflows',
  'Docker, CI/CD & cloud-ready deployment pipelines',
  'Technical SEO, GA4 & admin-controlled metadata',
  'AI chatbot integrations with OpenAI, Claude & Gemini',
];

const skills = [
  {
    title: 'Backend Development',
    icon: Server,
    items: [
      'Laravel 13.x',
      'PHP 8.4+',
      'Livewire 3.x / 4.x',
      'Laravel Octane',
      'Sanctum & Passport',
      'REST API',
      'WebSocket & Real-Time',
      'Events, Queues & Jobs',
      'Inertia, Horizon & Telescope',
    ],
  },
  {
    title: 'Frontend Development',
    icon: Code2,
    items: [
      'React 19.x',
      'Next.js 15.x / 16.x',
      'React + Inertia.js 3.x',
      'TypeScript 5.x',
      'JavaScript ES2025+',
      'HTML5 & CSS3',
    ],
  },
  {
    title: 'UI Engineering & Animation',
    icon: Layers3,
    items: [
      'Tailwind CSS 4.x',
      'Bootstrap 5.x',
      'GSAP 3.x',
      'Framer Motion / Magic UI',
      'Shadcn/UI',
      'Responsive & Cross-Browser UI',
    ],
  },
  {
    title: 'Database & Storage',
    icon: Database,
    items: [
      'PostgreSQL 18.x',
      'MySQL 8.x',
      'Redis 8.x',
      'Database Architecture',
      'Indexing & Migrations',
      'Query Optimization',
    ],
  },
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    items: [
      'Docker & Docker Compose',
      'Coolify',
      'FrankenPHP + Octane',
      'Nginx / Apache',
      'Linux (Ubuntu)',
      'CI/CD Automation',
      'Git, GitHub & GitLab',
      'AWS, DigitalOcean, Hetzner & Cloudflare',
    ],
  },
  {
    title: 'SEO & Digital Analytics',
    icon: Search,
    items: [
      'Technical SEO',
      'XML Sitemap Management',
      'Google Search Console',
      'Google Analytics 4',
      'Dynamic SEO Admin Panel',
      'Core Web Vitals Optimization',
    ],
  },
  {
    title: 'CMS & AI Integrations',
    icon: Bot,
    items: [
      'WordPress Plugin Development',
      'OpenAI API',
      'Claude API',
      'Google Gemini API',
      'Third-party API Integration',
    ],
  },
  {
    title: 'Development Approach',
    icon: ShieldCheck,
    items: [
      'Clean Architecture',
      'Scalable System Design',
      'Security-Focused Development',
      'Performance Optimization',
      'User-Centered Interfaces',
      'Maintainable Long-Term Code',
    ],
  },
];

const toolSections = [
  {
    label: 'Platforms & Infrastructure',
    items: ['Docker', 'Coolify', 'FrankenPHP', 'Nginx', 'Ubuntu Linux', 'Cloudflare'],
  },
  {
    label: 'Workflow & Tooling',
    items: ['Git', 'GitHub', 'GitLab', 'CI/CD', 'VS Code', 'Horizon', 'Telescope'],
  },
];

const terminalCommands = [
  'php artisan octane:start --server=frankenphp',
  'php artisan queue:work --queue=notifications,default',
  'npm run build && docker compose up -d --build',
  'Event::dispatch(new ProjectPublished($project));',
];

const workflowSteps = [
  {
    title: 'Request',
    label: 'Route, middleware & validation',
    code: "Route::middleware('auth:sanctum')\n  ->post('/projects', [ProjectController::class, 'store']);",
  },
  {
    title: 'Service',
    label: 'Business logic stays isolated',
    code: 'app(ProjectService::class)\n  ->create($request->validated());',
  },
  {
    title: 'Event',
    label: 'Listeners, jobs & notifications',
    code: "event(new ProjectCreated($project));\nProjectCreatedNotification::dispatch($project);",
  },
  {
    title: 'Response',
    label: 'API, Inertia or real-time update',
    code: 'return Inertia::render("Projects/Show", [\n  "project" => $project->load("stack"),\n]);',
  },
];

const experiences = [
  {
    company: 'Eoneral Developer',
    title: 'Laravel Developer',
    date: 'Feb 2025 - Present',
    points: [
      'Building scalable Laravel applications with clean architecture, REST APIs, and event-driven workflows.',
      'Delivering React, Inertia.js, and Livewire interfaces with Tailwind CSS and responsive UI engineering.',
      'Implementing authentication with Sanctum/Passport, queues, jobs, notifications, and real-time features.',
      'Optimizing MySQL/PostgreSQL schemas, Redis caching, and application performance with Octane where needed.',
      'Supporting Docker-based deployment, CI/CD workflows, and production monitoring with Horizon & Telescope.',
      'Integrating technical SEO, GA4, admin-managed metadata, and third-party APIs including AI services.',
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
            <span className="min-w-0 leading-snug">{profile.experience} building scalable digital solutions</span>
          </StaggerItem>
          <StaggerItem as="h1" className="headline max-w-3xl text-3xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            <span className="name-gradient">{profile.name}</span>
          </StaggerItem>
          <StaggerItem as="p" className="hero-subtitle mt-3 max-w-2xl text-lg font-semibold text-brand sm:mt-4 sm:text-2xl">{profile.role}</StaggerItem>
          <StaggerItem as="p" className="hero-text mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            I work with modern Laravel, React, and Next.js technologies to build scalable, secure, and high-performance web applications — from backend architecture and real-time systems to responsive UI, DevOps, SEO, and AI integrations.
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
              <p className="mt-1 text-xs font-semibold text-emerald-100">Full-Stack Laravel Engineer</p>
              <div className="mt-4 grid gap-2">
                <span className="progress-line"><span style={{ width: '88%' }}></span></span>
                <span className="progress-line muted"><span style={{ width: '72%' }}></span></span>
              </div>
            </div>
          </div>

          <div className="tech-ribbon" aria-hidden="true">
            <span>Laravel</span>
            <span>React</span>
            <span>Next.js</span>
            <span>Docker</span>
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
              <p className="whitespace-nowrap sm:whitespace-normal"><span className="text-gold">$stack</span> = [<span className="text-emerald-300">'Laravel 13'</span>, <span className="text-emerald-300">'React 19'</span>, <span className="text-emerald-300">'Octane'</span>, <span className="text-emerald-300">'Redis'</span>];</p>
              <p className="whitespace-nowrap sm:whitespace-normal"><span className="text-sky-300">return</span> response()-&gt;json(<span className="text-gold">$cleanCode</span>);<span className="typing-cursor"></span></p>
            </div>
          </div>

          <div className="hero-metrics mt-5 grid grid-cols-2 gap-4">
            <Metric value="1.8+" label="Years Experience" />
            <Metric value="Full-Stack" label="Laravel + React" />
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
        <h2>Modern technologies for scalable, secure digital solutions.</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel feature-panel">
          <BriefcaseBusiness className="text-brand" size={30} />
          <h3>What I bring</h3>
          <p>
            I build enterprise-grade Laravel applications with clean architecture, modern frontend engineering, and production-ready infrastructure. My work spans backend APIs, real-time features, responsive UI, database optimization, DevOps deployment, technical SEO, and AI-powered integrations — always with security, performance, and long-term maintainability in mind.
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
        <h2>Technical expertise across the full development stack.</h2>
      </div>
      <StackOrbit />
      <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
      <div className="mt-8 space-y-4">
        {toolSections.map(({ label, items }) => (
          <div key={label}>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-coral">{label}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((tool) => (
                <span key={tool} className="tool-chip">{tool}</span>
              ))}
            </div>
          </div>
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
      <span className="orbit-item orbit-one">Next.js</span>
      <span className="orbit-item orbit-two">Octane</span>
      <span className="orbit-item orbit-three">React</span>
      <span className="orbit-item orbit-four">Redis</span>
    </div>
  );
}

function Experience() {
  return (
    <Reveal as="section" id="experience" className="section section-band">
      <div className="section-heading">
        <p>Experience</p>
        <h2>Production experience across backend, frontend, and DevOps.</h2>
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
          <h2>Event-driven Laravel architecture, from request to response.</h2>
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
          <h2>Need a developer for scalable Laravel & full-stack projects?</h2>
          <p>Available for Laravel backend development, React/Next.js frontend work, API integrations, DevOps setup, technical SEO, and AI chatbot implementations.</p>
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
        <p>Copyright {new Date().getFullYear()} Wasif Ahmed. Built with React, Tailwind CSS, and modern Laravel practices.</p>
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
