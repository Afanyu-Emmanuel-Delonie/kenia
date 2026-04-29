import { useState, useEffect, useRef } from 'react';
import { getStoreListings, createListing, updateListing, uploadListingImage, getProducts } from '../../api/services';
import { Package, Plus, X, Search, Eye, EyeOff, Tag, Edit2, ImagePlus, Trash2 } from 'lucide-react';

const F = { display: 'Cormorant Garamond, serif', ui: 'Inter, sans-serif', data: 'IBM Plex Mono, monospace' };

const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem', boxSizing: 'border-box',
  background: '#fff', border: '1px solid rgba(5,5,5,0.12)', borderRadius: '8px',
  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#050505',
  outline: 'none', fontWeight: 400,
};
const labelStyle = {
  fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: '#050505',
  letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block',
  marginBottom: '0.4rem', fontWeight: 500,
};

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #f4f4f4', borderTopColor: '#050505', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AvailBadge({ available }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.22rem 0.6rem', borderRadius: '4px',
      background: available ? '#f0fdf4' : '#f4f4f4',
      border: `1px solid ${available ? '#16a34a33' : '#e5e5e5'}`,
      fontFamily: F.data, fontSize: '0.44rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: available ? '#16a34a' : '#aaa', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: available ? '#22c55e' : '#ccc', display: 'inline-block' }} />
      {available ? 'Available' : 'Unlisted'}
    </span>
  );
}

