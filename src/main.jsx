import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCopy,
  Code2,
  Cpu,
  Database,
  ExternalLink,
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
import { loadProjects } from './data/projectsStore';
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

const navItems = ['About', 'Skills', 'Experience', 'Workflow', 'Projects', 'Education', 'Contact'];

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
  return <Portfolio />;
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  useRevealAnimation(projects);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const data = await loadProjects({ preferLocal: true });
      if (alive) setProjects(data);
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
        <Hero />
        <About />
        <Skills />
        <Experience />
        <WorkflowLab />
        <Projects projects={projects} />
        <Education />
        <Contact />
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

function Hero() {
  const [commandIndex, setCommandIndex] = React.useState(0);

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
            <a href={profile.github} target="_blank" rel="noreferrer" className="secondary-button">
              <Github size={18} />
              GitHub Profile
            </a>
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
  return (
    <section id="projects" className="section reveal">
      <div className="section-heading">
        <p>Projects</p>
        <h2>Selected work managed from the admin panel and stored in JSON.</h2>
      </div>
      {projects.length === 0 ? (
        <div className="panel">
          <p className="!mt-0">No projects yet. Open the admin panel to upload your first project.</p>
          <a href="/admin" className="primary-button mt-5 inline-flex">
            Open Admin
            <ArrowUpRight size={18} />
          </a>
        </div>
      ) : (
        <div className="stagger-list grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id || project.name} className="project-card">
              {project.image ? (
                <div className="project-media">
                  <img src={project.image} alt={project.name} loading="lazy" />
                </div>
              ) : (
                <Layers3 className="text-coral" size={26} />
              )}
              <p className={`text-sm font-bold uppercase text-brand ${project.image ? 'mt-4' : 'mt-4'}`}>{project.type}</p>
              <h3>{project.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(project.stack || []).map((item) => (
                  <span key={item} className="stack-chip">{item}</span>
                ))}
              </div>
              {(project.liveUrl || project.githubUrl) && (
                <div className="project-links mt-5 flex flex-wrap gap-2">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
                      <ExternalLink size={14} />
                      Live
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
                      <Github size={14} />
                      Code
                    </a>
                  ) : null}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
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

function Contact() {
  const [copied, setCopied] = React.useState(false);

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
