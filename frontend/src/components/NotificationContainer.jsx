import { useNotification } from '../context/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { bg: '#10B981', border: '#059669' },
  error: { bg: '#EF4444', border: '#DC2626' },
  warning: { bg: '#F59E0B', border: '#D97706' },
  info: { bg: '#3B82F6', border: '#2563EB' },
};

function NotificationItem({ notification, onRemove }) {
  const Icon = icons[notification.type];
  const color = colors[notification.type];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      background: '#fff', border: `1px solid ${color.border}`,
      borderRadius: '4px', padding: '1rem', marginBottom: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <Icon size={18} style={{ color: color.bg, marginTop: '0.1rem', flexShrink: 0 }} />
      
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
        color: '#374151', lineHeight: '1.4', margin: 0, flex: 1,
      }}>
        {notification.message}
      </p>
      
      <button onClick={() => onRemove(notification.id)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#9CA3AF', padding: '0.25rem', borderRadius: '2px',
        display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <X size={14} />
      </button>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      <div style={{
        position: 'fixed', top: '1rem', right: '1rem',
        zIndex: 9999, width: '320px', maxWidth: '90vw',
      }}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </>
  );
}