import React from 'react';
import { m } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Check, ClipboardCopy, Download, FileText, Github, GraduationCap, Mail, MapPin, Phone, Send } from 'lucide-react';
import { contactPitch, education, navItems, profile } from '../content';
import { downloadCvFile, hasCvFile } from '../data/cvStore';
import { Eyebrow, Magnetic, scrollToTarget, SectionHeading, SplitWords, Tilt } from '../experience/interactions';

const ease = [0.22, 1, 0.36, 1];

export function CvSection({ cv }) {
  if (!hasCvFile(cv)) return null;

  return (
    <section id="cv" data-scene="cv" className="section cv">
      <div className="container">
        <m.div
          className="cv-card"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="cv-doc" aria-hidden="true">
            <FileText size={30} />
            <span />
            <span />
            <span />
          </div>
          <div className="cv-copy">
            <Eyebrow index="06">Curriculum Vitae</Eyebrow>
            <h2 className="section-title">{cv.label || 'Wasif Ahmed CV'}</h2>
            <p className="cv-meta">
              {cv.fileName}
              {cv.updatedAt ? ` · Updated ${new Date(cv.updatedAt).toLocaleDateString()}` : ''}
            </p>
          </div>
          <Magnetic>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => downloadCvFile(cv)}>
              <Download size={18} />
              Download CV
            </button>
          </Magnetic>
        </m.div>
      </div>
    </section>
  );
}

export function Education({ hasCv }) {
  return (
    <section id="education" data-scene="education" className="section education">
      <div className="container">
        <SectionHeading index={hasCv ? '07' : '06'} eyebrow="Education" title="Academic foundation in computer science." />
        <ol className="edu-grid">
          {education.map((item, index) => (
            <m.li
              key={item.school}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease, delay: index * 0.1 }}
            >
              <Tilt as="article" className="edu-card" max={8}>
                <span className="edu-number" aria-hidden="true" data-depth="20">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="edu-icon" data-depth="50">
                  <GraduationCap size={20} />
                </span>
                <h3>{item.school}</h3>
                <p className="edu-detail">{item.detail}</p>
                <p className="edu-meta">{item.meta}</p>
              </Tilt>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FORM_NAME = 'contact';
const encode = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

/** Posts to Netlify Forms; if that endpoint isn't available, hands off to the mail client. */
function ContactForm() {
  const [status, setStatus] = React.useState('idle');
  const [fields, setFields] = React.useState({ name: '', email: '', message: '' });

  const update = (event) => setFields((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const openMailClient = () => {
    const subject = `Project enquiry from ${fields.name || 'your portfolio'}`;
    const body = `${fields.message}\n\n— ${fields.name}${fields.email ? ` (${fields.email})` : ''}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (event.target['bot-field']?.value) return;
    setStatus('sending');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, ...fields }),
      });
      if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`);
      setStatus('sent');
      setFields({ name: '', email: '', message: '' });
    } catch {
      setStatus('mailto');
      openMailClient();
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <span className="form-success-icon">
          <Check size={22} />
        </span>
        <h3>Message sent</h3>
        <p>Thanks for reaching out. I'll reply to your email soon.</p>
        <button type="button" className="text-link" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="sr-only">
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="field">
        <input id="cf-name" name="name" type="text" autoComplete="name" required placeholder=" " value={fields.name} onChange={update} />
        <label htmlFor="cf-name">Your name</label>
      </div>
      <div className="field">
        <input id="cf-email" name="email" type="email" autoComplete="email" required placeholder=" " value={fields.email} onChange={update} />
        <label htmlFor="cf-email">Email address</label>
      </div>
      <div className="field">
        <textarea id="cf-message" name="message" rows={4} required placeholder=" " value={fields.message} onChange={update} />
        <label htmlFor="cf-message">Tell me about your project</label>
      </div>
      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <Send size={16} />
      </button>
      <p className="form-note" role="status">
        {status === 'mailto' ? 'Opening your email app with the message ready to send.' : `Or email directly: ${profile.email}`}
      </p>
    </form>
  );
}

export function Contact({ cv }) {
  const [copied, setCopied] = React.useState(false);
  const readyCv = hasCvFile(cv);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" data-scene="contact" className="section contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="contact-title">
            <SplitWords text={contactPitch.title} stagger={0.04} />
          </h2>
          <p className="contact-body">{contactPitch.body}</p>

          <div className="contact-email">
            <a href={`mailto:${profile.email}`} className="contact-email-link">
              {profile.email}
            </a>
            <button type="button" className="icon-btn" onClick={copyEmail} aria-label="Copy email address">
              {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
            </button>
            <span className="sr-only" role="status">{copied ? 'Email copied' : ''}</span>
          </div>

          <ul className="contact-list">
            <li>
              <Phone size={16} />
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>{profile.location}</span>
            </li>
            <li>
              <Github size={16} />
              <a href={profile.github} target="_blank" rel="noreferrer">{profile.github.replace(/^https?:\/\//, '')}</a>
            </li>
          </ul>

          <div className="contact-actions">
            <Magnetic>
              <a href={`mailto:${profile.email}`} className="btn btn-primary btn-lg">
                <Mail size={18} />
                Email Me
              </a>
            </Magnetic>
            {readyCv ? (
              <Magnetic>
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => downloadCvFile(cv)}>
                  <Download size={18} />
                  Download CV
                </button>
              </Magnetic>
            ) : null}
            <Magnetic>
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">
                <Github size={18} />
                GitHub
              </a>
            </Magnetic>
          </div>
        </div>

        <m.div
          className="contact-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        >
          <p className="micro-label">Start a project</p>
          <ContactForm />
        </m.div>
      </div>
    </section>
  );
}

export function Footer({ onHome = true, hasCv = false }) {
  const links = navItems.filter((item) => item !== 'CV' || hasCv);
  const hrefFor = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-cta">
            <p className="micro-label">Have an idea?</p>
            <a href={`mailto:${profile.email}`} className="footer-mail">
              Let’s talk
              <ArrowUpRight size={28} />
            </a>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {links.map((item) => (
              <a key={item} href={hrefFor(item.toLowerCase())}>
                {item}
              </a>
            ))}
          </nav>
          <Magnetic>
            <button
              type="button"
              className="back-top"
              onClick={() => (onHome ? scrollToTarget(0, { offset: 0 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </Magnetic>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          {profile.name}
        </p>

        <div className="footer-bottom">
          <p>Copyright {new Date().getFullYear()} {profile.name}. Built with React, Three.js, Tailwind CSS, and modern Laravel practices.</p>
          <a href="/admin" className="footer-admin">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
