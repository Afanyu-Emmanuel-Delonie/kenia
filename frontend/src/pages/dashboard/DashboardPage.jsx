import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../../api/services';
import { useNotification } from '../../context/NotificationContext';
import useReveal from '../../hooks/useReveal';
import {
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  Layers, Package, AlertTriangle, ShoppingBag,
  ArrowRight, CheckCircle, Clock,
  Truck, Gem, MessageSquare, Scissors,
} from 'lucide-react';

// ── Tokens ────────────────────────────────────────────────────────────────
const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const STAGE_CFG = {
  CUTTING:       { label: 'Cutting',   color: '#6366f1', icon: Scissors },
  STITCHING:     { label: 'Stitching', color: '#f59e0b', icon: Layers   },
  HARDWARE:      { label: 'Hardware',  color: '#8b5cf6', icon: Gem      },
  QA:            { label: 'QA',        color: '#3b82f6', icon: CheckCircle },
  ARCHIVE_READY: { label: 'Archived',  color: '#22c55e', icon: Package  },
};

const STATUS_CFG = {
  GREEN:  { dot: '#22c55e', bg: '#f0fdf4', text: '#16a34a', label: 'Healthy'  },
  YELLOW: { dot: '#f59e0b', bg: '#fffbeb', text: '#d97706', label: 'Caution'  },
  RED:    { dot: '#ef4444', bg: '#fef2f2', text: '#dc2626', label: 'Critical' },
};

const ORDER_CFG = {
  PENDING:   { icon: Clock,       color: '#f59e0b', bg: '#fffbeb' },
  CONFIRMED: { icon: CheckCircle, color: '#3b82f6', bg: '#eff6ff' },
  SHIPPED:   { icon: Truck,       color: '#8b5cf6', bg: '#f5f3ff' },
  DELIVERED: { icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4' },
};

// ── Card ──────────────────────────────────────────────────────────────────
function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff', border: '1px solid rgba(5,5,5,0.09)',
      borderRadius: '14px', padding: '1.5rem',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
      transition: 'border-color 0.15s, box-shadow 0.15s', ...style,
    }}
      onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.borderColor = 'rgba(5,5,5,0.22)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(5,5,5,0.09)'; }}}
      onMouseLeave={(e) => { if (onClick) { e.currentTarget.style.borderColor = 'rgba(5,5,5,0.09)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(5,5,5,0.04)'; }}}
    >{children}</div>
  );
}

function Label({ children }) {
  return <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#050505', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 500 }}>{children}</p>;
}

function Title({ children }) {
  return <p style={{ fontFamily: F.ui, fontSize: '1rem', fontWeight: 700, color: '#050505', letterSpacing: '-0.02em', lineHeight: 1 }}>{children}</p>;
}

function ViewAll({ to, navigate }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); navigate(to); }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.ui, fontSize: '0.7rem', fontWeight: 600, color: '#555', padding: 0, transition: 'color 0.15s' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
    >View all <ArrowRight size={11} /></button>
  );
}

// ── SVG Donut ─────────────────────────────────────────────────────────────
function Donut({ segments, total, cx = 80, cy = 80, r = 58, stroke = 14 }) {
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map((s) => {
    const pct  = total > 0 ? s.value / total : 0;
    const dash = pct * circumference;
    const gap  = circumference - dash;
    const arc  = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <svg width={cx * 2} height={cy * 2} style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f4f4f4" strokeWidth={stroke} />
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={a.color} strokeWidth={stroke}
          strokeDasharray={`${a.dash} ${a.gap}`}
          strokeDashoffset={-a.offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      ))}
    </svg>
  );
}

// ── Pulse dot ─────────────────────────────────────────────────────────────
function Pulse({ color }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px', flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
      <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: color }} />
    </span>
  );
}

