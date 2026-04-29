import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const F = { ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

/**
 * Reusable delete confirmation modal.
 * Props:
 *   title       — e.g. "Delete Material"
 *   description — e.g. "This will permanently remove \"Obsidian Leather\"."
 *   onConfirm   — called when user clicks Delete
 *   onCancel    — called when user cancels or clicks backdrop
 *   loading     — disables buttons while request is in flight
 */
export default function ConfirmDeleteModal({ title, description, onConfirm, onCancel, loading = false }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,5,5,0.55)', backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '400px', margin: '1rem',
        boxShadow: '0 16px 48px rgba(5,5,5,0.18)',
        border: '1px solid rgba(5,5,5,0.08)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#fef2f2', border: '1px solid #dc262633',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <AlertTriangle size={18} style={{ color: '#dc2626' }} />
            </div>
            <div>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#dc2626', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>
                Confirm Delete
              </p>
              <p style={{ fontFamily: F.ui, fontSize: '1.05rem', fontWeight: 700, color: '#050505', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', padding: '0.2rem', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <p style={{
          fontFamily: F.ui, fontSize: '0.875rem', color: '#555',
          lineHeight: 1.6, marginBottom: '1.75rem',
        }}>
          {description}
          {' '}
          <span style={{ fontWeight: 600, color: '#dc2626' }}>This action cannot be undone.</span>
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '8px',
              border: '1px solid rgba(5,5,5,0.12)', background: '#fff',
              color: '#050505', fontFamily: F.ui, fontSize: '0.875rem',
              fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f4')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '8px',
              border: 'none', background: loading ? '#f4f4f4' : '#dc2626',
              color: loading ? '#aaa' : '#fff', fontFamily: F.ui,
              fontSize: '0.875rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#dc2626'; }}
          >
            <AlertTriangle size={14} />
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
