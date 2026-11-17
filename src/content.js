import {
  Bot,
  Box,
  Cloud,
  Code2,
  Database,
  Layers3,
  Search,
  Server,
  ShieldCheck,
} from 'lucide-react';

/** Portfolio content — kept separate from rendering so sections stay presentational. */

export const profile = {
  name: 'Wasif Ahmed',
  firstName: 'Wasif',
  lastName: 'Ahmed',
  initials: 'WA',
  role: 'Laravel & Full-Stack Developer',
  shortRole: 'Laravel Developer',
  location: 'Dhaka, Bangladesh',
  phone: '+880 1314 118535',
  email: 'dev.wasifahmed@gmail.com',
  github: 'https://github.com/wasifahmed85',
  experience: '1.8+ Years',
};

export const navItems = ['About', 'Services', 'Skills', 'Experience', 'Workflow', 'Projects', 'CV', 'Education', 'Contact'];

export const heroIntro =
  'I work with modern Laravel, React, and Next.js technologies to build scalable, secure, and high-performance web applications — from backend architecture and real-time systems to responsive UI, DevOps, SEO, and AI integrations.';

export const heroTags = ['Laravel 13', 'React 19', 'Octane', 'Redis', 'Next.js', 'Docker'];

export const aboutStatement =
  'I build enterprise-grade Laravel applications with clean architecture, modern frontend engineering, and production-ready infrastructure.';

export const aboutBody =
  'My work spans backend APIs, real-time features, responsive UI, database optimization, DevOps deployment, technical SEO, and AI-powered integrations — always with security, performance, and long-term maintainability in mind.';

export const highlights = [
  'Scalable Laravel applications with clean architecture',
  'React, Next.js & Inertia.js full-stack delivery',
  'Real-time systems, queues, jobs & event-driven workflows',
  'Docker, CI/CD & cloud-ready deployment pipelines',
  'Technical SEO, GA4 & admin-controlled metadata',
  'AI chatbot integrations with OpenAI, Claude & Gemini',
];

