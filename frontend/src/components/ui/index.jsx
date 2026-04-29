// ── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-[#F4F4F4] rounded-2xl p-6 ${className}`}
      style={{ border: '1px solid rgba(182,141,64,0.12)' }}
    >
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  CUTTING:       'bg-slate-100 text-slate-600',
  STITCHING:     'bg-blue-50 text-blue-600',
  HARDWARE:      'bg-purple-50 text-purple-600',
  QA:            'bg-amber-50 text-amber-600',
  ARCHIVE_READY: 'bg-emerald-50 text-emerald-600',
  PENDING:       'bg-amber-50 text-amber-600',
  CONFIRMED:     'bg-blue-50 text-blue-600',
  SHIPPED:       'bg-purple-50 text-purple-600',
  DELIVERED:     'bg-emerald-50 text-emerald-600',
  CANCELLED:     'bg-red-50 text-red-500',
  OPEN:          'bg-amber-50 text-amber-600',
  CLOSED:        'bg-emerald-50 text-emerald-600',
};

export function Badge({ label }) {
  const style = BADGE_STYLES[label] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`font-data text-[10px] px-2.5 py-1 rounded-full ${style}`}>
      {label}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center gap-2 rounded-xl font-ui font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };
  const variants = {
    primary: 'bg-[#B68D40] text-white hover:bg-[#9a7535] active:scale-95',
    ghost:   'bg-transparent text-[#666] hover:bg-[#F4F4F4] border border-[rgba(182,141,64,0.2)]',
    danger:  'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────────────
export function Stat({ label, value, sub, icon: Icon, gold }) {
  return (
    <Card className="flex items-start gap-4">
      {Icon && (
        <div className={`p-2.5 rounded-xl ${gold ? 'bg-[#B68D40]/10' : 'bg-[#050505]/5'}`}>
          <Icon size={20} className={gold ? 'text-[#B68D40]' : 'text-[#050505]'} />
        </div>
      )}
      <div>
        <p className="text-xs text-[#666] font-ui">{label}</p>
        <p className="font-display text-3xl font-semibold text-[#050505] leading-tight">{value}</p>
        {sub && <p className="text-xs text-[#666] mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,5,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[#FCFCFA] rounded-2xl w-full max-w-lg shadow-2xl"
        style={{ border: '1px solid rgba(182,141,64,0.15)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F4]">
          <h2 className="font-display text-xl font-semibold text-[#050505]">{title}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-[#050505] text-xl leading-none cursor-pointer">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────
export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-[#666] font-ui">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-white border border-[rgba(182,141,64,0.2)] text-[#050505] placeholder-[#aaa] focus:outline-none focus:border-[#B68D40] transition-colors"
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-[#666] font-ui">{label}</label>}
      <select
        {...props}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-white border border-[rgba(182,141,64,0.2)] text-[#050505] focus:outline-none focus:border-[#B68D40] transition-colors"
      >
        {children}
      </select>
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────
export function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-[#666] font-ui">{label}</label>}
      <textarea
        {...props}
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-white border border-[rgba(182,141,64,0.2)] text-[#050505] placeholder-[#aaa] focus:outline-none focus:border-[#B68D40] transition-colors resize-none"
      />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
export function EmptyState({ message = 'No records found.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#666]">
      <div className="w-12 h-12 rounded-full bg-[#F4F4F4] flex items-center justify-center mb-3"
        style={{ border: '1px solid rgba(182,141,64,0.15)' }}>
        <span className="text-[#B68D40] text-xl">∅</span>
      </div>
      <p className="text-sm font-ui">{message}</p>
    </div>
  );
}

// ── Page header ───────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display text-4xl font-semibold text-[#050505] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#666] mt-1 font-ui">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-[#F4F4F4] border-t-[#B68D40] animate-spin" />
    </div>
  );
}
