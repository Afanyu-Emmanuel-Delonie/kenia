import { useState, useEffect } from 'react';
import { getInquiries, getOpenInquiries } from '../../api/services';
import {
  MessageSquare, Mail, Phone, Clock, CheckCircle,
  ChevronDown, ChevronUp, Search,
} from 'lucide-react';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #f4f4f4', borderTopColor: '#050505', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StatusBadge({ status }) {
  const open = status === 'OPEN';
  return (
    <span style={{
      fontFamily: F.data, fontSize: '0.6875rem', fontWeight: 700,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      padding: '0.22rem 0.6rem', borderRadius: '4px',
      background: open ? '#fffbeb' : '#f0fdf4',
      color: open ? '#d97706' : '#16a34a',
      border: `1px solid ${open ? '#d9770633' : '#16a34a33'}`,
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: open ? '#f59e0b' : '#22c55e', display: 'inline-block' }} />
      {open ? 'Open' : 'Closed'}
    </span>
  );
}

function ReplyButtons({ inquiry }) {
  const greeting = `Hi ${inquiry.senderName},\n\nThank you for your interest in *${inquiry.productTitle}*.\n\n`;

  const openWhatsApp = () => {
    if (!inquiry.senderPhone) return alert('No phone number on this inquiry.');
    const phone = inquiry.senderPhone.replace(/\D/g, '');
    const text = encodeURIComponent(`${greeting}Regarding your inquiry:\n"${inquiry.message}"\n\nKenia Atelier`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Re: Your inquiry about ${inquiry.productTitle}`);
    const body = encodeURIComponent(`${greeting}Regarding your inquiry:\n"${inquiry.message}"\n\nKenia Atelier`);
    window.open(`mailto:${inquiry.senderEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
      <button onClick={openWhatsApp} style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer',
        fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600,
        background: '#25D366', color: '#fff', border: 'none', transition: 'opacity 0.15s',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        title={!inquiry.senderPhone ? 'No phone number available' : ''}
      >
        <Phone size={13} /> Reply on WhatsApp
      </button>
      <button onClick={openEmail} style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer',
        fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600,
        background: '#050505', color: '#fff', border: 'none', transition: 'opacity 0.15s',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Mail size={13} /> Reply via Email
      </button>
    </div>
  );
}

function InquiryRow({ inquiry, expanded, onToggle }) {
  const date = new Date(inquiry.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = new Date(inquiry.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const open = inquiry.status === 'OPEN';

  return (
    <div style={{
      border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px',
      background: '#fff', boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
      overflow: 'hidden', transition: 'border-color 0.15s',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(5,5,5,0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(5,5,5,0.09)')}
    >
      {/* Row header */}
      <div onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.25rem', cursor: 'pointer',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px',
          background: open ? '#fffbeb' : '#f0fdf4',
          border: `1px solid ${open ? '#d9770633' : '#16a34a33'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MessageSquare size={15} style={{ color: open ? '#d97706' : '#16a34a' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: F.ui, fontSize: '0.82rem', fontWeight: 700, color: '#050505' }}>
              {inquiry.senderName}
            </p>
            <StatusBadge status={inquiry.status} />
          </div>
          <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#666', fontWeight: 500, marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {inquiry.productTitle} — {inquiry.message.slice(0, 80)}{inquiry.message.length > 80 ? '…' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }} className="inq-date">
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', fontWeight: 500, letterSpacing: '0.05em' }}>{date}</p>
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#bbb', letterSpacing: '0.05em' }}>{time}</p>
          </div>
          {expanded ? <ChevronUp size={15} style={{ color: '#888' }} /> : <ChevronDown size={15} style={{ color: '#888' }} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(5,5,5,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', padding: '0.85rem 0 0.75rem' }} className="inq-meta">
            {[
              { icon: Mail,  label: 'Email',   value: inquiry.senderEmail },
              { icon: Phone, label: 'Phone',   value: inquiry.senderPhone || '—' },
              { icon: Clock, label: 'Product', value: inquiry.productTitle },
              { icon: inquiry.status === 'OPEN' ? Clock : CheckCircle, label: 'Status', value: inquiry.status },
            ].map((m) => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <m.icon size={12} style={{ color: '#aaa', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.label}</p>
                  <p style={{ fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600, color: '#050505' }}>{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f9f7', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '0.25rem' }}>
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Message</p>
            <p style={{ fontFamily: F.ui, fontSize: '0.875rem', fontWeight: 500, color: '#222', lineHeight: 1.6 }}>{inquiry.message}</p>
          </div>

          {inquiry.reply && (
            <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '0.85rem 1rem', marginTop: '0.5rem', border: '1px solid #22c55e22' }}>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#16a34a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Previous Reply</p>
              <p style={{ fontFamily: F.ui, fontSize: '0.875rem', fontWeight: 500, color: '#222', lineHeight: 1.6 }}>{inquiry.reply}</p>
            </div>
          )}

          <ReplyButtons inquiry={inquiry} />
        </div>
      )}
    </div>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('ALL');
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => {
    const fn = filter === 'OPEN' ? getOpenInquiries : getInquiries;
    setLoading(true);
    fn().then((r) => setInquiries(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));
  }, [filter]);

  const openCount   = inquiries.filter((i) => i.status === 'OPEN').length;
  const closedCount = inquiries.filter((i) => i.status === 'CLOSED').length;

  const visible = inquiries.filter((inq) => {
    if (filter === 'CLOSED' && inq.status !== 'CLOSED') return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inq.senderName.toLowerCase().includes(q) ||
      inq.senderEmail.toLowerCase().includes(q) ||
      inq.productTitle?.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.3rem' }}>Customer</p>
          <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Inquiries</h1>
        </div>
        <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.1em', fontWeight: 500 }}>{inquiries.length} total</p>
      </div>

      {/* ── Status stat pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ALL',    label: 'All',    count: inquiries.length, icon: MessageSquare, color: '#050505' },
          { key: 'OPEN',   label: 'Open',   count: openCount,        icon: Clock,         color: '#d97706' },
          { key: 'CLOSED', label: 'Closed', count: closedCount,      icon: CheckCircle,   color: '#16a34a' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => { setFilter(s.key); setExpanded(null); }} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
              background: filter === s.key ? '#050505' : '#fff',
              border: filter === s.key ? '1px solid #050505' : '1px solid rgba(5,5,5,0.09)',
              boxShadow: '0 1px 4px rgba(5,5,5,0.04)', transition: 'all 0.15s',
            }}>
              <Icon size={12} style={{ color: filter === s.key ? '#FCFCFA' : s.color }} />
              <span style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: filter === s.key ? '#FCFCFA' : '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.count}</span>
              <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: filter === s.key ? 'rgba(252,252,250,0.7)' : '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: '340px' }}>
        <Search size={12} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, product, message…"
          style={{
            width: '100%', paddingLeft: '2.1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem',
            background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '8px',
            fontFamily: F.ui, fontSize: '0.78rem', color: '#050505', outline: 'none',
            boxSizing: 'border-box', fontWeight: 400, boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#050505')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.1)')}
        />
      </div>

      {/* ── List ── */}
      {loading ? <Spinner /> : (
        visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <MessageSquare size={32} style={{ color: '#ddd', margin: '0 auto 0.75rem' }} />
            <p style={{ fontFamily: F.ui, fontSize: '0.85rem', color: '#aaa', fontWeight: 500 }}>No inquiries found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {visible.map((inq) => (
              <InquiryRow
                key={inq.id}
                inquiry={inq}
                expanded={expanded === inq.id}
                onToggle={() => setExpanded(expanded === inq.id ? null : inq.id)}
              />
            ))}
          </div>
        )
      )}

      <style>{`
        input::placeholder { color: #bbb; }
        @media(max-width:640px){
          .inq-meta { grid-template-columns: 1fr !important; }
          .inq-date { display: none !important; }
        }
      `}</style>
    </div>
  );
}
