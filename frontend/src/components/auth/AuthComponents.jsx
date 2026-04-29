import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

// ── Shared base styles ────────────────────────────────────────────────────
export const inputStyle = {
  width: '100%', padding: '0.8rem 1rem', borderRadius: '0',
  fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', fontWeight: 300,
  background: 'transparent', color: '#050505', border: 'none',
  borderBottom: '1px solid rgba(5,5,5,0.15)', outline: 'none',
  transition: 'border-color 0.3s', letterSpacing: '0.02em',
};

export const labelStyle = {
  fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', color: '#666',
  letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem',
};

// ── Page wrapper ──────────────────────────────────────────────────────────
export function AuthLayout({ children, locked = false }) {
  return (
    <div style={{
      ...(locked ? { height: '100vh', overflow: 'hidden' } : { minHeight: '100vh' }),
      background: '',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      width: '100%',
      overflowX: 'hidden',
      scrollbarGutter: 'stable',
      padding: locked ? '1.5rem' : '2.5rem 1.5rem',
    }}>
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600,
        color: '#050505', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.3rem',
      }}>
        Kenia
      </h1>
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.52rem', color: '#B68D40',
        letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '1.75rem',
      }}>
        Atelier · Management
      </p>

      <div style={{
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        {children}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '28px', height: '1px', background: 'rgba(182,141,64,0.3)' }} />
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.48rem', color: '#ccc', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Est. 2024
        </p>
        <div style={{ width: '28px', height: '1px', background: 'rgba(182,141,64,0.3)' }} />
      </div>
    </div>
  );
}

// ── White card ────────────────────────────────────────────────────────────
export function AuthCard({ label, children }) {
  return (
    <div style={{
      width: '100%', maxWidth: '460px', background: '#fff',
      border: '1px solid rgba(182,141,64,0.18)', borderRadius: '4px', padding: '2rem 2.5rem',
    }}>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', color: '#B68D40',
        letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Text / email input ────────────────────────────────────────────────────
export function AuthInput({ label, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={inputStyle}
        onFocus={(e) => (e.target.style.borderBottomColor = '#B68D40')}
        onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(5,5,5,0.15)')} />
    </div>
  );
}

// ── Select input ──────────────────────────────────────────────────────────
export function AuthSelect({ label, children, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select {...props} style={{
        ...inputStyle, cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23B68D40'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.25rem center', paddingRight: '1.5rem',
      }}
        onFocus={(e) => (e.target.style.borderBottomColor = '#B68D40')}
        onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(5,5,5,0.15)')}>
        {children}
      </select>
    </div>
  );
}

// ── Password input with eye toggle ────────────────────────────────────────
export function AuthPasswordInput({ label, value, onChange, placeholder, required, minLength }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder={placeholder} required={required} minLength={minLength}
          style={{ ...inputStyle, paddingRight: '2.5rem' }}
          onFocus={(e) => (e.target.style.borderBottomColor = '#B68D40')}
          onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(5,5,5,0.15)')} />
        <button type="button" onClick={() => setShow(!show)} style={{
          position: 'absolute', right: '0.25rem', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#999',
          display: 'flex', alignItems: 'center', padding: '0.25rem',
        }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────
export function AuthSubmitButton({ loading, label, loadingLabel = 'Please wait…' }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '0.85rem', marginTop: '0.25rem',
      background: '#050505', color: '#FCFCFA', border: 'none', borderRadius: '2px',
      cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
      fontSize: '0.68rem', fontWeight: 400, letterSpacing: '0.2em',
      textTransform: 'uppercase', opacity: loading ? 0.6 : 1, transition: 'background 0.25s',
    }}
      onMouseEnter={(e) => { if (!loading) e.target.style.background = '#B68D40'; }}
      onMouseLeave={(e) => { if (!loading) e.target.style.background = '#050505'; }}>
      {loading ? loadingLabel : label}
    </button>
  );
}

// ── Social buttons ────────────────────────────────────────────────────────
function SocialBtn({ icon, label }) {
  return (
    <button type="button" style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0.5rem', padding: '0.7rem 1rem', background: '#fff',
      border: '1px solid rgba(5,5,5,0.1)', borderRadius: '2px', cursor: 'pointer',
      fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 400,
      color: '#333', transition: 'border-color 0.2s, background 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#B68D40'; e.currentTarget.style.background = '#FCFCFA'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(5,5,5,0.1)'; e.currentTarget.style.background = '#fff'; }}>
      {icon}<span>{label}</span>
    </button>
  );
}

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#050505">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export function SocialAuth() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <SocialBtn label="Google" icon={<GoogleIcon />} />
      <SocialBtn label="Apple" icon={<AppleIcon />} />
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────
export function AuthDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(5,5,5,0.08)' }} />
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5rem', color: '#bbb', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        or continue with email
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(5,5,5,0.08)' }} />
    </div>
  );
}

// ── Field error ────────────────────────────────────────────────────────────
export function AuthFieldError({ message }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#EF4444',
      marginTop: '0.25rem', marginBottom: '0.5rem',
      minHeight: '1rem', visibility: message ? 'visible' : 'hidden',
    }}>
      {message || '\u00A0'}
    </p>
  );
}

// ── Footer link ───────────────────────────────────────────────────────────
export function AuthFooterLink({ text, linkLabel, to }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#666',
      textAlign: 'center', marginTop: '1rem',
    }}>
      {text}{' '}
      <Link to={to} style={{
        color: '#B68D40', textDecoration: 'none', fontWeight: 500,
      }}>
        {linkLabel}
      </Link>
    </p>
  );
}
