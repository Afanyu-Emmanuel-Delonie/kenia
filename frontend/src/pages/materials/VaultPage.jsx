import { useState, useEffect, useRef } from 'react';
import { getMaterials, adjustStock, createMaterial, deleteMaterial } from '../../api/services';
import { AlertTriangle, CheckCircle, Search, Plus, Minus, X, ImagePlus, Trash2, SlidersHorizontal, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const STATUS_CFG = {
  RED:    { label: 'Critical', color: '#dc2626', bg: '#fef2f2', border: '#dc262633', dot: '#ef4444' },
  YELLOW: { label: 'Caution',  color: '#d97706', bg: '#fffbeb', border: '#d9770633', dot: '#f59e0b' },
  GREEN:  { label: 'Healthy',  color: '#16a34a', bg: '#f0fdf4', border: '#16a34a33', dot: '#22c55e' },
};

function getStatus(m) {
  const ratio = parseFloat(m.stockQuantity) / parseFloat(m.lowStockThreshold);
  if (ratio <= 1)   return 'RED';
  if (ratio <= 1.5) return 'YELLOW';
  return 'GREEN';
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.22rem 0.6rem', borderRadius: '4px',
      background: c.bg, border: `1px solid ${c.border}`,
      fontFamily: F.data, fontSize: '0.44rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: c.color, fontWeight: 700,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {c.label}
    </span>
  );
}

function StockBar({ qty, threshold }) {
  const pct    = Math.min((parseFloat(qty) / (parseFloat(threshold) * 3)) * 100, 100);
  const status = getStatus({ stockQuantity: qty, lowStockThreshold: threshold });
  return (
    <div style={{ width: '72px', height: '4px', background: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: STATUS_CFG[status].dot, borderRadius: '2px', transition: 'width 0.4s ease' }} />
    </div>
  );
}

