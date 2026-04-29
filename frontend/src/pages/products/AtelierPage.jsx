import { useState, useEffect, useRef } from 'react';
import { getProducts, createProduct } from '../../api/services';
import { Layers, Scissors, Gem, CheckCircle, Package, Clock, Search, Filter, Plus, X, ImagePlus } from 'lucide-react';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const STAGE_CFG = {
  CUTTING:       { label: 'Cutting',   color: '#6366f1', bg: '#eef2ff', icon: Scissors    },
  STITCHING:     { label: 'Stitching', color: '#d97706', bg: '#fffbeb', icon: Layers      },
  HARDWARE:      { label: 'Hardware',  color: '#7c3aed', bg: '#f5f3ff', icon: Gem         },
  QA:            { label: 'QA',        color: '#2563eb', bg: '#eff6ff', icon: CheckCircle },
  ARCHIVE_READY: { label: 'Archived',  color: '#16a34a', bg: '#f0fdf4', icon: Package     },
};

const ATELIERS_LIST = ['Kigali Atelier', 'Nairobi Studio', 'Lagos Workshop'];
const BAG_CATEGORIES = ['Tote', 'Clutch', 'Crossbody', 'Briefcase', 'Shopper', 'Minaudiere', 'Bucket Bag', 'Wristlet', 'Hobo', 'Satchel', 'Other'];

function ProductImageZone({ productId, sku }) {
  const [preview, setPreview] = useState(() => {
    try { return localStorage.getItem(`prod_img_${productId}`) ?? null; } catch { return null; }
  });
  const ref = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      try { localStorage.setItem(`prod_img_${productId}`, dataUrl); } catch {}
    };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '7px', overflow: 'hidden', flexShrink: 0, background: '#f4f4f4', border: '1px solid rgba(5,5,5,0.08)', cursor: 'pointer' }}
      onClick={() => ref.current?.click()} title={`Add photo for ${sku}`}>
      {preview
        ? <img src={preview} alt={sku} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImagePlus size={14} style={{ color: '#ccc' }} /></div>
      }
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

