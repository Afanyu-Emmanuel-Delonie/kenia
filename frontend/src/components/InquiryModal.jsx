import { useState, useEffect } from 'react';
import { submitInquiry } from '../api/services';

const INITIAL = { senderName: '', senderEmail: '', senderPhone: '', message: '' };

export default function InquiryModal({ listing, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Close on Escape
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

    setStatus('loading');
    try {
      await submitInquiry({
        listingId: listing.id,
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
          background: 'rgba(5,5,5,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(560px, 94vw)',
        background: 'var(--kernia-ivory)',
        zIndex: 2001,
        padding: 'clamp(2rem, 5vw, 3rem)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--kernia-obsidian)', opacity: 0.5,
            fontSize: '1.2rem', lineHeight: 1, padding: '0.25rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
        >
          ✕
        </button>

        {status === 'success' ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'var(--kernia-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--kernia-obsidian)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem', fontWeight: 400,
              color: 'var(--kernia-obsidian)',
              letterSpacing: '-0.01em', marginBottom: '0.75rem',
            }}>
              Inquiry Received
            </h3>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.9rem',
              fontWeight: 300, color: 'rgba(5,5,5,0.65)', lineHeight: 1.6,
              marginBottom: '2rem',
            }}>
              Thank you, {form.senderName.split(' ')[0]}. Our atelier team will respond to your inquiry within 24 hours.
            </p>
            <button
              onClick={onClose}
              style={{
                fontFamily: 'var(--font-data)', fontSize: '0.58rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                background: 'var(--kernia-obsidian)', color: 'var(--kernia-ivory)',
                border: 'none', cursor: 'pointer',
                padding: '0.85rem 2.5rem', transition: 'background 0.3s ease',
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
            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                fontFamily: 'var(--font-data)', fontSize: '0.58rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--kernia-gold)', marginBottom: '0.6rem',
              }}>
                Atelier Inquiry
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                fontWeight: 400, color: 'var(--kernia-obsidian)',
                letterSpacing: '-0.01em', lineHeight: 1.1,
                marginBottom: '0.5rem',
              }}>
                {listing?.title ?? 'Enquire About This Piece'}
              </h2>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
                fontWeight: 300, color: 'rgba(5,5,5,0.55)', lineHeight: 1.5,
              }}>
                Complete the form below and a member of our atelier team will be in touch.
              </p>
            </div>

            {/* Thin gold divider */}
            <div style={{ width: '32px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '2rem' }} />

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      name="senderName"
                      value={form.senderName}
                      onChange={handleChange}
                      placeholder="Your name"
                      style={inputStyle('senderName')}
                      onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                      onBlur={(e) => e.target.style.borderColor = errors.senderName ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                    />
                    {errors.senderName && <span style={errStyle}>{errors.senderName}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      name="senderEmail"
                      type="email"
                      value={form.senderEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      style={inputStyle('senderEmail')}
                      onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                      onBlur={(e) => e.target.style.borderColor = errors.senderEmail ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                    />
                    {errors.senderEmail && <span style={errStyle}>{errors.senderEmail}</span>}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number <span style={{ opacity: 0.45 }}>(optional)</span></label>
                  <input
                    name="senderPhone"
                    type="tel"
                    value={form.senderPhone}
                    onChange={handleChange}
                    placeholder="+1 000 000 0000"
                    style={inputStyle('senderPhone')}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(5,5,5,0.15)'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest in this piece, any customisation requests, or questions you may have..."
                    rows={5}
                    style={{
                      ...inputStyle('message'),
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--kernia-obsidian)'}
                    onBlur={(e) => e.target.style.borderColor = errors.message ? '#c0392b' : 'rgba(5,5,5,0.15)'}
                  />
                  {errors.message && <span style={errStyle}>{errors.message}</span>}
                </div>

                {/* Error banner */}
                {status === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.8rem',
                    color: '#c0392b', padding: '0.75rem 1rem',
                    border: '1px solid rgba(192,57,43,0.3)',
                    background: 'rgba(192,57,43,0.05)',
                  }}>
                    Something went wrong. Please try again or contact us directly.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    fontFamily: 'var(--font-data)', fontSize: '0.58rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    background: status === 'loading' ? 'rgba(5,5,5,0.4)' : 'var(--kernia-obsidian)',
                    color: 'var(--kernia-ivory)',
                    border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    padding: '1rem', width: '100%',
                    transition: 'background 0.3s ease',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.background = 'var(--kernia-gold)'; }}
                  onMouseLeave={(e) => { if (status !== 'loading') e.currentTarget.style.background = 'var(--kernia-obsidian)'; }}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
                </button>
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
