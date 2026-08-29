const CV_STORAGE_KEY = 'portfolio_cv_v1';

export function emptyCv() {
  return {
    fileName: '',
    mimeType: '',
    dataUrl: '',
    label: 'Wasif Ahmed CV',
    updatedAt: null,
  };
}

export function hasCvFile(cv) {
  return Boolean(cv?.dataUrl && cv?.fileName);
}

export function readLocalCv() {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLocalCv(cv) {
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cv));
}

export function clearLocalCv() {
  localStorage.removeItem(CV_STORAGE_KEY);
}

export async function fetchCvFromJson() {
  const response = await fetch(`/data/cv.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load cv.json');
  return response.json();
}

export async function loadCv({ preferLocal = false } = {}) {
  if (preferLocal) {
    const local = readLocalCv();
    if (local) return local;
  }

  try {
    return await fetchCvFromJson();
  } catch {
    return readLocalCv() || emptyCv();
  }
}

export function downloadCvJson(cv) {
  const blob = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'cv.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getCvJsonTemplate() {
  return {
    fileName: 'Wasif-Ahmed-CV.pdf',
    mimeType: 'application/pdf',
    dataUrl: '',
    label: 'Wasif Ahmed CV',
    updatedAt: null,
  };
}

export function downloadCvJsonTemplate() {
  const template = getCvJsonTemplate();
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'cv.template.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadCvFile(cv) {
  if (!hasCvFile(cv)) return;
  const anchor = document.createElement('a');
  anchor.href = cv.dataUrl;
  anchor.download = cv.fileName || 'cv.pdf';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function cvFromFile(file) {
  const maxBytes = 2.5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('CV must be under 2.5MB for Netlify JSON storage.');
  }

  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const okType =
    allowed.includes(file.type) ||
    /\.(pdf|doc|docx)$/i.test(file.name);

  if (!okType) {
    throw new Error('Upload a PDF, DOC, or DOCX file.');
  }

  const dataUrl = await fileToDataUrl(file);
  return {
    fileName: file.name,
    mimeType: file.type || 'application/pdf',
    dataUrl,
    label: 'Wasif Ahmed CV',
    updatedAt: new Date().toISOString(),
  };
}
