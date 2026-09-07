// ui.jsx — shared contexts, icons, primitives. Exported to window.
const { createContext, useContext, useState, useEffect, useRef } = React;

// ── Contexts ───────────────────────────────────────────────
const ThemeCtx = createContext(null);
const AppCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);
const useApp = () => useContext(AppCtx);

// ── Icons (simple line set) ────────────────────────────────
function Icon({ name, size = 22, color = 'currentColor', stroke = 2, style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    back: <path d="M15 5l-7 7 7 7" {...p} />,
    close: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    search: <g {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></g>,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    minus: <path d="M5 12h14" {...p} />,
    trash: <g {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M10 11v6M14 11v6" /></g>,
    cart: <g {...p}><path d="M4 5h2l2.2 11.5a1 1 0 0 0 1 .8h7.4a1 1 0 0 0 1-.8L20 8H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></g>,
    tag: <g {...p}><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.4" /></g>,
    arrowRight: <path d="M4 12h15M13 6l6 6-6 6" {...p} />,
    lock: <g {...p}><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    check: <path d="M5 13l4 4 10-11" {...p} />,
    checkCircle: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" /></g>,
    chevron: <path d="M9 5l7 7-7 7" {...p} />,
    qr: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2M20 14v6M14 20h2M19 19h1" /></g>,
    phone: <g {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></g>,
    bolt: <path d="M13 3 L6 13 H11 L10 21 L18 10 H13 L13 3 Z" {...p} />,
    info: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    edit: <g {...p}><path d="M5 19h14M14 5l5 5-9 9H6v-4l8-10z" /></g>,
    receipt: <g {...p}><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3z" /><path d="M9 8h6M9 12h6" /></g>,
    download: <g {...p}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M5 19h14" /></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 10.9l6.8-3.8M8.1 13.1l6.8 3.8" /></g>,
    mail: <g {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7.5l8 5.5 8-5.5" /></g>,
    instagram: <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.1" cy="6.9" r="1.1" fill={color} stroke="none" /></g>,
    table: <g {...p}><rect x="3" y="9" width="18" height="3" rx="1" /><path d="M6 12v7M18 12v7" /></g>,
    gift: <g {...p}><rect x="4" y="9" width="16" height="11" rx="1.5" /></g>,
    copy: <g {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></g>,
    fire: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.8-2.5 1.5-3 .2 1 .8 1.5 1.5 1.5.8 0 1-1 .3-2.2C10.5 5.5 11 4 12 3z" {...p} />,
    spark: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...p} />,
    user: <g {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></g>,
    pin: <g {...p}><path d="M12 21C12 21 5 13.5 5 9a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></g>,
    home: <g {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" /></g>,
    dineIn: <g {...p}><path d="M12 3v10M8 3c0 3 1 5 4 6" /><path d="M16 3v4a4 4 0 0 1-4 4" /><path d="M10 19h4M12 13v6" /><ellipse cx="12" cy="20" rx="4" ry="1" /></g>,
    takeaway: <g {...p}><path d="M6 2h12l1 5H5L6 2z" /><path d="M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13" /><path d="M9 11h6" /></g>,
    whatsapp: <path fill={color} d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.69-.17 1.37z" />,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
    megaphone: <g {...p}><path d="M4 10v4h3l9 4V6l-9 4H4z" /><path d="M18.5 9a4 4 0 0 1 0 6" /><path d="M7 14v3.5a1.5 1.5 0 0 0 3 0V16" /></g>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>);

}

// ── Money display ──────────────────────────────────────────
function Money({ value, strike, style }) {
  // forced = default look for live prices (dark + bold); callers can still override
  // via the passed `style` (e.g. white price on a colored banner).
  const forced = strike ? { color: "rgb(140, 150, 149)" } : { fontWeight: "700", color: "rgb(19, 32, 31)" };
  return <span style={{ fontVariantNumeric: 'tabular-nums', textDecoration: strike ? 'line-through' : 'none', ...forced, ...style }}>{rupiah(value)}</span>;
}

// ── Option / modifier lines — satu modifier per baris (vertikal) ──
function OptLines({ options, size = 12, color, style }) {
  const t = useTheme();
  if (!options || !options.length) return null;
  return (
    <div style={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 1, ...style }}>
      {options.map((o, i) =>
      <span key={i} style={{ fontSize: size, color: color || t.muted, lineHeight: 1.42 }}>{o}</span>
      )}
    </div>);
}

// ── Button ─────────────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'lg', disabled, full, icon, style }) {
  const t = useTheme();
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: t.fontBody, fontWeight: 650, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: t.radius, width: full ? '100%' : undefined,
    letterSpacing: 0.1, transition: 'transform .12s ease, opacity .15s ease, background .15s',
    opacity: disabled ? 0.45 : 1, WebkitTapHighlightColor: 'transparent'
  };
  const sizes = {
    lg: { height: 54, fontSize: 16.5, padding: '0 22px' },
    md: { height: 44, fontSize: 15, padding: '0 18px' },
    sm: { height: 36, fontSize: 13.5, padding: '0 14px', borderRadius: t.radiusSm }
  };
  const variants = {
    primary: { background: t.primary, color: t.onPrimary, boxShadow: disabled ? 'none' : '0 6px 18px ' + hexA(t.primary, 0.28) },
    ghost: { background: 'transparent', color: t.ink, border: '1.5px solid ' + t.lineStrong },
    soft: { background: t.primarySoft, color: t.primary },
    dark: { background: t.ink, color: t.surface }
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style, fontWeight: "300" }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.975)')}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      
      {icon && <Icon name={icon} size={size === 'sm' ? 17 : 20} />}
      {children}
    </button>);

}

// ── Qty stepper ────────────────────────────────────────────
function QtyStepper({ value, onChange, min = 1, size = 'md', collapsible = false, onRemove }) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);
  const s = size === 'sm' ? 28 : 34;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setExpanded(false), 2500);
  };

  const handleExpand = () => {setExpanded(true);resetTimer();};
  const handleChange = (v) => {onChange(v);if (collapsible) resetTimer();};

  if (collapsible && !expanded) {
    return (
      <button onClick={handleExpand} className="om-press" style={{
        width: 24, height: 24, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: t.primary, color: t.onPrimary,
        fontFamily: t.fontBody,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent', borderRadius: "99px", fontWeight: "400", fontSize: "13px"
      }}>{value}</button>);

  }

  const btn = (icon, fn, off, danger) =>
  <button onClick={off ? undefined : () => {fn();if (collapsible) resetTimer();}} className={off ? undefined : 'om-press'} style={{
    width: s, height: s, borderRadius: 999, border: 'none', cursor: off ? 'default' : 'pointer',
    background: 'transparent', color: off ? t.faint : danger ? '#BE4137' : t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent'
  }}><Icon name={icon} size={size === 'sm' ? 15 : 18} stroke={2.4} /></button>;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: t.surface2, border: '1px solid ' + t.line, borderRadius: 999, padding: 2, flexShrink: 0 }}>
      {value <= min && onRemove ?
      btn('minus', onRemove, false) :
      btn('minus', () => handleChange(Math.max(min, value - 1)), value <= min)}
      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontSize: size === 'sm' ? 14 : 15.5, fontVariantNumeric: 'tabular-nums', color: t.ink }}>{value}</span>
      {btn('plus', () => handleChange(value + 1))}
    </div>);

}

