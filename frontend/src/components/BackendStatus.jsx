import { useState, useEffect } from 'react';
import { verifyBackend } from '../api/services';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function BackendStatus({ compact = true }) {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const { error, success } = useNotification();
  const { user } = useAuth();

  const checkBackend = async () => {
    if (!user) {
      setStatus('disconnected');
      return;
    }
    
    setStatus('checking');
    try {
      await verifyBackend();
      setStatus('connected');
      setLastCheck(new Date());
    } catch (err) {
      // Only show error notification for non-auth errors
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setStatus('disconnected');
        setLastCheck(new Date());
        if (!compact) error('Backend connection failed');
      } else {
        setStatus('disconnected');
        setLastCheck(new Date());
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkBackend();
      const interval = setInterval(checkBackend, 60000); // Check every 60s instead of 30s
      return () => clearInterval(interval);
    } else {
      setStatus('disconnected');
    }
  }, [user]);

  const statusColors = {
    connected: { color: '#22c55e', bg: '#f0fdf4' },
    disconnected: { color: '#ef4444', bg: '#fef2f2' },
    checking: { color: '#f59e0b', bg: '#fffbeb' },
  };

  const statusText = {
    connected: 'Connected',
    disconnected: 'Offline',
    checking: 'Checking...',
  };

  const Icon = status === 'connected' ? Wifi : status === 'checking' ? RefreshCw : WifiOff;

  if (compact) {
    return (
      <div onClick={user ? checkBackend : undefined} style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem', borderRadius: '4px', 
        cursor: user ? 'pointer' : 'default',
        background: statusColors[status].bg,
        border: `1px solid ${statusColors[status].color}33`,
        transition: 'all 0.2s',
      }}
        title={user ? `Backend ${statusText[status]} - Click to refresh` : 'Login required'}>
        
        <Icon size={14} style={{ 
          color: statusColors[status].color,
          animation: status === 'checking' ? 'spin 1s linear infinite' : 'none'
        }} />
        
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem',
          color: statusColors[status].color, textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {user ? statusText[status] : 'Auth Required'}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fff', border: '1px solid rgba(182,141,64,0.2)',
      borderRadius: '8px', padding: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon size={18} style={{ 
          color: statusColors[status].color,
          animation: status === 'checking' ? 'spin 1s linear infinite' : 'none'
        }} />
        
        <div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
            fontWeight: 500, color: '#050505', margin: 0,
          }}>
            Backend Status: {statusText[status]}
          </p>
          {lastCheck && (
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem',
              color: '#666', margin: '0.25rem 0 0 0',
            }}>
              Last check: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      
      <button onClick={checkBackend} style={{
        background: 'none', border: '1px solid rgba(182,141,64,0.3)',
        borderRadius: '4px', padding: '0.5rem 0.75rem', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
        color: '#B68D40', transition: 'all 0.2s',
      }}
        onMouseEnter={(e) => {
          e.target.style.background = '#B68D40';
          e.target.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'none';
          e.target.style.color = '#B68D40';
        }}>
        Refresh
      </button>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}