// ── Chart tooltip ─────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#050505', color: '#FCFCFA', padding: '0.5rem 0.85rem', borderRadius: '6px', fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 300 }}>
      <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>{label}</p>
      <p><strong>{payload[0].value}</strong> bags</p>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #f4f4f4', borderTopColor: '#050505', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const r0 = useReveal({ delay: 0 });
  const r1 = useReveal({ delay: 80 });
  const r2 = useReveal({ delay: 160 });
  const r3 = useReveal({ delay: 240 });

  useEffect(() => {
    getDashboard()
      .then((r) => {
        setData(r.data);
        success('Dashboard data loaded successfully');
      })
      .catch(() => error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data)   return <p style={{ fontFamily: F.ui, color: '#aaa' }}>Failed to load.</p>;

  const atelierData = [
    { site: 'Kigali City', count: 14 },
    { site: 'Musanze',     count: 9  },
    { site: 'Rubavu',      count: 11 },
    { site: 'Huye',        count: 7  },
    { site: 'Nyagatare',   count: 5  },
    { site: 'Muhanga',     count: 8  },
    { site: 'Rwamagana',   count: 6  },
  ];
  const os           = data.orderSummary ?? {};
  const totalBags    = data.totalActive + data.totalArchived;

  // Stage counts from recentProducts
  const stageCounts = {};
  (data.recentProducts ?? []).forEach((p) => {
    stageCounts[p.currentStage] = (stageCounts[p.currentStage] ?? 0) + 1;
  });

  const donutSegments = Object.entries(STAGE_CFG).map(([key, cfg]) => ({
    label: cfg.label, color: cfg.color, value: stageCounts[key] ?? 0,
  })).filter((s) => s.value > 0);

  const redCount    = data.materialHealth?.filter((m) => m.status === 'RED').length    ?? 0;
  const yellowCount = data.materialHealth?.filter((m) => m.status === 'YELLOW').length ?? 0;

  // Static recent activity (enriched with real data context)
  const activity = [
    { icon: Layers,        color: '#6366f1', text: 'KRN-2026-013 moved to', bold: 'Stitching',       sub: 'Kigali Atelier',    time: '4m ago'  },
    { icon: ShoppingBag,   color: '#3b82f6', text: 'Order',                 bold: 'ORD-2026-0004',   sub: 'Zara Okonkwo',      time: '18m ago' },
    { icon: AlertTriangle, color: '#ef4444', text: 'Low stock alert:',      bold: 'Antique Gold',    sub: '6 sets remaining',  time: '1h ago'  },
    { icon: CheckCircle,   color: '#22c55e', text: 'KRN-2026-010 activated', bold: 'Slate Briefcase', sub: 'Nairobi Studio',    time: '2h ago'  },
    { icon: MessageSquare, color: '#8b5cf6', text: 'New inquiry on',        bold: 'Rose Minaudiere', sub: 'Priya Nair',        time: '3h ago'  },
    { icon: Truck,         color: '#22c55e', text: 'Order',                 bold: 'ORD-2026-0002',   sub: 'shipped to Accra',  time: '5h ago'  },
    { icon: Package,       color: '#22c55e', text: 'KRN-2026-009 archived', bold: 'Rose Minaudiere', sub: 'QA complete',       time: '6h ago'  },
    { icon: Gem,           color: '#f59e0b', text: 'Reorder needed:',       bold: 'Midnight Navy',   sub: '5m remaining',      time: '8h ago'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Row 1: KPI ── */}
      <div ref={r0} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }} className="db-kpi">
        {[
          { label: 'In Production', value: data.totalActive,    sub: 'active bags',                icon: Layers,        accent: true,  to: '/products'  },
          { label: 'Completed',     value: data.totalArchived,  sub: 'archive-ready',              icon: Package,       accent: false, to: '/products'  },
          { label: 'Critical Stock',value: redCount,            sub: `${yellowCount} on caution`,  icon: AlertTriangle, accent: redCount > 0, to: '/materials' },
          { label: 'Total Orders',  value: os.totalOrders ?? 0, sub: `${os.confirmedOrders ?? 0} confirmed`, icon: ShoppingBag, accent: false, to: '/orders' },
        ].map((k) => (
          <Card key={k.label} onClick={() => navigate(k.to)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Label>{k.label}</Label>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: k.accent ? '#050505' : '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={13} style={{ color: k.accent ? '#FCFCFA' : '#bbb' }} />
              </div>
            </div>
            <p style={{ fontFamily: F.ui, fontSize: '2.8rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.04em' }} className="db-kpi-num">{k.value}</p>
            <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#555', fontWeight: 500 }}>{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Row 2: Donut + Atelier bars ── */}
      <div ref={r1} style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem' }} className="db-row2">

        {/* Donut — pipeline */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div><Label>Workflow</Label><Title>Pipeline</Title></div>
            <ViewAll to="/products" navigate={navigate} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '1rem' }}>
            <Donut segments={donutSegments} total={totalBags} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <p style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', lineHeight: 1 }}>{totalBags}</p>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>total</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {Object.entries(STAGE_CFG).map(([key, cfg]) => {
              const count = stageCounts[key] ?? 0;
              if (count === 0) return null;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {key !== 'ARCHIVE_READY'
                    ? <Pulse color={cfg.color} />
                    : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
                  }
                  <p style={{ flex: 1, fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 600, color: '#050505' }}>{cfg.label}</p>
                  <p style={{ fontFamily: F.data, fontSize: '0.75rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.05em' }}>{count}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Atelier horizontal bars */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div><Label>Distribution</Label><Title>Rwanda Shops</Title></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={atelierData} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="site" tick={{ fontSize: 9, fill: '#888', fontFamily: 'IBM Plex Mono', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#888', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(5,5,5,0.04)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {atelierData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#050505' : `rgba(5,5,5,${0.15 + i * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Order funnel below */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(5,5,5,0.05)' }}>
            <Label>Commerce</Label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }} className="db-order-funnel">
              {[
                { label: 'Pending',   count: os.pendingOrders   ?? 0, ...ORDER_CFG.PENDING   },
                { label: 'Confirmed', count: os.confirmedOrders ?? 0, ...ORDER_CFG.CONFIRMED },
                { label: 'Shipped',   count: os.shippedOrders   ?? 0, ...ORDER_CFG.SHIPPED   },
                { label: 'Delivered', count: os.deliveredOrders ?? 0, ...ORDER_CFG.DELIVERED },
              ].map((o) => (
                <div key={o.label} onClick={() => navigate('/orders')} style={{ flex: 1, padding: '0.65rem 0.5rem', borderRadius: '10px', background: o.bg, textAlign: 'center', cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <o.icon size={14} style={{ color: o.color, margin: '0 auto 0.3rem' }} />
                  <p style={{ fontFamily: F.ui, fontSize: '1.5rem', fontWeight: 800, color: '#050505', lineHeight: 1 }}>{o.count}</p>
                  <p style={{ fontFamily: F.data, fontSize: '0.44rem', color: '#050505', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem', fontWeight: 600 }}>{o.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>

      {/* ── Row 3: Material health + Recent activity ── */}
      <div ref={r2} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }} className="db-row3">

        {/* Material health */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div><Label>Vault</Label><Title>Material Health</Title></div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }} className="db-mhealth-badges">
              {[{ label: 'Critical', count: redCount, color: '#ef4444', bg: '#fef2f2' }, { label: 'Caution', count: yellowCount, color: '#f59e0b', bg: '#fffbeb' }, { label: 'Healthy', count: (data.materialHealth?.length ?? 0) - redCount - yellowCount, color: '#22c55e', bg: '#f0fdf4' }].map((s) => (
                <div key={s.label} style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: s.bg, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: s.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>{s.count} {s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(data.materialHealth ?? []).map((m) => {
              const c = STATUS_CFG[m.status] ?? STATUS_CFG.GREEN;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.85rem', borderRadius: '8px', background: c.bg }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                  <p style={{ flex: 1, fontFamily: F.ui, fontSize: '0.78rem', fontWeight: 700, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.name}
                  </p>
                  <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', flexShrink: 0, fontWeight: 500 }}>
                    <strong style={{ color: '#050505', fontWeight: 700 }}>{parseFloat(m.stockQuantity).toFixed(1)}</strong> {m.unit}
                  </p>
                  <span style={{ fontFamily: F.data, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.text, padding: '0.18rem 0.5rem', borderRadius: '4px', background: '#fff', border: `1px solid ${c.dot}44`, flexShrink: 0, fontWeight: 700 }}>{c.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div><Label>Live Feed</Label><Title>Recent Activity</Title></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Pulse color="#22c55e" />
              <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(5,5,5,0.05)' : 'none' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.05rem' }}>
                  <a.icon size={12} style={{ color: a.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: F.ui, fontSize: '0.75rem', fontWeight: 500, color: '#222', lineHeight: 1.4 }}>
                    {a.text} <strong style={{ color: '#050505', fontWeight: 700 }}>{a.bold}</strong>
                  </p>
                  <p style={{ fontFamily: F.ui, fontSize: '0.8125rem', color: '#666', fontWeight: 500, marginTop: '0.1rem' }}>{a.sub}</p>
                </div>
                <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.05em', flexShrink: 0, marginTop: '0.15rem', fontWeight: 500 }}>{a.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @media(max-width:1280px){.db-row2{grid-template-columns:240px 1fr!important}}
        @media(max-width:1024px){
          .db-kpi{grid-template-columns:repeat(2,1fr)!important}
          .db-row2{grid-template-columns:1fr!important}
          .db-row3{grid-template-columns:1fr!important}
        }
        @media(max-width:640px){
          .db-kpi{grid-template-columns:1fr 1fr!important}
          .db-kpi-num{font-size:2rem!important}
          .db-mhealth-badges{flex-wrap:wrap!important}
          .db-order-funnel{flex-wrap:wrap!important}
          .db-order-funnel>*{min-width:calc(50% - 0.25rem)!important}
        }
        @media(max-width:400px){
          .db-kpi{grid-template-columns:1fr!important}
          .db-kpi-num{font-size:1.8rem!important}
        }
      `}</style>
    </div>
  );
}
