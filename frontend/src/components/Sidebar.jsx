import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard, Package, Layers, ShoppingBag,
  MessageSquare, LogOut, Gem, ChevronLeft, ChevronRight, X, Settings,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { to: '/products',  label: 'Atelier',   icon: Layers },
  { to: '/materials', label: 'Vault',     icon: Gem },
  { to: '/orders',    label: 'Orders',    icon: ShoppingBag },
  { to: '/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/store',     label: 'Catalog',   icon: Package },
  { to: '/settings',  label: 'Settings',  icon: Settings },
];

const EXPANDED_W = 220;
const COLLAPSED_W = 64;

function NavItem({ to, label, icon: Icon, collapsed }) {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }} title={collapsed ? label : undefined}>
      {({ isActive }) => (
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : '0.75rem',
          padding: collapsed ? '0.7rem 0' : '0.65rem 1.75rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderLeft: isActive ? '2px solid #B68D40' : '2px solid transparent',
          background: isActive ? 'rgba(182,141,64,0.06)' : 'transparent',
          cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
          position: 'relative',
        }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderLeftColor = 'rgba(182,141,64,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }
          }}
        >
          <Icon size={15} style={{ color: isActive ? '#B68D40' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          {!collapsed && (
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
              fontWeight: isActive ? 400 : 300,
              color: isActive ? '#FCFCFA' : 'rgba(255,255,255,0.38)',
              letterSpacing: '0.02em', whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}>
              {label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}

function SidebarInner({ collapsed, onClose }) {
  const { signOut } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();

  const handleSignOut = () => { signOut(); navigate('/login'); };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#080808',
      borderRight: '1px solid rgba(182,141,64,0.1)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Brand ── */}
      <div style={{
        padding: collapsed ? '1.5rem 0' : '1.5rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '72px',
      }}>
        {collapsed ? (
          /* Collapsed: gold K monogram */
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'rgba(182,141,64,0.1)',
            border: '1px solid rgba(182,141,64,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.25rem', fontWeight: 600,
              color: '#B68D40', lineHeight: 1, userSelect: 'none',
            }}>K</span>
          </div>
        ) : (
          /* Expanded: full brand block */
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '7px',
              background: 'rgba(182,141,64,0.1)',
              border: '1px solid rgba(182,141,64,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.1rem', fontWeight: 600,
                color: '#B68D40', lineHeight: 1, userSelect: 'none',
              }}>K</span>
            </div>
            <div>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem',
                fontWeight: 600, color: '#FCFCFA', letterSpacing: '-0.01em', lineHeight: 1,
                marginBottom: '0.2rem',
              }}>Kenia</p>
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5rem',
                color: 'rgba(182,141,64,0.7)', letterSpacing: '0.25em', textTransform: 'uppercase',
              }}>Atelier</p>
            </div>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        {onClose ? (
          <button onClick={onClose} style={btnReset}>
            <X size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </button>
        ) : !collapsed && (
          <button onClick={toggle} title="Collapse" style={{
            ...btnReset,
            width: '26px', height: '26px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'background 0.15s', flexShrink: 0,
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182,141,64,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            <ChevronLeft size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, paddingTop: '1.25rem', overflowY: 'auto' }}>
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* ── Sign out ── */}
      <div style={{
        padding: collapsed ? '1.25rem 0' : '1.25rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column',
        alignItems: collapsed ? 'center' : 'flex-start', gap: '0.5rem',
      }}>
        {collapsed && (
          <button onClick={toggle} title="Expand sidebar" style={{
            ...btnReset,
            width: '32px', height: '32px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '0.5rem', transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182,141,64,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
        )}
        <button onClick={handleSignOut} title={collapsed ? 'Sign out' : undefined} style={{
          ...btnReset, display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : '0.6rem',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
          fontWeight: 300, color: 'rgba(255,255,255,0.22)',
          letterSpacing: '0.02em', transition: 'color 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
        >
          <LogOut size={14} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );
}

const btnReset = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

export default function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();
  const width = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100vh',
        width: `${width}px`, zIndex: 40,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'none',
      }} className="sidebar-desktop">
        <SidebarInner collapsed={collapsed} />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: 'fixed', inset: 0, zIndex: 49,
            background: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100vh',
        width: `${EXPANDED_W}px`, zIndex: 50,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'none',
      }} className="sidebar-mobile">
        <SidebarInner collapsed={false} onClose={closeMobile} />
      </aside>

      {/* Responsive visibility via style tag */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
          .sidebar-mobile  { display: none   !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none   !important; }
          .sidebar-mobile  { display: block  !important; }
        }
      `}</style>
    </>
  );
}