// ── Tag / pill ─────────────────────────────────────────────
function Pill({ children, tone = 'neutral', icon, style }) {
  const t = useTheme();
  const tones = {
    neutral: { bg: t.surface2, fg: t.muted, bd: t.line },
    primary: { bg: t.primarySoft, fg: t.primary, bd: 'transparent' },
    promo: { bg: t.primarySoft, fg: t.primary, bd: 'transparent' },
    danger: { bg: 'rgba(190,60,55,0.10)', fg: '#BE4137', bd: 'transparent' }
  };
  const c = tones[tone] || tones.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 999,
      background: c.bg, color: c.fg, border: '1px solid ' + c.bd, fontSize: 11.5, fontWeight: 700,
      letterSpacing: 0.3, textTransform: 'uppercase', ...style }}>
      {icon && <Icon name={icon} size={12} stroke={2.4} />}
      {children}
    </span>);

}

// ── Food image placeholder (striped, monospace caption) ────
function FoodImg({ label, h = 120, radius, style, src }) {
  const t = useTheme();
  const r = radius != null ? radius : t.radiusSm;
  const [imgOk, setImgOk] = useState(false);
  const stripes = `repeating-linear-gradient(135deg, ${t.placeholder} 0 10px, ${shade(t.placeholder, -4)} 10px 20px)`;
  return (
    <div style={{ position: 'relative', height: h, borderRadius: r, overflow: 'hidden', flexShrink: 0,
      background: stripes, display: 'flex', alignItems: 'flex-end', ...style }}>
      {src &&
      <img src={src} alt={label}
      onLoad={() => setImgOk(true)}
      onError={() => setImgOk(false)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: imgOk ? 1 : 0, transition: 'opacity .35s ease' }} />
      }
      {!imgOk &&
      <span style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 9.5, color: t.placeholderInk,
        padding: '5px 7px', letterSpacing: 0.2, lineHeight: 1.2 }}>foto · {label}</span>
      }
    </div>);

}