// ── Image zone (local preview only for identification) ────────────────────
function ImageZone({ materialId, name }) {
  const [preview, setPreview] = useState(() => {
    try { return localStorage.getItem(`mat_img_${materialId}`) ?? null; } catch { return null; }
  });
  const ref = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      try { localStorage.setItem(`mat_img_${materialId}`, dataUrl); } catch {}
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f4f4f4', border: '1px solid rgba(5,5,5,0.08)', cursor: 'pointer' }}
      onClick={() => ref.current?.click()}
      title="Click to add identification photo">
      {preview
        ? <img src={preview} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImagePlus size={16} style={{ color: '#ccc' }} /></div>
      }
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ── Add Material Modal ─────────────────────────────────────────────────────
function AddMaterialModal({ onClose, onDone }) {
  const [form, setForm] = useState({ name: '', category: 'LEATHER', stockQuantity: '', unit: 'meters', lowStockThreshold: '', unitCost: '', provenance: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current?.focus(); }, []);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const iStyle = { width: '100%', padding: '0.6rem 0.8rem', boxSizing: 'border-box', background: '#fff', border: '1px solid rgba(5,5,5,0.12)', borderRadius: '8px', fontFamily: F.ui, fontSize: '0.82rem', color: '#050505', outline: 'none' };
  const lStyle = { fontFamily: F.data, fontSize: '0.6875rem', color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem', fontWeight: 500 };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.stockQuantity || !form.lowStockThreshold || !form.unitCost) { setError('All fields except provenance are required.'); return; }
    setLoading(true); setError('');
    try {
      await createMaterial({ ...form, stockQuantity: parseFloat(form.stockQuantity), lowStockThreshold: parseFloat(form.lowStockThreshold), unitCost: parseFloat(form.unitCost) });
      onDone();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '460px', margin: '1rem', boxShadow: '0 8px 40px rgba(5,5,5,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: F.data, fontSize: '0.46rem', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Vault · New</p>
            <p style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.03em', lineHeight: 1 }}>Add Material</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')} onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}><X size={16} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label style={lStyle}>Name</label><input ref={firstRef} value={form.name} onChange={set('name')} placeholder="e.g. Obsidian Leather" style={iStyle} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')} /></div>
            <div><label style={lStyle}>Category</label>
              <select value={form.category} onChange={set('category')} style={{ ...iStyle, cursor: 'pointer', appearance: 'none' }} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')}>
                {['LEATHER','HARDWARE','LINING','THREAD','FABRIC','OTHER'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div><label style={lStyle}>Stock Qty</label><input type="number" min="0" step="0.1" value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="0.0" style={iStyle} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')} /></div>
            <div><label style={lStyle}>Unit</label>
              <select value={form.unit} onChange={set('unit')} style={{ ...iStyle, cursor: 'pointer', appearance: 'none' }} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')}>
                {['meters','pieces','kg','spools','sets','liters'].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div><label style={lStyle}>Low Stock At</label><input type="number" min="0" step="0.1" value={form.lowStockThreshold} onChange={set('lowStockThreshold')} placeholder="0.0" style={iStyle} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label style={lStyle}>Unit Cost ($)</label><input type="number" min="0" step="0.01" value={form.unitCost} onChange={set('unitCost')} placeholder="0.00" style={iStyle} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')} /></div>
            <div><label style={lStyle}>Provenance</label><input value={form.provenance} onChange={set('provenance')} placeholder="Supplier / tannery" style={iStyle} onFocus={(e) => (e.target.style.borderColor='#050505')} onBlur={(e) => (e.target.style.borderColor='rgba(5,5,5,0.12)')} /></div>
          </div>
          {error && <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#dc2626', fontWeight: 500 }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.25rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.72rem', borderRadius: '8px', border: '1px solid rgba(5,5,5,0.12)', background: '#fff', color: '#050505', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.72rem', borderRadius: '8px', border: 'none', background: '#050505', color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'background 0.15s' }} onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#B68D40'; }} onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#050505'; }}>{loading ? 'Saving…' : 'Add Material'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Adjust Stock Modal ─────────────────────────────────────────────────────
function AdjustModal({ material, defaultType, onClose, onDone }) {
  const [delta, setDelta]     = useState('');
  const [reason, setReason]   = useState('');
  const [type, setType]       = useState(defaultType ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async (t) => {
    const mode = t ?? type;
    const val = parseFloat(delta);
    if (!val || val <= 0) { setError('Enter a valid positive amount'); return; }
    setLoading(true); setError('');
    try {
      await adjustStock(material.id, { delta: mode === 'add' ? val : -val, reason: reason || undefined });
      onDone();
    } catch {
      setError('Adjustment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '380px', margin: '1rem', boxShadow: '0 8px 40px rgba(5,5,5,0.12)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Vault · {type === 'add' ? 'Add Stock' : type === 'remove' ? 'Remove Stock' : 'Adjust'}</p>
            <p style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.03em', lineHeight: 1 }}>{material.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#bbb', display: 'flex' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}>
            <X size={16} />
          </button>
        </div>

        {/* Current stock */}
        <div style={{ background: '#fafafa', border: '1px solid rgba(5,5,5,0.07)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>Current stock</span>
          <span style={{ fontFamily: F.ui, fontSize: '1.6rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {parseFloat(material.stockQuantity).toFixed(1)}
            <span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#888', marginLeft: '0.35rem', fontWeight: 500 }}>{material.unit}</span>
          </span>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#050505', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Amount</label>
          <input
            ref={inputRef} type="number" min="0" step="0.1"
            value={delta} onChange={(e) => { setDelta(e.target.value); setError(''); }}
            placeholder={`e.g. 5 ${material.unit}`}
            style={{
              width: '100%', padding: '0.65rem 0.85rem', boxSizing: 'border-box',
              background: '#fff', border: '1px solid rgba(5,5,5,0.12)',
              borderRadius: '8px', fontFamily: F.ui, fontSize: '0.85rem', color: '#050505',
              outline: 'none', fontWeight: 400,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#050505')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}
          />
        </div>

        {/* Reason */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#050505', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
            Reason <span style={{ color: '#bbb' }}>(optional)</span>
          </label>
          <input
            type="text" value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Restock from supplier"
            style={{
              width: '100%', padding: '0.65rem 0.85rem', boxSizing: 'border-box',
              background: '#fff', border: '1px solid rgba(5,5,5,0.12)',
              borderRadius: '8px', fontFamily: F.ui, fontSize: '0.85rem', color: '#050505',
              outline: 'none', fontWeight: 400,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#050505')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}
          />
        </div>

        {error && <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#dc2626', marginBottom: '0.85rem', fontWeight: 500 }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {(!type || type === 'remove') && (
            <button disabled={loading} onClick={() => submit('remove')} style={{
              flex: 1, padding: '0.75rem', borderRadius: '8px',
              border: '1px solid #dc262633', background: type === 'remove' ? '#dc2626' : '#fef2f2',
              color: type === 'remove' ? '#fff' : '#dc2626', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              opacity: loading ? 0.5 : 1, transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#fee2e2'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = type === 'remove' ? '#dc2626' : '#fef2f2'; }}
            >
              <Minus size={13} /> Remove
            </button>
          )}
          {(!type || type === 'add') && (
            <button disabled={loading} onClick={() => submit('add')} style={{
              flex: 1, padding: '0.75rem', borderRadius: '8px',
              border: '1px solid rgba(5,5,5,0.15)', background: type === 'add' ? '#16a34a' : '#050505',
              color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              opacity: loading ? 0.5 : 1, transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#B68D40'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = type === 'add' ? '#16a34a' : '#050505'; }}
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Actions panel (shown below each row/card when expanded) ───────────────
function ActionsPanel({ m, onAdjust, onDelete }) {
  const status = getStatus(m);
  const c = STATUS_CFG[status];
  return (
    <div style={{
      background: '#fafafa', borderTop: '1px solid rgba(5,5,5,0.06)',
      padding: '0.85rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap',
    }}>
      {/* Status badge lives here */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.45rem 0.85rem', borderRadius: '7px',
        background: c.bg, border: `1px solid ${c.border}`,
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
        <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: c.color, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{c.label}</span>
      </div>

      <div style={{ width: '1px', height: '20px', background: 'rgba(5,5,5,0.08)', flexShrink: 0 }} />

      <button onClick={() => onAdjust(m, 'add')} style={actionBtn('#f0fdf4', '#16a34a', '#16a34a22')}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}>
        <TrendingUp size={13} /> Add Stock
      </button>

      <button onClick={() => onAdjust(m, 'remove')} style={actionBtn('#fffbeb', '#d97706', '#d9770622')}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fef3c7')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#fffbeb')}>
        <TrendingDown size={13} /> Remove Stock
      </button>

      <button onClick={() => onAdjust(m)} style={actionBtn('#f4f4f4', '#050505', 'rgba(5,5,5,0.1)')}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e8e8')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#f4f4f4')}>
        <SlidersHorizontal size={13} /> Adjust
      </button>

      <div style={{ flex: 1 }} />

      <button onClick={() => onDelete(m)} style={actionBtn('#fef2f2', '#dc2626', '#dc262622')}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}>
        <Trash2 size={13} /> Delete
      </button>
    </div>
  );
}

const actionBtn = (bg, color, border) => ({
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.5rem 0.9rem', borderRadius: '7px', cursor: 'pointer',
  fontFamily: F.ui, fontSize: '0.8125rem', fontWeight: 600,
  background: bg, color, border: `1px solid ${border}`,
  transition: 'background 0.15s',
});

// ── Desktop table row ──────────────────────────────────────────────────────
function TableRow({ m, i, onAdjust, onDelete }) {
  const [open, setOpen] = useState(false);
  const status = getStatus(m);
  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        style={{ background: open ? 'rgba(5,5,5,0.02)' : i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer', transition: 'background 0.15s' }}
      >
        <td style={{ ...td, width: '56px' }}><ImageZone materialId={m.id} name={m.name} /></td>
        <td style={td}><span style={{ fontFamily: F.ui, fontSize: '0.875rem', color: '#050505', fontWeight: 700 }}>{m.name}</span></td>
        <td style={td}><span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{m.category}</span></td>
        <td style={td}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontFamily: F.ui, fontSize: '1.4rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>{parseFloat(m.stockQuantity).toFixed(1)}</span>
            <span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#888', letterSpacing: '0.08em', fontWeight: 500 }}>{m.unit}</span>
            <StockBar qty={m.stockQuantity} threshold={m.lowStockThreshold} />
          </div>
        </td>
        <td style={td}><span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.05em', fontWeight: 500 }}>{parseFloat(m.lowStockThreshold).toFixed(1)} {m.unit}</span></td>
        <td style={td}><span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', fontWeight: 600 }}>${parseFloat(m.unitCost).toFixed(2)}</span></td>
        <td style={td}><span style={{ fontFamily: F.ui, fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>{m.provenance ?? '—'}</span></td>
        <td style={{ ...td, textAlign: 'right' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', fontFamily: F.ui, fontSize: '0.8125rem', color: '#888', fontWeight: 500 }}>
            Actions {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </td>
      </tr>
      {open && (
        <tr style={{ background: '#fafafa' }}>
          <td colSpan={8} style={{ padding: 0, borderBottom: '1px solid rgba(5,5,5,0.05)' }}>
            <ActionsPanel m={m} onAdjust={onAdjust} onDelete={onDelete} />
          </td>
        </tr>
      )}
    </>
  );
}

const td = { padding: '0.85rem 1rem', verticalAlign: 'middle', borderBottom: '1px solid rgba(5,5,5,0.05)' };
const th = { padding: '0.65rem 1rem', fontFamily: F.data, fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#050505', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid rgba(5,5,5,0.08)', background: '#fafafa', whiteSpace: 'nowrap' };

// ── Mobile card ────────────────────────────────────────────────────────────
function MobileCard({ m, onAdjust, onDelete }) {
  const [open, setOpen] = useState(false);
  const status = getStatus(m);
  return (
    <div style={{ background: '#fff', border: `1px solid ${open ? 'rgba(5,5,5,0.18)' : 'rgba(5,5,5,0.08)'}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(5,5,5,0.04)', transition: 'border-color 0.15s' }}>
      {/* Card body */}
      <div style={{ padding: '1rem 1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <ImageZone materialId={m.id} name={m.name} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>{m.category}</p>
              <p style={{ fontFamily: F.ui, fontSize: '0.95rem', color: '#050505', fontWeight: 700 }}>{m.name}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
          <span style={{ fontFamily: F.ui, fontSize: '1.8rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.04em' }}>{parseFloat(m.stockQuantity).toFixed(1)}</span>
          <span style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#888', letterSpacing: '0.08em', fontWeight: 500 }}>{m.unit}</span>
          <div style={{ flex: 1 }}>
            <StockBar qty={m.stockQuantity} threshold={m.lowStockThreshold} />
            <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#bbb', letterSpacing: '0.08em', marginTop: '0.3rem', fontWeight: 500 }}>threshold: {parseFloat(m.lowStockThreshold).toFixed(1)} {m.unit}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div>
              <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem', fontWeight: 500 }}>Unit cost</p>
              <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>${parseFloat(m.unitCost).toFixed(2)}</p>
            </div>
            {m.provenance && (
              <div>
                <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem', fontWeight: 500 }}>Source</p>
                <p style={{ fontFamily: F.ui, fontSize: '0.8125rem', color: '#555', fontWeight: 500 }}>{m.provenance}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: '7px', cursor: 'pointer', fontFamily: F.ui, fontSize: '0.8125rem', fontWeight: 600, background: open ? '#050505' : '#f4f4f4', color: open ? '#FCFCFA' : '#050505', border: '1px solid rgba(5,5,5,0.1)', transition: 'all 0.15s' }}
          >
            Actions {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Actions panel */}
      {open && <ActionsPanel m={m} onAdjust={onAdjust} onDelete={onDelete} />}
    </div>
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

export default function VaultPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [adjusting, setAdjusting] = useState(null); // { material, type }
  const [showAdd, setShowAdd]     = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getMaterials().then((r) => setMaterials(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await deleteMaterial(deleteTarget.id);
      setMaterials((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || getStatus(m) === filter;
    return matchSearch && matchFilter;
  });

  const redCount    = materials.filter((m) => getStatus(m) === 'RED').length;
  const yellowCount = materials.filter((m) => getStatus(m) === 'YELLOW').length;
  const greenCount  = materials.filter((m) => getStatus(m) === 'GREEN').length;

  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Inventory</p>
          <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Vault</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#888', letterSpacing: '0.1em', fontWeight: 500 }}>{materials.length} materials</p>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: '#050505', border: 'none', borderRadius: '8px', color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#B68D40')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#050505')}>
            <Plus size={13} /> Add Material
          </button>
        </div>
      </div>

      {/* ── Health summary pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'RED',    label: 'Critical', count: redCount,    icon: AlertTriangle, color: '#dc2626' },
          { key: 'YELLOW', label: 'Caution',  count: yellowCount, icon: AlertTriangle, color: '#d97706' },
          { key: 'GREEN',  label: 'Healthy',  count: greenCount,  icon: CheckCircle,   color: '#16a34a' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.9rem', borderRadius: '8px',
              background: '#fff', border: '1px solid rgba(5,5,5,0.09)',
              boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
            }}>
              <Icon size={12} style={{ color: s.color }} />
              <span style={{ fontFamily: F.ui, fontSize: '1.3rem', fontWeight: 800, color: '#050505', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.count}</span>
              <span style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
          <Search size={12} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material or category…"
            style={{
              width: '100%', paddingLeft: '2.1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem',
              background: '#fff', border: '1px solid rgba(5,5,5,0.1)',
              borderRadius: '8px', fontFamily: F.ui, fontSize: '0.78rem', color: '#050505',
              outline: 'none', boxSizing: 'border-box', fontWeight: 400,
              boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#050505')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.1)')}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Status</option>
          <option value="RED">Critical</option>
          <option value="YELLOW">Caution</option>
          <option value="GREEN">Healthy</option>
        </select>
      </div>

      {/* ── Desktop table ── */}
      <div className="vault-table" style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(5,5,5,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['', 'Material', 'Category', 'Stock', 'Threshold', 'Unit Cost', 'Source', ''].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', fontFamily: F.ui, fontSize: '0.82rem', color: '#bbb', fontWeight: 500 }}>No materials found</td></tr>
            ) : (
              filtered.map((m, i) => <TableRow key={m.id} m={m} i={i} onAdjust={(mat, type) => setAdjusting({ material: mat, type })} onDelete={setDeleteTarget} />)
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="vault-cards" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: F.ui, fontSize: '0.82rem', color: '#bbb', fontWeight: 500, textAlign: 'center', padding: '2rem 0' }}>No materials found</p>
        ) : (
          filtered.map((m) => <MobileCard key={m.id} m={m} onAdjust={(mat, type) => setAdjusting({ material: mat, type })} onDelete={setDeleteTarget} />)
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title={`Delete "${deleteTarget.name}"`}
          description={`This will permanently remove ${deleteTarget.name} from the Vault.`}
          loading={!!deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {adjusting && (
        <AdjustModal
          material={adjusting.material}
          defaultType={adjusting.type}
          onClose={() => setAdjusting(null)}
          onDone={() => { setAdjusting(null); load(); }}
        />
      )}

      {showAdd && (
        <AddMaterialModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} />
      )}

      <style>{`
        input::placeholder { color: #bbb; }
        @media (min-width: 768px) {
          .vault-table { display: block !important; }
          .vault-cards { display: none !important; }
        }
        @media (max-width: 767px) {
          .vault-table { display: none !important; }
          .vault-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const selectStyle = {
  padding: '0.6rem 0.85rem',
  background: '#fff', border: '1px solid rgba(5,5,5,0.1)',
  borderRadius: '8px', fontFamily: F.ui, fontSize: '0.78rem', color: '#050505',
  outline: 'none', cursor: 'pointer', appearance: 'none',
  boxShadow: '0 1px 4px rgba(5,5,5,0.04)', fontWeight: 400,
};
