import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/services';
import {
  ShoppingBag, Clock, CheckCircle, Truck, Package,
  XCircle, Search, ChevronDown, ChevronUp, Phone, Mail,
  MapPin, ArrowRight,
} from 'lucide-react';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const STATUS_CFG = {
  PENDING:   { label: 'Pending',   color: '#d97706', bg: '#fffbeb', border: '#d9770633', dot: '#f59e0b', icon: Clock       },
  CONFIRMED: { label: 'Confirmed', color: '#2563eb', bg: '#eff6ff', border: '#2563eb33', dot: '#3b82f6', icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',   color: '#7c3aed', bg: '#f5f3ff', border: '#7c3aed33', dot: '#8b5cf6', icon: Truck       },
  DELIVERED: { label: 'Delivered', color: '#16a34a', bg: '#f0fdf4', border: '#16a34a33', dot: '#22c55e', icon: Package     },
  CANCELLED: { label: 'Cancelled', color: '#dc2626', bg: '#fef2f2', border: '#dc262633', dot: '#ef4444', icon: XCircle     },
};

const STATUS_FLOW = {
  PENDING:   'CONFIRMED',
  CONFIRMED: 'SHIPPED',
  SHIPPED:   'DELIVERED',
};

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #f4f4f4', borderTopColor: '#050505', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  const Icon = c.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.22rem 0.65rem', borderRadius: '4px',
      background: c.bg, border: `1px solid ${c.border}`,
      fontFamily: F.data, fontSize: '0.44rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: c.color, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <Icon size={9} />{c.label}
    </span>
  );
}