// ── Bottom sheet shell ─────────────────────────────────────
function Sheet({ children, onClose, title, footer, maxH = '86%' }) {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,8,0.42)', animation: 'om-fade .2s ease' }} />
      <div style={{ position: 'relative', background: t.surface, borderTopLeftRadius: t.radiusLg, borderTopRightRadius: t.radiusLg,
        maxHeight: maxH, display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 40px rgba(0,0,0,0.25)', animation: 'om-sheet .28s cubic-bezier(.2,.9,.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ ...{ width: 40, height: 5, borderRadius: 999, background: t.primary }, background: "rgb(134, 134, 134)", height: "4px" }} />
        </div>
        {title &&
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 6px' }}>
            <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 24, color: t.ink }}>{title}</h3>
            <button onClick={onClose} style={{ border: 'none', background: t.primarySoft, width: 34, height: 34, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="close" size={18} color={t.primary} /></button>
          </div>
        }
        <div style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', flex: 1, padding: '4px 20px 16px' }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px calc(16px + env(safe-area-inset-bottom))', borderTop: '1px solid ' + t.line, background: t.surface }}>{footer}</div>}
      </div>
    </div>);

}

// ── Screen scaffold: status-clearing top bar + scroll body + optional dock ──
function TopBar({ title, onBack, right, transparent, big, sub, flush }) {
  const t = useTheme();
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, paddingTop: flush ? 6 : 50,
      background: transparent ? 'transparent' : t.bg,
      borderBottom: transparent ? '1px solid transparent' : '1px solid ' + t.line }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 12px', minHeight: 44 }}>
        {onBack &&
        <button onClick={onBack} style={{ border: 'none', background: t.surface, boxShadow: t.shadow, width: 40, height: 40, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.ink, flexShrink: 0 }}><Icon name="back" size={20} /></button>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={{ fontFamily: big ? t.fontDisplay : t.fontBody, fontStyle: big && t.displayItalic ? 'italic' : 'normal', fontWeight: big ? t.displayWeight : 700, fontSize: big ? 26 : 17, color: t.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
          {sub && <div style={{ fontSize: 12.5, color: t.muted, marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>);

}

// ── color helpers ──────────────────────────────────────────
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16),g = parseInt(n.slice(2, 4), 16),b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  let r = parseInt(n.slice(0, 2), 16) + amt,g = parseInt(n.slice(2, 4), 16) + amt,b = parseInt(n.slice(4, 6), 16) + amt;
  const cl = (x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0');
  return '#' + cl(r) + cl(g) + cl(b);
}

// ── Confirm dialog — global destructive-action confirmation ─
function ConfirmDialog() {
  const t = useTheme();
  const app = useApp();
  const c = app.confirm;
  if (!c) return null;
  const onCancel = () => app.closeConfirm();
  const onOk = () => {app.closeConfirm();c.onConfirm && c.onConfirm();};
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 120, background: hexA('#0a1413', 0.5), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, animation: 'om-fade .2s ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: t.surface, borderRadius: t.radiusLg, padding: '24px 22px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink, lineHeight: 1.15 }}>{c.title || 'Hapus item?'}</h3>
        {c.message && <p style={{ margin: '8px 0 20px', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>{c.message}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: c.message ? 0 : 20 }}>
          <Button variant="ghost" size="md" full onClick={onCancel}>{c.cancelLabel || 'Batal'}</Button>
          <Button size="md" full onClick={onOk} style={c.tone === 'primary' ? { boxShadow: 'none' } : { background: '#BE4137', boxShadow: 'none', color: '#fff' }}>{c.confirmLabel || 'Hapus'}</Button>
        </div>
      </div>
    </div>);

}

// ── OrderTypePills — segmented Dine In / Take Away ─────────
// Visual segmented control. Ketuk segmen → buka sheet konfirmasi (pre-select segmen itu).
function OrderTypePills({ style }) {
  const t = useTheme();
  const app = useApp();
  const opts = [
  { id: 'dinein', label: 'Dine In', icon: 'dineIn' },
  { id: 'takeaway', label: 'Take Away', icon: 'takeaway' }];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: 4, padding: 4, background: t.surface2, borderRadius: 12, border: '1px solid ' + t.line, ...style }}>
      {opts.map((o) => {
        const on = app.orderType === o.id;
        return (
          <button
            key={o.id}
            onClick={() => app.openSheet('orderType', { pending: o.id })}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: on ? t.primary : 'transparent',
              boxShadow: on ? '0 1px 3px ' + hexA(t.primary, 0.35) : 'none',
              fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              color: on ? t.onPrimary : t.muted,
              WebkitTapHighlightColor: 'transparent', transition: 'background .15s, color .15s' }}>

            <Icon name={o.icon} size={16} color={on ? t.onPrimary : t.faint} stroke={1.9} />
            {o.label}
          </button>);

      })}
    </div>);

}

Object.assign(window, {
  ThemeCtx, AppCtx, useTheme, useApp,
  Icon, Money, OptLines, Button, QtyStepper, Pill, FoodImg, Sheet, TopBar, ConfirmDialog, OrderTypePills, hexA, shade
});