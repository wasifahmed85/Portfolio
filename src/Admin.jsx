import React from 'react';
import {
  ArrowLeft,
  Download,
  ImagePlus,
  Lock,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  clearLocalProjects,
  downloadProjectsJson,
  emptyProject,
  fileToOptimizedDataUrl,
  getAdminPassword,
  isAdminAuthenticated,
  loadProjects,
  setAdminAuthenticated,
  writeLocalProjects,
} from './data/projectsStore';

export default function Admin() {
  const [authed, setAuthed] = React.useState(isAdminAuthenticated);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(null);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (!authed) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await loadProjects({ preferLocal: true });
      if (alive) {
        setProjects(data);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authed]);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2600);
  };

  const persist = (next) => {
    setProjects(next);
    writeLocalProjects(next);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (password === getAdminPassword()) {
      setAdminAuthenticated(true);
      setAuthed(true);
      setError('');
      setPassword('');
      return;
    }
    setError('Wrong password. Try again.');
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
  };

  const startCreate = () => setEditing(emptyProject());

  const startEdit = (project) => setEditing({ ...project, stack: [...(project.stack || [])] });

  const removeProject = (id) => {
    if (!window.confirm('Delete this project?')) return;
    const next = projects.filter((item) => item.id !== id);
    persist(next);
    showMessage('Project deleted. Download JSON before Netlify deploy.');
  };

  const saveProject = (project) => {
    const exists = projects.some((item) => item.id === project.id);
    const next = exists
      ? projects.map((item) => (item.id === project.id ? project : item))
      : [project, ...projects];
    persist(next);
    setEditing(null);
    showMessage('Saved locally. Download projects.json for Netlify.');
  };

  const handleDownload = () => {
    downloadProjectsJson(projects);
    showMessage('Downloaded projects.json — put it in public/data/ then deploy.');
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed?.projects) ? parsed.projects : Array.isArray(parsed) ? parsed : null;
      if (!list) throw new Error('Invalid JSON shape');
      persist(list);
      showMessage('Imported projects.json successfully.');
    } catch {
      setError('Could not import that JSON file.');
    }
  };

  const resetToFile = async () => {
    clearLocalProjects();
    const data = await loadProjects({ preferLocal: false });
    setProjects(data);
    showMessage('Reset to public/data/projects.json');
  };

  if (!authed) {
    return (
      <div className="admin-shell">
        <form className="admin-login" onSubmit={handleLogin}>
          <div className="admin-login-icon">
            <Lock size={22} />
          </div>
          <h1>Admin Panel</h1>
          <p>Upload and manage portfolio projects stored in JSON.</p>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoFocus
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" className="primary-button w-full justify-center">
            Unlock Admin
          </button>
          <a href="/" className="admin-back-link">
            <ArrowLeft size={16} />
            Back to portfolio
          </a>
          <p className="admin-hint">Default password: wasif2026 (change with VITE_ADMIN_PASSWORD)</p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell admin-dashboard">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Wasif Ahmed</p>
          <h1>Projects Admin</h1>
        </div>
        <div className="admin-top-actions">
          <a href="/" className="secondary-button">
            <ArrowLeft size={16} />
            Portfolio
          </a>
          <button type="button" className="secondary-button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="admin-banner">
        <strong>Netlify workflow:</strong> Add/edit projects here → Download <code>projects.json</code> →
        replace <code>public/data/projects.json</code> → deploy to Netlify. Frontend reads that JSON.
      </div>

      {message ? <div className="admin-toast">{message}</div> : null}
      {error ? <div className="admin-error-banner">{error}</div> : null}

      <div className="admin-toolbar">
        <button type="button" className="primary-button" onClick={startCreate}>
          <Plus size={16} />
          Add Project
        </button>
        <button type="button" className="secondary-button" onClick={handleDownload}>
          <Download size={16} />
          Download JSON
        </button>
        <label className="secondary-button admin-file-label">
          <Upload size={16} />
          Import JSON
          <input type="file" accept="application/json,.json" onChange={handleImport} hidden />
        </label>
        <button type="button" className="secondary-button" onClick={resetToFile}>
          Reset to file
        </button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading projects…</p>
      ) : (
        <div className="admin-grid">
          {projects.length === 0 ? (
            <div className="admin-empty">No projects yet. Click Add Project to create one.</div>
          ) : (
            projects.map((project) => (
              <article key={project.id} className="admin-card">
                <div className="admin-card-media">
                  {project.image ? (
                    <img src={project.image} alt={project.name} />
                  ) : (
                    <div className="admin-card-placeholder">No image</div>
                  )}
                </div>
                <div className="admin-card-body">
                  <p className="admin-type">{project.type}</p>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                  <div className="admin-stack">
                    {(project.stack || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="admin-card-actions">
                    <button type="button" className="secondary-button" onClick={() => startEdit(project)}>
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button type="button" className="danger-button" onClick={() => removeProject(project.id)}>
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {editing ? (
        <ProjectEditor
          project={editing}
          onCancel={() => setEditing(null)}
          onSave={saveProject}
        />
      ) : null}
    </div>
  );
}

function ProjectEditor({ project, onCancel, onSave }) {
  const [form, setForm] = React.useState(project);
  const [stackText, setStackText] = React.useState((project.stack || []).join(', '));
  const [uploading, setUploading] = React.useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      update('image', dataUrl);
    } catch {
      window.alert('Image upload failed. Try a JPG or PNG under 5MB.');
    } finally {
      setUploading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      window.alert('Name and description are required.');
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      type: form.type.trim() || 'Project',
      description: form.description.trim(),
      stack: stackText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
    });
  };

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <form className="admin-modal" onSubmit={submit}>
        <div className="admin-modal-head">
          <h2>{project.name ? 'Edit Project' : 'Add Project'}</h2>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>

        <div className="admin-form-grid">
          <label>
            Project name *
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label>
            Type
            <input value={form.type} onChange={(e) => update('type', e.target.value)} placeholder="Laravel Application" />
          </label>
          <label className="admin-span-2">
            Description *
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
            />
          </label>
          <label className="admin-span-2">
            Stack (comma separated)
            <input
              value={stackText}
              onChange={(e) => setStackText(e.target.value)}
              placeholder="Laravel, MySQL, React"
            />
          </label>
          <label>
            Live URL
            <input value={form.liveUrl} onChange={(e) => update('liveUrl', e.target.value)} placeholder="https://" />
          </label>
          <label>
            GitHub URL
            <input value={form.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." />
          </label>
          <label className="admin-span-2 admin-image-field">
            Project image
            <div className="admin-image-row">
              <label className="secondary-button admin-file-label">
                <ImagePlus size={16} />
                {uploading ? 'Uploading…' : 'Upload image'}
                <input type="file" accept="image/*" onChange={handleImage} hidden disabled={uploading} />
              </label>
              {form.image ? (
                <button type="button" className="danger-button" onClick={() => update('image', '')}>
                  Remove image
                </button>
              ) : null}
            </div>
            {form.image ? <img className="admin-image-preview" src={form.image} alt="Preview" /> : null}
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => update('featured', e.target.checked)}
            />
            Featured on homepage
          </label>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            <Save size={16} />
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
