import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { 
  Menu, Search, Bell, User, ChevronDown, 
  Settings, LogOut, HelpCircle 
} from 'lucide-react';

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { openMobile } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Low stock alert: Antique Gold', time: '2m ago', unread: true },
    { id: 2, text: 'New order ORD-2026-0005 received', time: '15m ago', unread: true },
    { id: 3, text: 'KRN-2026-014 moved to QA stage', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header style={{
      height: '64px',
      background: '#fff',
      borderBottom: '1px solid rgba(5,5,5,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      
      {/* Left: Mobile menu + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        
        {/* Mobile-only menu button */}
        <button
          onClick={openMobile}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,5,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <Menu size={20} style={{ color: '#050505' }} />
        </button>

        {/* Search */}
        <div style={{
          position: 'relative',
          maxWidth: '400px',
          width: '100%',
        }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#888' 
            }} 
          />
          <input
            type="text"
            placeholder="Search products, orders, materials..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.5rem',
              border: '1px solid rgba(5,5,5,0.12)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              background: '#fafafa',
              transition: 'border-color 0.15s, background 0.15s',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B68D40';
              e.currentTarget.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(5,5,5,0.12)';
              e.currentTarget.style.background = '#fafafa';
            }}
          />
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,5,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Bell size={18} style={{ color: '#050505' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.625rem',
                fontWeight: 600,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 39,
                }}
                onClick={() => setNotificationsOpen(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '320px',
                background: '#fff',
                border: '1px solid rgba(5,5,5,0.08)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(5,5,5,0.1)',
                zIndex: 40,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid rgba(5,5,5,0.05)',
                }}>
                  <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#050505',
                    margin: 0,
                  }}>
                    Notifications
                  </h3>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderBottom: '1px solid rgba(5,5,5,0.03)',
                        background: notif.unread ? 'rgba(182,141,64,0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,5,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = notif.unread ? 'rgba(182,141,64,0.02)' : 'transparent'}
                    >
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8125rem',
                        color: '#050505',
                        margin: '0 0 0.25rem 0',
                        fontWeight: notif.unread ? 500 : 400,
                      }}>
                        {notif.text}
                      </p>
                      <p style={{
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '0.6875rem',
                        color: '#888',
                        margin: 0,
                      }}>
                        {notif.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '8px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,5,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#B68D40',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={16} style={{ color: '#fff' }} />
            </div>
            <div className="profile-info" style={{ textAlign: 'left' }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#050505',
                margin: 0,
                lineHeight: 1.2,
              }}>
                {user?.fullName || 'User'}
              </p>
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.6875rem',
                color: '#888',
                margin: 0,
                textTransform: 'capitalize',
              }}>
                {user?.role?.toLowerCase() || 'user'}
              </p>
            </div>
            <ChevronDown size={14} style={{ color: '#888' }} />
          </button>

          {/* Profile dropdown menu */}
          {profileOpen && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 39,
                }}
                onClick={() => setProfileOpen(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '200px',
                background: '#fff',
                border: '1px solid rgba(5,5,5,0.08)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(5,5,5,0.1)',
                zIndex: 40,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid rgba(5,5,5,0.05)',
                }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#050505',
                    margin: '0 0 0.125rem 0',
                  }}>
                    {user?.fullName}
                  </p>
                  <p style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.6875rem',
                    color: '#888',
                    margin: 0,
                  }}>
                    {user?.email}
                  </p>
                </div>
                
                {[
                  { icon: Settings, label: 'Settings', action: () => {} },
                  { icon: HelpCircle, label: 'Help & Support', action: () => {} },
                  { icon: LogOut, label: 'Sign Out', action: signOut, danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setProfileOpen(false);
                      item.action();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: item.danger ? '#ef4444' : '#050505',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,5,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .profile-info { display: none !important; }
        }
      `}</style>
    </header>
  );
}