export const skills = [
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
      'Payment Gateway Integration',
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
    title: '3D & Creative',
    icon: Box,
    items: ['Three.js (Basic)', 'Blender (Basic)'],
  },
  {
    title: 'Database & Storage',
    icon: Database,
    items: [
      'PostgreSQL 18.x',
      'MySQL 8.x',
      'Eloquent ORM',
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

export const toolSections = [
  {
    label: 'Platforms & Infrastructure',
    items: ['Docker', 'Coolify', 'FrankenPHP', 'Nginx', 'Ubuntu Linux', 'Cloudflare'],
  },
  {
    label: 'Workflow & Tooling',
    items: ['Git', 'GitHub', 'GitLab', 'CI/CD', 'VS Code', 'PHPStorm', 'IntelliJ IDEA', 'Figma', 'Horizon', 'Telescope', 'Windows'],
  },
];

export const terminalCommands = [
  'php artisan octane:start --server=frankenphp',
  'php artisan queue:work --queue=notifications,default',
  'npm run build && docker compose up -d --build',
  'Event::dispatch(new ProjectPublished($project));',
];

export const workflowSteps = [
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

export const experiences = [
  {
    company: 'Eoneral Developer',
    title: 'Laravel Developer',
    date: 'Feb 2025 - Present',
    current: true,
    place: 'MakTech · On-site · Jamuna Future Park, Dhaka, Bangladesh',
    about: 'Scalable digital products: web apps, mobile apps, SaaS and e-commerce solutions.',
    points: [
      'Building scalable Laravel applications with clean architecture, REST APIs, and event-driven workflows.',
      'Delivering React, Inertia.js, and Livewire interfaces with Tailwind CSS and responsive UI engineering.',
      'Implementing authentication with Sanctum/Passport, queues, jobs, notifications, and real-time features.',
      'Integrating payment gateways and handling secure checkout and transaction flows.',
      'Optimizing MySQL/PostgreSQL schemas, Redis caching, and application performance with Octane where needed.',
      'Supporting Docker-based deployment, CI/CD workflows, and production monitoring with Horizon & Telescope.',
      'Integrating technical SEO, GA4, admin-managed metadata, and third-party APIs including AI services.',
      'Managing and coordinating team tasks and deliverables, and conducting code reviews to keep quality standards high.',
    ],
  },
  {
    company: 'Unplug Tech Design Intern',
    title: 'Responsive Web Design Intern',
    date: 'Jun 2024 - Aug 2024',
    place: 'European IT Institute · Mirpur 10, Dhaka',
    points: [
      'Designed responsive interfaces using mobile-first design principles.',
      'Collaborated with developers on clean layout systems and UI consistency.',
      'Improved hands-on experience with JavaScript interactivity and layout polish.',
      'Worked on multiple brand websites while following brand design guidelines.',
    ],
  },
];

/** Government-recognised certifications (NSDA, Bangladesh). */
export const certifications = [
  {
    title: 'Web Design - Level 3',
    issuer: 'National Skills Development Authority, Bangladesh',
    type: 'National Skills Certificate (NSC)',
    reg: 'REG-ICT-WD-L3-001794',
    serial: 'NSC-ICT-WD-L3-002001',
  },
  {
    title: 'Web Design and Development for Freelancing - Level 3',
    issuer: 'National Skills Development Authority, Bangladesh',
    type: 'Statement of Attainment (SOA)',
    reg: 'REG-ICT-WDDF-L3-001360',
    serial: 'SOA-ICT-WDDF-L3-001367',
  },
];

export const training = [
  {
    title: 'Professional Frontend Web Design',
    org: 'Programming Hero, Bangladesh',
    meta: '6 months | Jan 2024 - Jun 2024',
  },
  {
    title: 'Web Design & Freelancing, Level 3',
    org: 'European IT Institute, Mirpur 10, Dhaka (NHRDF)',
    meta: '3 months | Sep 2024 - Nov 2024',
  },
];

export const languages = [
  { name: 'Bengali', level: 'Native', score: 5 },
  { name: 'English', level: 'Professional working proficiency', score: 4 },
];

export const achievements = [
  'Delivered multiple client web applications independently, from requirements through deployment',
  'Contributed to team-based feature development on collaborative client projects',
  'Earned two government-recognized NSDA Level 3 certifications in web design and freelancing',
  'Completed structured training programs in frontend and full-stack web development',
];

export const education = [
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

export const contactPitch = {
  title: 'Need a developer for scalable Laravel & full-stack projects?',
  body: 'Available for Laravel backend development, React/Next.js frontend work, API integrations, DevOps setup, technical SEO, and AI chatbot implementations.',
};

/** "What I can do" — one row per service, expanded on click. */
export const services = [
  {
    title: 'Laravel Application Development',
    body: 'Scalable Laravel 13 apps with clean architecture, service layers, and maintainable code that stays easy to extend.',
    tags: ['Laravel 13', 'PHP 8.4', 'Livewire', 'Octane'],
  },
  {
    title: 'REST APIs & Real-Time Systems',
    body: 'Secure APIs with Sanctum/Passport, WebSockets, events, queues, and jobs for features that react instantly.',
    tags: ['REST', 'WebSocket', 'Queues', 'Horizon'],
  },
  {
    title: 'React & Next.js Frontends',
    body: 'Responsive interfaces in React 19, Next.js and Inertia.js, with motion and polish that feel native on every screen.',
    tags: ['React 19', 'Next.js', 'Inertia', 'Tailwind'],
  },
  {
    title: 'Database Design & Performance',
    body: 'PostgreSQL and MySQL schemas, indexing, query tuning, and Redis caching so pages stay fast as data grows.',
    tags: ['PostgreSQL', 'MySQL', 'Redis', 'Indexing'],
  },
  {
    title: 'DevOps, Docker & Deployment',
    body: 'Dockerised builds, CI/CD pipelines, and production servers on AWS, DigitalOcean, Hetzner, or Coolify.',
    tags: ['Docker', 'CI/CD', 'Nginx', 'Cloudflare'],
  },
  {
    title: 'Technical SEO & AI Integrations',
    body: 'Admin-managed metadata, sitemaps, GA4, Core Web Vitals, and chatbots powered by OpenAI, Claude, or Gemini.',
    tags: ['SEO', 'GA4', 'OpenAI', 'Claude API'],
  },
];
