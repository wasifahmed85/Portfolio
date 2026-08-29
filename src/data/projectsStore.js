const STORAGE_KEY = 'portfolio_projects_v3';
const AUTH_KEY = 'portfolio_admin_auth_v1';
const DEFAULT_PASSWORD = 'wasif2026';

export function getAdminPassword() {
  return import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function setAdminAuthenticated(value) {
  if (value) sessionStorage.setItem(AUTH_KEY, '1');
  else sessionStorage.removeItem(AUTH_KEY);
}

export function readLocalProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.projects) ? parsed.projects : null;
  } catch {
    return null;
  }
}

export function writeLocalProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects }));
}

export function clearLocalProjects() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function fetchProjectsFromJson() {
  const response = await fetch(`/data/projects.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load projects.json');
  const data = await response.json();
  return Array.isArray(data?.projects) ? data.projects : [];
}

export async function loadProjects({ preferLocal = false } = {}) {
  if (preferLocal) {
    const local = readLocalProjects();
    if (local) return local;
  }

  try {
    return await fetchProjectsFromJson();
  } catch {
    return readLocalProjects() || [];
  }
}

export async function loadProjectById(id) {
  const projects = await loadProjects({ preferLocal: true });
  return projects.find((item) => item.id === id) || null;
}

export function downloadProjectsJson(projects) {
  const blob = new Blob([JSON.stringify({ projects }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'projects.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getProjectsJsonTemplate() {
  return {
    projects: [
      {
        id: 'project-example-001',
        name: 'Project title here',
        type: 'Laravel Application',
        description: 'Short summary shown on the card.',
        overview: 'Longer overview for the details page.',
        role: 'Laravel Developer',
        tag: 'individual',
        features: [
          'Feature one',
          'Feature two',
          'Feature three',
        ],
        challenges: 'What was hard and how you solved it.',
        stack: ['Laravel', 'MySQL', 'React'],
        image: '',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/username/repo',
        featured: true,
        style: 'showcase',
        source: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export function downloadProjectsJsonTemplate() {
  const template = getProjectsJsonTemplate();
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'projects.template.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function createProjectId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyProject() {
  return {
    id: createProjectId(),
    name: '',
    type: 'Laravel Application',
    description: '',
    overview: '',
    role: 'Laravel Developer',
    tag: 'individual',
    features: [],
    challenges: '',
    stack: [],
    image: '',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    style: 'showcase',
    source: 'admin',
    createdAt: new Date().toISOString(),
  };
}

export function projectTagLabel(tag) {
  return tag === 'team' ? 'Team' : 'Individual';
}

export const DEFAULT_PROJECT_IDS = ['inv-stock-001', 'payment-gw-002', 'biz-site-003'];

export function isDefaultProject(project) {
  return project?.source === 'default' || DEFAULT_PROJECT_IDS.includes(project?.id);
}

export function isShowcaseProject(project) {
  return !isDefaultProject(project) && (project?.style === 'showcase' || Boolean(project?.image) || project?.source === 'admin');
}

export function splitProjects(projects) {
  const list = Array.isArray(projects) ? projects : [];
  return {
    defaultProjects: list.filter((project) => isDefaultProject(project)),
    uploadedProjects: list.filter((project) => !isDefaultProject(project)),
  };
}

export function parseLines(text) {
  return String(text || '')
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function fileToOptimizedDataUrl(file, maxWidth = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.onerror = () => reject(new Error('Invalid image file'));
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
