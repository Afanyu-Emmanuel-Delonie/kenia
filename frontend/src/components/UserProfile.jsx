import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function UserProfile({ compact = false }) {
  const { user } = useAuth();
  const { info } = useNotification();
  
  if (!user) return null;

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.firstName || user.fullName || user.email)}&backgroundColor=B68D40&textColor=ffffff`;
  
  const handleAvatarClick = () => {
    info(`Profile: ${user.firstName || user.fullName || 'User'} (${user.role?.replace('ROLE_', '') || 'Member'})`);
  };

  if (compact) {
    return (
      <div onClick={handleAvatarClick} style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        cursor: 'pointer', padding: '0.5rem', borderRadius: '4px',
        transition: 'background 0.2s',
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(182,141,64,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        
        <img src={avatarUrl} alt="Avatar" style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '2px solid #B68D40',
        }} />
        
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
            fontWeight: 500, color: '#050505', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user.firstName || user.fullName?.split(' ')[0] || 'User'}
          </p>
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem',
            color: '#B68D40', margin: 0, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {user.role?.replace('ROLE_', '') || 'Member'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      background: '#fff', border: '1px solid rgba(182,141,64,0.2)',
      borderRadius: '8px', padding: '1rem',
    }}>
      <img src={avatarUrl} alt="Profile" style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '3px solid #B68D40',
      }} />
      
      <div>
        <h3 style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem',
          fontWeight: 600, color: '#050505', margin: 0,
        }}>
          {user.firstName || user.fullName || 'User'}
        </h3>
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem',
          color: '#B68D40', margin: '0.25rem 0 0 0',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {user.role?.replace('ROLE_', '') || 'Member'}
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
          color: '#666', margin: '0.25rem 0 0 0',
        }}>
          {user.email}
        </p>
      </div>
    </div>
  );
}