function StageBadge({ stage }) {
  const cfg = STAGE_CFG[stage] ?? { label: stage, color: '#888', bg: '#f4f4f4', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.25rem 0.65rem', borderRadius: '4px',
      background: cfg.bg, border: `1px solid ${cfg.color}33`,
      fontFamily: F.data, fontSize: '0.46rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: cfg.color, fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #f4f4f4', borderTopColor: '#050505', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── New Bag Modal ──────────────────────────────────────────────────────────
function NewBagModal({ onClose, onDone }) {
  const [name, setName]       = useState('');
  const [site, setSite]       = useState(ATELIERS_LIST[0]);
  const [category, setCategory] = useState(BAG_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Bag name is required'); return; }
    setLoading(true); setError('');
    try {
      await createProduct({ name: name.trim(), atelierSite: site, category });
      onDone();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to create bag. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '400px', margin: '1rem', boxShadow: '0 8px 40px rgba(5,5,5,0.12)' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: F.data, fontSize: '0.46rem', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Atelier · New</p>
            <p style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.03em', lineHeight: 1 }}>New Bag</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#bbb', display: 'flex' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Bag Name</label>
            <input ref={nameRef} value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Obsidian Tote Bag"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#050505')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#050505')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}>
                {BAG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Atelier Site</label>
              <select value={site} onChange={(e) => setSite(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#050505')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}>
                {ATELIERS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {error && <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#dc2626', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button type="button" onClick={onClose} style={{ ...btnSecondary }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#B68D40'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#050505'; }}
            >
              {loading ? 'Creating…' : 'Create Bag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { fontFamily: F.data, fontSize: '0.6875rem', color: '#050505', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: 500 };
const inputStyle = { width: '100%', padding: '0.65rem 0.85rem', boxSizing: 'border-box', background: '#fff', border: '1px solid rgba(5,5,5,0.12)', borderRadius: '8px', fontFamily: F.ui, fontSize: '0.85rem', color: '#050505', outline: 'none', fontWeight: 400 };
const btnPrimary   = { flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#050505', color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' };
const btnSecondary = { flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(5,5,5,0.12)', background: '#fff', color: '#050505', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };

// ── Desktop table row ──────────────────────────────────────────────────────
function TableRow({ p, i }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? 'rgba(5,5,5,0.02)' : i % 2 === 0 ? '#fff' : '#fafafa', transition: 'background 0.15s' }}>
      <td style={{ ...td, width: '52px' }}><ProductImageZone productId={p.id} sku={p.sku} /></td>
      <td style={td}><span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.1em', fontWeight: 600 }}>{p.sku}</span></td>
      <td style={td}>
        <div>
          <span style={{ fontFamily: F.ui, fontSize: '0.85rem', color: '#050505', fontWeight: 700 }}>{p.name}</span>
          {p.category && <span style={{ display: 'block', fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.1rem' }}>{p.category}</span>}
        </div>
      </td>
      <td style={{ ...td, display: 'table-cell' }} className="col-atelier"><span style={{ fontFamily: F.ui, fontSize: '0.78rem', color: '#555', fontWeight: 500 }}>{p.atelierSite}</span></td>
      <td style={td}><StageBadge stage={p.currentStage} /></td>
      <td style={{ ...td }} className="col-status">
        <span style={{
          display: 'inline-block', padding: '0.22rem 0.6rem', borderRadius: '4px',
          fontFamily: F.data, fontSize: '0.44rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          background: p.activated ? '#f0fdf4' : '#f4f4f4',
          color: p.activated ? '#16a34a' : '#aaa',
          border: `1px solid ${p.activated ? '#16a34a33' : '#e5e5e5'}`,
          fontWeight: 700,
        }}>
          {p.activated ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style={{ ...td, fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.05em', fontWeight: 500, whiteSpace: 'nowrap' }} className="col-date">
        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
      </td>
    </tr>
  );
}

const td = { padding: '0.85rem 1rem', verticalAlign: 'middle', borderBottom: '1px solid rgba(5,5,5,0.05)' };
const th = { padding: '0.65rem 1rem', fontFamily: F.data, fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#050505', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid rgba(5,5,5,0.08)', background: '#fafafa', whiteSpace: 'nowrap' };

// ── Mobile card ────────────────────────────────────────────────────────────
function MobileCard({ p }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.08)', borderRadius: '12px', padding: '1rem 1.1rem', boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1, minWidth: 0 }}>
          <ProductImageZone productId={p.id} sku={p.sku} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '0.15rem' }}>{p.sku}</p>
            <p style={{ fontFamily: F.ui, fontSize: '0.95rem', color: '#050505', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
            {p.category && <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.1rem' }}>{p.category}</p>}
          </div>
        </div>
        <StageBadge stage={p.currentStage} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
        <p style={{ fontFamily: F.ui, fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>{p.atelierSite}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-block', padding: '0.18rem 0.5rem', borderRadius: '4px',
            fontFamily: F.data, fontSize: '0.42rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            background: p.activated ? '#f0fdf4' : '#f4f4f4',
            color: p.activated ? '#16a34a' : '#aaa',
            border: `1px solid ${p.activated ? '#16a34a33' : '#e5e5e5'}`,
            fontWeight: 700,
          }}>
            {p.activated ? 'Active' : 'Inactive'}
          </span>
          <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.05em', fontWeight: 500 }}>
            {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AtelierHeader({ name, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
      <p style={{ fontFamily: F.ui, fontSize: '1rem', fontWeight: 700, color: '#050505', letterSpacing: '-0.02em' }}>{name}</p>
      <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#B68D40', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', background: 'rgba(182,141,64,0.08)', borderRadius: '4px', border: '1px solid rgba(182,141,64,0.2)', fontWeight: 700 }}>
        {count} bag{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default function AtelierPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [atelier, setAtelier]   = useState('All');
  const [stage, setStage]       = useState('All');
  const [showNew, setShowNew]   = useState(false);

  const load = () => {
    setLoading(true);
    getProducts().then((r) => setProducts(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  // ── KPI counts ────────────────────────────────────────────────────────────
  const totalBags    = products.length;
  const activatedCnt = products.filter((p) => p.activated).length;
  const inProdCnt    = products.filter((p) => p.currentStage !== 'ARCHIVE_READY').length;
  const archivedCnt  = products.filter((p) => p.currentStage === 'ARCHIVE_READY').length;

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch  = !q || p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    const matchAtelier = atelier === 'All' || p.atelierSite === atelier;
    const matchStage   = stage === 'All' || p.currentStage === stage;
    return matchSearch && matchAtelier && matchStage;
  });

  const grouped = filtered.reduce((acc, p) => {
    (acc[p.atelierSite] = acc[p.atelierSite] ?? []).push(p);
    return acc;
  }, {});

  const stageOptions = ['All', ...Object.keys(STAGE_CFG)];
  const statCounts   = Object.entries(STAGE_CFG).map(([key, cfg]) => ({ ...cfg, key, count: products.filter((p) => p.currentStage === key).length }));

  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Production</p>
          <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Atelier</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.1em', fontWeight: 500 }}>{products.length} bags</p>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: '#050505', border: 'none', borderRadius: '8px', color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#B68D40')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#050505')}
          >
            <Plus size={13} /> New Bag
          </button>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }} className="atelier-kpi">
        {[
          { label: 'Total Bags',    value: totalBags,    sub: 'all time',          icon: Package,     accent: false },
          { label: 'In Production', value: inProdCnt,    sub: 'active workflow',   icon: Layers,      accent: true  },
          { label: 'Archive Ready', value: archivedCnt,  sub: 'completed QA',      icon: CheckCircle, accent: false },
          { label: 'Activated',     value: activatedCnt, sub: 'digital twin live', icon: Gem,         accent: false },
        ].map((k) => (
          <div key={k.label} style={{
            background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px',
            padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
            display: 'flex', flexDirection: 'column', gap: '0.6rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>{k.label}</p>
              <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: k.accent ? '#050505' : '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={12} style={{ color: k.accent ? '#FCFCFA' : '#bbb' }} />
              </div>
            </div>
            <p style={{ fontFamily: F.ui, fontSize: '2.4rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.04em' }}>{k.value}</p>
            <p style={{ fontFamily: F.ui, fontSize: '0.7rem', color: '#888', fontWeight: 500 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Stage stat pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {statCounts.filter((s) => s.count > 0).map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setStage(stage === s.key ? 'All' : s.key)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
              background: stage === s.key ? '#050505' : '#fff',
              border: stage === s.key ? '1px solid #050505' : '1px solid rgba(5,5,5,0.09)',
              boxShadow: '0 1px 4px rgba(5,5,5,0.04)', transition: 'all 0.15s',
            }}>
              <Icon size={12} style={{ color: stage === s.key ? '#FCFCFA' : s.color }} />
              <span style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: stage === s.key ? '#FCFCFA' : '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.count}</span>
              <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: stage === s.key ? 'rgba(252,252,250,0.7)' : '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 180px', maxWidth: '280px', minWidth: '140px' }}>
          <Search size={12} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKU or name…"
            style={{ width: '100%', paddingLeft: '2.1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '8px', fontFamily: F.ui, fontSize: '0.78rem', color: '#050505', outline: 'none', boxSizing: 'border-box', fontWeight: 400, boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}
            onFocus={(e) => (e.target.style.borderColor = '#050505')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.1)')}
          />
        </div>
        <div style={{ position: 'relative', flex: '1 1 140px', minWidth: '120px' }}>
          <Filter size={11} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
          <select value={atelier} onChange={(e) => setAtelier(e.target.value)} style={{ ...selectStyle, paddingLeft: '2rem', width: '100%' }}>
            <option value="All">All Ateliers</option>
            {ATELIERS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ ...selectStyle, flex: '1 1 120px', minWidth: '110px', width: '100%' }}>
          {stageOptions.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Stages' : STAGE_CFG[s]?.label ?? s}</option>)}
        </select>
      </div>

      {/* ── Desktop table ── */}
      <div className="atelier-table" style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px', overflow: 'auto', boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
          <thead>
            <tr>
              {['', 'SKU', 'Name', 'Atelier', 'Stage', 'Status', 'Created'].map((h, i) => (
                <th key={h} style={{ ...th }} className={i === 3 ? 'col-atelier' : i === 5 ? 'col-status' : i === 6 ? 'col-date' : undefined}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', fontFamily: F.ui, fontSize: '0.82rem', color: '#bbb', fontWeight: 500 }}>No bags found</td></tr>
              : filtered.map((p, i) => <TableRow key={p.id} p={p} i={i} />)
            }
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="atelier-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.keys(grouped).length === 0
          ? <p style={{ fontFamily: F.ui, fontSize: '0.82rem', color: '#bbb', fontWeight: 500, textAlign: 'center', padding: '2rem 0' }}>No bags found</p>
          : Object.entries(grouped).map(([site, bags]) => (
            <div key={site}>
              <AtelierHeader name={site} count={bags.length} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {bags.map((p) => <MobileCard key={p.id} p={p} />)}
              </div>
            </div>
          ))
        }
      </div>

      {showNew && <NewBagModal onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); load(); }} />}

      <style>{`
        input::placeholder { color: #bbb; }
        @media (min-width: 768px) {
          .atelier-table { display: block !important; }
          .atelier-cards { display: none  !important; }
        }
        @media (max-width: 767px) {
          .atelier-table { display: none  !important; }
          .atelier-cards { display: flex  !important; }
          .atelier-kpi   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 900px) {
          .col-atelier { display: none !important; }
          .col-date    { display: none !important; }
          .atelier-kpi { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 1100px) {
          .col-status { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const selectStyle = { padding: '0.6rem 0.85rem', background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '8px', fontFamily: F.ui, fontSize: '0.78rem', color: '#050505', outline: 'none', cursor: 'pointer', appearance: 'none', boxShadow: '0 1px 4px rgba(5,5,5,0.04)', fontWeight: 400 };
