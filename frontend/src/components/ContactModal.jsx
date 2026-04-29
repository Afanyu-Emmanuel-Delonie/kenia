import { useState, useEffect } from 'react';
import { submitInquiry, getStoreListings } from '../api/services';

const INITIAL = { senderName: '', senderEmail: '', senderPhone: '', listingId: '', message: '' };

export default function ContactModal({ onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [listings, setListings] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Fetch available listings for the dropdown
  useEffect(() => {
    getStoreListings()
      .then((res) => setListings(res.data ?? []))
      .catch(() => setListings([]));
  }, []);

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.senderName.trim()) e.senderName = 'Name is required';
    if (!form.senderEmail.trim()) e.senderEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail)) e.senderEmail = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Use selected listing or first available, backend requires a listingId
    const listingId = form.listingId
      ? Number(form.listingId)
      : listings[0]?.id ?? null;

    if (!listingId) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await submitInquiry({
        listingId,
        senderName: form.senderName.trim(),
        senderEmail: form.senderEmail.trim(),
        senderPhone: form.senderPhone.trim() || undefined,
        message: form.message.trim(),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'transparent',
    border: `1px solid ${errors[field] ? '#c0392b' : 'rgba(5,5,5,0.15)'}`,
    fontFamily: 'var(--font-ui)',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: 'var(--kernia-obsidian)',
    outline: 'none',
    transition: 'border-color 0.25s ease',
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(5,5,5,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 2000,
        }}
      />

      {/* Panel — slides in from right */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 'min(520px, 100vw)',
        background: 'var(--kernia-ivory)',
        zIndex: 2001,
        padding: 'clamp(2rem, 5vw, 3rem)',
        overflowY: 'auto',
        animation: 'slideInRight 0.45s cubic-bezier(0.76, 0, 0.24, 1)',
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--kernia-obsidian)', opacity: 0.4,
            lineHeight: 1, padding: '0.25rem',
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-ui)', fontSize: '1.1rem',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
        >
          ✕
        </button>

        {status === 'success' ? (
          /* ── Success ── */
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingTop: '4rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'var(--kernia-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--kernia-obsidian)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-data)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kernia-gold)', marginBottom: '0.75rem' }}>
              Message Sent
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 400, color: 'var(--kernia-obsidian)', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '1rem' }}>
              Thank You, {form.senderName.split(' ')[0]}.
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 300, color: 'rgba(5,5,5,0.6)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '340px' }}>
              Your message has been received by our atelier team. We will respond to you within 24 hours.
            </p>
            <div style={{ width: '32px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '2.5rem' }} />
            <button
              onClick={onClose}
              style={{
                fontFamily: 'var(--font-data)', fontSize: '0.58rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', background: 'var(--kernia-obsidian)',
                color: 'var(--kernia-ivory)', border: 'none', cursor: 'pointer',
                padding: '0.9rem 2.5rem', alignSelf: 'flex-start', transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--kernia-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--kernia-obsidian)'}
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-data)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kernia-gold)', marginBottom: '0.75rem' }}>
                Get In Touch
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 400, color: 'var(--kernia-obsidian)', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                Contact the Atelier
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 300, color: 'rgba(5,5,5,0.55)', lineHeight: 1.6 }}>
                Whether you have a question about a piece, a bespoke request, or simply wish to connect — we are here.
              </p>
            </div>

            <div style={{ width: '32px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '2.5rem' }} />

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    name="senderName" value={form.senderName} onChange={handleChange}
                    placeholder="Your full name"
                    style={inputStyle('senderName')}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = errors.senderName ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                  />
                  {errors.senderName && <span style={errStyle}>{errors.senderName}</span>}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    name="senderEmail" type="email" value={form.senderEmail} onChange={handleChange}
                    placeholder="your@email.com"
                    style={inputStyle('senderEmail')}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = errors.senderEmail ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                  />
                  {errors.senderEmail && <span style={errStyle}>{errors.senderEmail}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone <span style={{ opacity: 0.45 }}>(optional)</span></label>
                  <input
                    name="senderPhone" type="tel" value={form.senderPhone} onChange={handleChange}
                    placeholder="+1 000 000 0000"
                    style={inputStyle('senderPhone')}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(5,5,5,0.15)'}
                  />
                </div>

                {/* Piece of interest */}
                {listings.length > 0 && (
                  <div>
                    <label style={labelStyle}>Piece of Interest <span style={{ opacity: 0.45 }}>(optional)</span></label>
                    <select
                      name="listingId" value={form.listingId} onChange={handleChange}
                      style={{
                        ...inputStyle('listingId'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23050505' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                        cursor: 'pointer',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(5,5,5,0.15)'}
                    >
                      <option value="">General enquiry</option>
                      {listings.map((l) => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can assist you..."
                    rows={5}
                    style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '130px' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = errors.message ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                  />
                  {errors.message && <span style={errStyle}>{errors.message}</span>}
                </div>

                {/* Error banner */}
                {status === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#c0392b',
                    padding: '0.75rem 1rem', border: '1px solid rgba(192,57,43,0.3)',
                    background: 'rgba(192,57,43,0.05)',
                  }}>
                    {listings.length === 0
                      ? 'No listings available at the moment. Please email us directly at atelier@kenia.com'
                      : 'Something went wrong. Please try again or email us directly.'}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    fontFamily: 'var(--font-data)', fontSize: '0.58rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    background: status === 'loading' ? 'rgba(5,5,5,0.4)' : 'var(--kernia-obsidian)',
                    color: 'var(--kernia-ivory)', border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    padding: '1rem', width: '100%', transition: 'background 0.3s ease',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.background = 'var(--kernia-gold)'; }}
                  onMouseLeave={(e) => { if (status !== 'loading') e.currentTarget.style.background = 'var(--kernia-obsidian)'; }}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {/* Direct contact */}
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(5,5,5,0.4)', textAlign: 'center', lineHeight: 1.6 }}>
                  Or reach us directly at{' '}
                  <a href="mailto:atelier@kenia.com" style={{ color: 'var(--kernia-gold)', textDecoration: 'none' }}>
                    atelier@kenia.com
                  </a>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-data)',
  fontSize: '0.55rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--kernia-obsidian)',
  marginBottom: '0.5rem',
  opacity: 0.7,
};

const errStyle = {
  display: 'block',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.72rem',
  color: '#c0392b',
  marginTop: '0.3rem',
};