function ActionButtons({ order, onUpdate }) {
  const next = STATUS_FLOW[order.status];
  const nextCfg = next ? STATUS_CFG[next] : null;

  const openWhatsApp = () => {
    const phone = order.customerPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hi ${order.customerName},\n\nYour Zyra order *${order.reference}* has been ${next === 'CONFIRMED' ? 'confirmed' : next === 'SHIPPED' ? 'shipped' : 'updated'}.\n\nThank you for your order!\n\nZyra Atelier`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Your Zyra Order ${order.reference} — Update`);
    const body = encodeURIComponent(
      `Hi ${order.customerName},\n\nYour order ${order.reference} status has been updated.\n\nThank you,\nZyra Atelier`
    );
    window.open(`mailto:${order.customerEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {next && (
        <button onClick={() => onUpdate(order.id, next)} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer',
          fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 700,
          background: '#050505', color: '#FCFCFA', border: 'none',
          transition: 'background 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#B68D40')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#050505')}
        >
          <ArrowRight size={12} /> Mark as {nextCfg.label}
        </button>
      )}
      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
        <button onClick={() => onUpdate(order.id, 'CANCELLED')} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer',
          fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600,
          background: '#fef2f2', color: '#dc2626', border: '1px solid #dc262633',
          transition: 'background 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
        >
          <XCircle size={12} /> Cancel
        </button>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
        <button onClick={openWhatsApp} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 0.9rem', borderRadius: '6px', cursor: 'pointer',
          fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600,
          background: '#25D366', color: '#fff', border: 'none', transition: 'opacity 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Phone size={12} /> WhatsApp
        </button>
        <button onClick={openEmail} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 0.9rem', borderRadius: '6px', cursor: 'pointer',
          fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600,
          background: '#050505', color: '#fff', border: 'none', transition: 'opacity 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Mail size={12} /> Email
        </button>
      </div>
    </div>
  );
}

function OrderRow({ order, expanded, onToggle, onUpdate }) {
  const date = new Date(order.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = new Date(order.placedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const c = STATUS_CFG[order.status] ?? STATUS_CFG.PENDING;

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
          background: c.bg, border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <c.icon size={15} style={{ color: c.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.1em', fontWeight: 700 }}>
              {order.reference}
            </p>
            <StatusBadge status={order.status} />
          </div>
          <p style={{ fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700, color: '#050505', marginTop: '0.15rem' }}>
            {order.customerName}
            <span style={{ fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 400, color: '#888', marginLeft: '0.5rem' }}>
              {order.listing?.title ?? '—'}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }} className="ord-meta">
            <p style={{ fontFamily: F.ui, fontSize: '0.88rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.02em' }}>
              {order.currency} {parseFloat(order.totalAmount).toLocaleString()}
            </p>
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.05em', marginTop: '0.1rem' }}>
              {date} · {time}
            </p>
          </div>
          {expanded ? <ChevronUp size={15} style={{ color: '#888' }} /> : <ChevronDown size={15} style={{ color: '#888' }} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(5,5,5,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', padding: '1rem 0 0.75rem' }} className="ord-detail-grid">
            {[
              { icon: Mail,    label: 'Email',    value: order.customerEmail },
              { icon: Phone,   label: 'Phone',    value: order.customerPhone },
              { icon: MapPin,  label: 'Delivery', value: order.deliveryMethod },
              { icon: MapPin,  label: 'Address',  value: [order.deliveryAddress, order.deliveryCity, order.deliveryCountry].filter(Boolean).join(', ') || '—' },
              { icon: Package, label: 'Bag',      value: order.listing?.title ?? '—' },
              { icon: ShoppingBag, label: 'Amount', value: `${order.currency} ${parseFloat(order.totalAmount).toLocaleString()}` },
            ].map((m) => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <m.icon size={12} style={{ color: '#aaa', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.label}</p>
                  <p style={{ fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600, color: '#050505' }}>{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          {order.notes && (
            <div style={{ background: '#f9f9f7', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.25rem' }}>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Notes</p>
              <p style={{ fontFamily: F.ui, fontSize: '0.875rem', fontWeight: 500, color: '#222', lineHeight: 1.6 }}>{order.notes}</p>
            </div>
          )}

          <ActionButtons order={order} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');
  const [search, setSearch]     = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    getOrders().then((r) => setOrders(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatus(id, { status });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  };

  const counts = Object.fromEntries(
    Object.keys(STATUS_CFG).map((s) => [s, orders.filter((o) => o.status === s).length])
  );

  const visible = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.reference?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerEmail?.toLowerCase().includes(q) ||
      o.listing?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Commerce</p>
          <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Orders</h1>
        </div>
        <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.1em', fontWeight: 500 }}>{orders.length} total</p>
      </div>

      {/* ── Status stat pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_CFG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = counts[key] ?? 0;
          return (
            <button key={key} onClick={() => setFilter(filter === key ? 'ALL' : key)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
              background: filter === key ? '#050505' : '#fff',
              border: filter === key ? '1px solid #050505' : '1px solid rgba(5,5,5,0.09)',
              boxShadow: '0 1px 4px rgba(5,5,5,0.04)', transition: 'all 0.15s',
            }}>
              <Icon size={12} style={{ color: filter === key ? '#FCFCFA' : cfg.color }} />
              <span style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: filter === key ? '#FCFCFA' : '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>{count}</span>
              <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: filter === key ? 'rgba(252,252,250,0.7)' : '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Search + filter ── */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
          <Search size={12} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reference, customer…"
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
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">All Status</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* ── List ── */}
      {loading ? <Spinner /> : (
        visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <ShoppingBag size={32} style={{ color: '#ddd', margin: '0 auto 0.75rem' }} />
            <p style={{ fontFamily: F.ui, fontSize: '0.85rem', color: '#aaa', fontWeight: 500 }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {visible.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                expanded={expanded === o.id}
                onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
                onUpdate={updating ? () => {} : handleUpdate}
              />
            ))}
          </div>
        )
      )}

      <style>{`
        input::placeholder { color: #bbb; }
        @media(max-width:640px){
          .ord-meta { display: none !important; }
          .ord-detail-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:400px){
          .ord-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const selectStyle = {
  padding: '0.6rem 0.85rem', background: '#fff', border: '1px solid rgba(5,5,5,0.1)',
  borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#050505',
  outline: 'none', cursor: 'pointer', appearance: 'none',
  boxShadow: '0 1px 4px rgba(5,5,5,0.04)', fontWeight: 400,
};
