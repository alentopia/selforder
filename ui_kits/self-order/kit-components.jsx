// kit-components.jsx — lightweight local copies of the design-system primitives for
// this UI kit demo (plain globals, no ESM export — the authoritative, exported
// components live in /components/**). Keep visuals identical to those files.
function Icon({ name, size = 22, color = 'currentColor', stroke = 2, style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    back: <path d="M15 5l-7 7 7 7" {...p} />,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    minus: <path d="M5 12h14" {...p} />,
    cart: <g {...p}><path d="M4 5h2l2.2 11.5a1 1 0 0 0 1 .8h7.4a1 1 0 0 0 1-.8L20 8H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></g>,
    check: <path d="M5 13l4 4 10-11" {...p} />,
    checkCircle: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" /></g>,
    qr: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2M20 14v6M14 20h2M19 19h1" /></g>,
    receipt: <g {...p}><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3z" /><path d="M9 8h6M9 12h6" /></g>,
    tag: <g {...p}><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.4" /></g>,
    coupon: <g {...p}><path d="M3 7.5h18v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3v-3z" /><path d="M13 7.5v1.5M13 13v1.5M13 18.5V20" /></g>,
    dineIn: <g {...p}><path d="M12 3v10M8 3c0 3 1 5 4 6" /><path d="M16 3v4a4 4 0 0 1-4 4" /><path d="M10 19h4M12 13v6" /><ellipse cx="12" cy="20" rx="4" ry="1" /></g>,
    table: <g {...p}><rect x="3" y="9" width="18" height="3" rx="1" /><path d="M6 12v7M18 12v7" /></g>,
    pin: <g {...p}><path d="M12 21C12 21 5 13.5 5 9a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></g>,
    user: <g {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></g>,
    download: <g {...p}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M5 19h14" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 10.9l6.8-3.8M8.1 13.1l6.8 3.8" /></g>,
    info: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
    bolt: <path d="M13 3 L6 13 H11 L10 21 L18 10 H13 L13 3 Z" {...p} />,
    chevron: <path d="M9 5l7 7-7 7" {...p} />,
    close: <path d="M6 6l12 12M18 6L6 18" {...p} />
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={style}>{paths[name] || null}</svg>;
}
function rupiah(n) { return 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0)); }
function Money({ value, strike, style }) {
  const forced = strike ? { color: 'var(--color-muted)' } : { fontWeight: 700, color: 'var(--color-ink)' };
  return <span style={{ fontVariantNumeric: 'tabular-nums', textDecoration: strike ? 'line-through' : 'none', fontFamily: 'var(--font-body)', ...forced, ...style }}>{rupiah(value)}</span>;
}
function Button({ children, onClick, variant = 'primary', size = 'lg', disabled, loading, full, icon, style }) {
  const isDisabled = disabled || loading;
  const sizes = { lg: { height: 54, fontSize: 16.5, padding: '0 22px' }, md: { height: 44, fontSize: 15, padding: '0 18px' }, sm: { height: 36, fontSize: 13, padding: '0 14px', borderRadius: 'var(--radius-sm)' } };
  const variants = {
    primary: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', boxShadow: disabled ? 'none' : 'var(--shadow-button)' },
    ghost: { background: 'transparent', color: 'var(--color-ink)', border: '1.5px solid var(--color-line-strong)' },
    soft: { background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }
  };
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 'var(--radius-md)', width: full ? '100%' : undefined, whiteSpace: 'nowrap', opacity: disabled ? 0.45 : 1 };
  const spinnerColor = variant === 'ghost' ? 'var(--color-ink)' : variant === 'soft' ? 'var(--color-primary)' : 'var(--color-on-primary)';
  return (
    <button onClick={isDisabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {loading ? <span style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid ' + spinnerColor, borderTopColor: 'transparent', opacity: 0.9, animation: 'ds-spin .7s linear infinite', flexShrink: 0 }} /> : icon}
      {children}
    </button>
  );
}
function Pill({ children, tone = 'neutral', style }) {
  const tones = { neutral: { bg: 'var(--color-surface-2)', fg: 'var(--color-muted)' }, primary: { bg: 'var(--color-primary-soft)', fg: 'var(--color-primary)' }, danger: { bg: 'var(--color-danger-soft)', fg: 'var(--color-danger)' } };
  const c = tones[tone] || tones.neutral;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', fontFamily: 'var(--font-body)', ...style }}>{children}</span>;
}
if (typeof document !== 'undefined' && !document.getElementById('ds-spin-kf')) {
  const s = document.createElement('style');
  s.id = 'ds-spin-kf';
  s.textContent = '@keyframes ds-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}
function FoodImg({ label, h = 120, radius = 12, style, src }) {
  const [ok, setOk] = React.useState(false);
  return (
    <div style={{ position: 'relative', height: h, borderRadius: radius, overflow: 'hidden', background: 'var(--color-placeholder)', display: 'flex', alignItems: 'flex-end', flexShrink: 0, ...style }}>
      {src && <img src={src} onLoad={() => setOk(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: ok ? 1 : 0, transition: 'opacity .3s' }} />}
      {!ok && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-placeholder-ink)', padding: 5 }}>foto</span>}
    </div>
  );
}
function TopBar({ title, onBack, backIcon, right, big, sub, flush }) {
  return (
    <div style={{ paddingTop: flush ? 6 : 50, background: 'var(--color-bg)', borderBottom: '1px solid var(--color-line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 12px', minHeight: 44 }}>
        {onBack && <button onClick={onBack} style={{ border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', width: 40, height: 40, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{backIcon}</button>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={{ fontFamily: big ? 'var(--font-display)' : 'var(--font-body)', fontWeight: big ? 600 : 700, fontSize: big ? 26 : 17, color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
          {sub && <div style={{ fontSize: 12.5, color: 'var(--color-muted)', marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}
function QtyStepper({ value, onChange, min = 1, size = 'md', onRemove }) {
  const s = size === 'sm' ? 26 : 34;
  const btn = (label, fn, off) => <button onClick={off ? undefined : fn} style={{ width: s, height: s, borderRadius: 999, border: 'none', cursor: off ? 'default' : 'pointer', background: 'transparent', color: off ? 'var(--color-faint)' : 'var(--color-primary)', fontSize: 15, fontWeight: 700 }}>{label}</button>;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--color-surface-2)', border: '1px solid var(--color-line)', borderRadius: 999, padding: 2, flexShrink: 0 }}>
      {value <= min && onRemove ? btn('\u2212', onRemove) : btn('\u2212', () => onChange(Math.max(min, value - 1)), value <= min)}
      <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 700, fontSize: size === 'sm' ? 13 : 15, color: 'var(--color-ink)' }}>{value}</span>
      {btn('+', () => onChange(value + 1))}
    </div>
  );
}
function EmptyState({ title, desc, size = 160, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ width: size, height: size, marginBottom: 14, borderRadius: 20, background: 'var(--color-surface-2)', border: '1.5px dashed var(--color-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-faint)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>illustration</div>
      <p style={{ color: 'var(--color-ink)', fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</p>
      <p style={{ color: 'var(--color-muted)', fontSize: 13.5, margin: '4px 0 0', lineHeight: 1.5, maxWidth: 240 }}>{desc}</p>
      {children}
    </div>
  );
}