function ListingModal({ listing, products, onClose, onDone }) {
  const isEdit = !!listing;
  const [form, setForm] = useState({
    productId: listing?.product?.id ?? '',
    title: listing?.title ?? '',
    description: listing?.description ?? '',
    price: listing?.price ?? '',
    currency: listing?.currency ?? 'USD',
    available: listing?.available ?? true,
  });
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [imgPreview, setImgPreview] = useState(
    listing?.imagePaths ? `http://localhost:8084/uploads/${listing.imagePaths.split(',')[0]}` : null
  );
  const firstRef = useRef(null);
  const imgRef   = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !isEdit) return;
    setImgPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await uploadListingImage(listing.id, file);
    } catch { setError('Image upload failed.'); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) { setError('Title and price are required.'); return; }
    if (!isEdit && !form.productId) { setError('Select a product.'); return; }
    setLoading(true); setError('');
    try {
      if (isEdit) {
        await updateListing(listing.id, {
          title: form.title, description: form.description,
          price: parseFloat(form.price), currency: form.currency,
          available: form.available,
        });
      } else {
        await createListing({
          productId: parseInt(form.productId), title: form.title,
          description: form.description, price: parseFloat(form.price),
          currency: form.currency,
        });
      }
      onDone();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const eligible = products.filter((p) => p.activated);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', border: '1px solid rgba(5,5,5,0.1)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '460px', margin: '1rem', boxShadow: '0 8px 40px rgba(5,5,5,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: F.data, fontSize: '0.46rem', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>
              Catalog · {isEdit ? 'Edit' : 'New'}
            </p>
            <p style={{ fontFamily: F.ui, fontSize: '1.2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {isEdit ? 'Edit Listing' : 'New Listing'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#bbb', display: 'flex' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isEdit && (
            <div>
              <label style={labelStyle}>Product (activated bags only)</label>
              <select ref={firstRef} value={form.productId} onChange={set('productId')}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#050505')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}>
                <option value="">Select a bag…</option>
                {eligible.map((p) => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>Listing Title</label>
            <input ref={isEdit ? firstRef : undefined} value={form.title} onChange={set('title')}
              placeholder="e.g. Obsidian Tote — Limited Edition"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#050505')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3}
              placeholder="Describe the bag, materials, craftsmanship…"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = '#050505')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Price</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#050505')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Currency</label>
              <select value={form.currency} onChange={set('currency')}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#050505')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(5,5,5,0.12)')}>
                {['USD', 'EUR', 'GBP', 'RWF', 'KES', 'NGN'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Image upload — edit only */}
          {isEdit && (
            <div>
              <label style={labelStyle}>Product Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
                  background: '#f4f4f4', border: '1px solid rgba(5,5,5,0.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {imgPreview
                    ? <img src={imgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Package size={22} style={{ color: '#ccc' }} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <button type="button" onClick={() => imgRef.current?.click()} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 0.9rem', borderRadius: '6px', cursor: 'pointer',
                    fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600,
                    background: '#f4f4f4', color: '#050505', border: '1px solid rgba(5,5,5,0.09)',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#050505'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f4f4f4'; e.currentTarget.style.color = '#050505'; }}
                  >
                    <ImagePlus size={12} /> {uploading ? 'Uploading…' : 'Upload Image'}
                  </button>
                  <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#bbb', letterSpacing: '0.08em', marginTop: '0.4rem' }}>JPG, PNG — max 10MB</p>
                  <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagePick} />
                </div>
              </div>
            </div>
          )}

          {isEdit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f9f9f7', borderRadius: '8px', border: '1px solid rgba(5,5,5,0.07)' }}>
              <label style={{ ...labelStyle, marginBottom: 0, flex: 1 }}>Availability</label>
              <button type="button" onClick={() => setForm((f) => ({ ...f, available: !f.available }))} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
                fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600, border: 'none',
                background: form.available ? '#f0fdf4' : '#f4f4f4',
                color: form.available ? '#16a34a' : '#aaa', transition: 'all 0.15s',
              }}>
                {form.available ? <Eye size={12} /> : <EyeOff size={12} />}
                {form.available ? 'Available' : 'Unlisted'}
              </button>
            </div>
          )}

          {error && <p style={{ fontFamily: F.ui, fontSize: '0.72rem', color: '#dc2626', fontWeight: 500 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.25rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(5,5,5,0.12)', background: '#fff', color: '#050505', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#050505', color: '#FCFCFA', fontFamily: F.ui, fontSize: '0.8rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'background 0.15s' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#B68D40'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#050505'; }}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListingCard({ listing, onEdit }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(5,5,5,0.09)', borderRadius: '14px',
      padding: '1.25rem', boxShadow: '0 1px 4px rgba(5,5,5,0.04)',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(5,5,5,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,5,5,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(5,5,5,0.09)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(5,5,5,0.04)'; }}
    >
      <div style={{
        width: '100%', aspectRatio: '4/3', borderRadius: '10px',
        background: 'linear-gradient(135deg, #f4f4f4 0%, #e8e8e6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(5,5,5,0.06)', overflow: 'hidden',
      }}>
        {listing.imagePaths ? (
          <img src={`http://localhost:8084/uploads/${listing.imagePaths.split(',')[0]}`} alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <Package size={28} style={{ color: '#ccc' }} />
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <p style={{ fontFamily: F.ui, fontSize: '0.88rem', fontWeight: 700, color: '#050505', lineHeight: 1.3 }}>{listing.title}</p>
          <AvailBadge available={listing.available} />
        </div>
        <p style={{ fontFamily: F.data, fontSize: '0.75rem', color: '#B68D40', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.35rem' }}>
          {listing.product?.sku}
        </p>
        {listing.description && (
          <p style={{ fontFamily: F.ui, fontSize: '0.8125rem', color: '#666', fontWeight: 400, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {listing.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(5,5,5,0.06)' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.6875rem', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Price</p>
          <p style={{ fontFamily: F.ui, fontSize: '1.1rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.02em' }}>
            {listing.currency} {parseFloat(listing.price).toLocaleString()}
          </p>
        </div>
        <button onClick={() => onEdit(listing)} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer',
          fontFamily: F.ui, fontSize: '0.72rem', fontWeight: 600,
          background: '#f4f4f4', color: '#050505', border: '1px solid rgba(5,5,5,0.09)',
          transition: 'all 0.15s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#050505'; e.currentTarget.style.color = '#FCFCFA'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f4f4f4'; e.currentTarget.style.color = '#050505'; }}
        >
          <Edit2 size={11} /> Edit
        </button>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [listings, setListings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('ALL');
  const [modal, setModal]       = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getStoreListings(), getProducts()])
      .then(([l, p]) => { setListings(Array.isArray(l.data) ? l.data : []); setProducts(Array.isArray(p.data) ? p.data : []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const availCount    = listings.filter((l) => l.available).length;
  const unlistedCount = listings.filter((l) => !l.available).length;

  const visible = listings.filter((l) => {
    if (filter === 'AVAILABLE' && !l.available) return false;
    if (filter === 'UNLISTED'  &&  l.available) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return l.title?.toLowerCase().includes(q) || l.product?.sku?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontFamily: F.data, fontSize: '0.5rem', color: '#050505', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 500 }}>Store</p>
          <h1 style={{ fontFamily: F.ui, fontSize: '2rem', fontWeight: 800, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>Catalog</h1>
        </div>
        <button onClick={() => setModal('new')} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.55rem 1.1rem', background: '#050505', border: 'none',
          borderRadius: '8px', color: '#FCFCFA', fontFamily: F.ui,
          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.15s', whiteSpace: 'nowrap',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#B68D40')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#050505')}
        >
          <Plus size={13} /> New Listing
        </button>
      </div>

      {/* ── Stat pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ALL',       label: 'All',      count: listings.length, icon: Package, color: '#050505' },
          { key: 'AVAILABLE', label: 'Available', count: availCount,     icon: Eye,     color: '#16a34a' },
          { key: 'UNLISTED',  label: 'Unlisted',  count: unlistedCount,  icon: EyeOff,  color: '#aaa'    },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setFilter(s.key)} style={{
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
      <div style={{ position: 'relative', maxWidth: '320px' }}>
        <Search size={12} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or SKU…"
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

      {/* ── Grid ── */}
      {loading ? <Spinner /> : visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Tag size={32} style={{ color: '#ddd', margin: '0 auto 0.75rem' }} />
          <p style={{ fontFamily: F.ui, fontSize: '0.85rem', color: '#aaa', fontWeight: 500 }}>No listings found</p>
          <p style={{ fontFamily: F.ui, fontSize: '0.75rem', color: '#ccc', marginTop: '0.35rem' }}>Activate a bag first, then create a listing.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {visible.map((l) => <ListingCard key={l.id} listing={l} onEdit={setModal} />)}
        </div>
      )}

      {modal === 'new' && (
        <ListingModal products={products} onClose={() => setModal(null)} onDone={() => { setModal(null); load(); }} />
      )}
      {modal && modal !== 'new' && (
        <ListingModal listing={modal} products={products} onClose={() => setModal(null)} onDone={() => { setModal(null); load(); }} />
      )}

      <style>{`input::placeholder { color: #bbb; }`}</style>
    </div>
  );
}
