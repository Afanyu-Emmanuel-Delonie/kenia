import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Shield, Globe, ChevronRight, Check, Camera } from 'lucide-react';
import { API_BASE } from '../../utils/urls';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem', boxSizing: 'border-box',
  background: '#fff', border: '1px solid rgba(5,5,5,0.12)', borderRadius: '8px',
  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#050505',
  outline: 'none', fontWeight: 400,
};
const labelStyle = {
  fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.44rem', color: '#555',
  letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block',
  marginBottom: '0.4rem', fontWeight: 500,
};

function Section({ title, sub, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(5,5,5,0.06)' }}>
        <p style={{ fontFamily: F.ui, fontSize: '0.88rem', fontWeight: 700, color: '#050505' }}>{title}</p>
        {sub && <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#888', marginTop: '0.15rem', fontWeight: 400 }}>{sub}</p>}
      </div>
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(5,5,5,0.05)' }}>
      <div>
        <p style={{ fontFamily: F.ui, fontSize: '0.82rem', fontWeight: 600, color: '#050505' }}>{label}</p>
        {sub && <p style={{ fontFamily: F.ui, fontSize: '0.7rem', color: '#888', marginTop: '0.1rem', fontWeight: 400 }}>{sub}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} style={{
        width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
        background: checked ? '#050505' : '#e5e5e5', transition: 'background 0.2s',
        position: 'relative', flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(5,5,5,0.2)',
        }} />
      </button>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
      padding: '0.65rem 0.85rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: active ? '#050505' : 'transparent',
      color: active ? '#FCFCFA' : '#555',
      fontFamily: F.ui, fontSize: '0.78rem', fontWeight: active ? 600 : 400,
      transition: 'all 0.15s', textAlign: 'left',
    }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(5,5,5,0.05)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <Icon size={14} style={{ flexShrink: 0 }} />
      {label}
      {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
    </button>
  );
}

const TABS = [
  { id: 'profile',  label: 'Profile',      icon: User   },
  { id: 'notifs',   label: 'Notifications', icon: Bell   },
  { id: 'security', label: 'Security',      icon: Shield },
  { id: 'system',   label: 'System',        icon: Globe  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab]   = useState('profile');
  const [saved, setSaved] = useState(false);
  const avatarRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [profile, setProfile] = useState({
    fullName: user?.fullName ?? '', email: user?.email ?? '', phone: '', bio: '',
  });
  const [notifs, setNotifs] = useState({
    lowStock: true, newOrder: true, newInquiry: true, orderShipped: false,
  });

  const setP = (k) => (e) => setProfile((f) => ({ ...f, [k]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div>
        <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Account</p>
        <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.25rem', alignItems: 'start' }} className="settings-grid">

        {/* ── Sidebar nav ── */}
        <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px', padding: '0.75rem', boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}>
          {TABS.map((t) => (
            <NavItem key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {tab === 'profile' && (
            <>
              {/* Avatar card */}
              <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(5,5,5,0.04)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f0f0ee', border: '2px solid rgba(182,141,64,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: F.display, fontSize: '2rem', fontWeight: 600, color: '#050505' }}>{user?.fullName?.[0] ?? 'K'}</span>
                    }
                  </div>
                  <button onClick={() => avatarRef.current?.click()} style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#050505', border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <Camera size={11} style={{ color: '#fff' }} />
                  </button>
                  <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
                <div>
                  <p style={{ fontFamily: F.ui, fontSize: '1rem', fontWeight: 700, color: '#050505' }}>{user?.fullName}</p>
                  <p style={{ fontFamily: F.ui, fontSize: '0.75rem', color: '#888', marginTop: '0.1rem' }}>{user?.email}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.4rem', fontFamily: F.data, fontSize: '0.42rem', color: '#B68D40', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.18rem 0.55rem', background: 'rgba(182,141,64,0.08)', borderRadius: '4px', border: '1px solid rgba(182,141,64,0.2)', fontWeight: 700 }}>
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                  <p style={{ fontFamily: F.ui, fontSize: '0.68rem', color: '#bbb', marginTop: '0.5rem' }}>Click the camera icon to update your photo</p>
                </div>
              </div>

              <Section title="Personal Information" sub="Update your name and contact details">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="settings-2col">
                  <Field label="Full Name">
                    <input value={profile.fullName} onChange={setP('fullName')} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#050505')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                  </Field>
                  <Field label="Email">
                    <input value={profile.email} onChange={setP('email')} type="email" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#050505')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                  </Field>
                </div>
                <Field label="Phone">
                  <input value={profile.phone} onChange={setP('phone')} placeholder="+1 234 567 8900" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#050505')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                </Field>
                <Field label="Bio">
                  <textarea value={profile.bio} onChange={setP('bio')} rows={3} placeholder="A short bio about your role…"
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                    onFocus={(e) => (e.target.style.borderColor = '#050505')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                </Field>
              </Section>
            </>
          )}

          {tab === 'notifs' && (
            <Section title="Notifications" sub="Choose what alerts you receive">
              <Toggle label="Low stock alerts" sub="Notify when materials fall below threshold" checked={notifs.lowStock} onChange={(v) => setNotifs((n) => ({ ...n, lowStock: v }))} />
              <Toggle label="New orders" sub="Notify when a customer places an order" checked={notifs.newOrder} onChange={(v) => setNotifs((n) => ({ ...n, newOrder: v }))} />
              <Toggle label="New inquiries" sub="Notify when a customer sends an inquiry" checked={notifs.newInquiry} onChange={(v) => setNotifs((n) => ({ ...n, newInquiry: v }))} />
              <Toggle label="Order shipped" sub="Notify when an order status changes to shipped" checked={notifs.orderShipped} onChange={(v) => setNotifs((n) => ({ ...n, orderShipped: v }))} />
            </Section>
          )}

          {tab === 'security' && (
            <Section title="Security" sub="Manage your password and access">
              <Field label="Current Password">
                <input type="password" placeholder="••••••••" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#050505')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="settings-2col">
                <Field label="New Password">
                  <input type="password" placeholder="Min. 8 characters" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#050505')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                </Field>
                <Field label="Confirm Password">
                  <input type="password" placeholder="Repeat new password" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#050505')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
                </Field>
              </div>
              <div style={{ padding: '0.85rem 1rem', background: '#f9f9f7', borderRadius: '8px', border: '1px solid rgba(5,5,5,0.07)' }}>
                <p style={{ fontFamily: F.data, fontSize: '0.44rem', color: '#aaa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Active Sessions</p>
                <p style={{ fontFamily: F.ui, fontSize: '0.78rem', color: '#050505', fontWeight: 600 }}>Current device</p>
                <p style={{ fontFamily: F.ui, fontSize: '0.7rem', color: '#888', marginTop: '0.1rem' }}>Last active: just now</p>
              </div>
            </Section>
          )}

          {tab === 'system' && (
            <Section title="System" sub="Application and API configuration">
              <Field label="API Base URL">
                <input defaultValue={API_BASE} readOnly style={{ ...inputStyle, background: '#f9f9f7', color: '#888', cursor: 'default' }} />
              </Field>
              <Field label="Application Version">
                <input defaultValue="Zyra Atelier v1.0.0" readOnly style={{ ...inputStyle, background: '#f9f9f7', color: '#888', cursor: 'default' }} />
              </Field>
              <div style={{ padding: '0.85rem 1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #d9770633' }}>
                <p style={{ fontFamily: F.data, fontSize: '0.44rem', color: '#d97706', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 700 }}>Danger Zone</p>
                <p style={{ fontFamily: F.ui, fontSize: '0.75rem', color: '#555', marginBottom: '0.75rem' }}>These actions are irreversible. Proceed with caution.</p>
                <button style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
                  fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600,
                  background: '#fef2f2', color: '#dc2626', border: '1px solid #dc262633',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
                >
                  Clear local cache
                </button>
              </div>
            </Section>
          )}

          {tab !== 'system' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: saved ? '#16a34a' : '#050505', color: '#FCFCFA',
                fontFamily: F.ui, fontSize: '0.78rem', fontWeight: 700, transition: 'background 0.2s',
              }}
                onMouseEnter={(e) => { if (!saved) e.currentTarget.style.background = '#B68D40'; }}
                onMouseLeave={(e) => { if (!saved) e.currentTarget.style.background = '#050505'; }}
              >
                {saved ? <><Check size={13} /> Saved</> : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: #bbb; }
        @media(max-width:768px){
          .settings-grid { grid-template-columns: 1fr !important; }
          .settings-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
