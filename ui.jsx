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
    back: <path d="M15 19l-7-7 7-7" {...p} />,
    close: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    search: <g {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></g>,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    minus: <path d="M5 12h14" {...p} />,
    trash: <g {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M10 11v6M14 11v6" /></g>,
    cart: <g {...p}><path d="M5 4h2l2.6 12.6c.1.6.7 1.1 1.4 1.1h7c.7 0 1.2-.5 1.4-1.1L21 8H8" /><circle cx="10.5" cy="20.5" r="1.5" fill={color} stroke="none" /><circle cx="17.5" cy="20.5" r="1.5" fill={color} stroke="none" /></g>,
    tag: <g {...p}><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.4" /></g>,
    arrowRight: <path d="M4 12h15M13 6l6 6-6 6" {...p} />,
    lock: <g {...p}><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    check: <path d="M4 12.6L9 17.5L20 6.5" {...p} />,
    checkCircle: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" /></g>,
    chevron: <path d="M9 5l7 7-7 7" {...p} />,
    qr: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2M20 14v6M14 20h2M19 19h1" /></g>,
    phone: <g {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></g>,
    bolt: <path d="M13 3 L6 13 H11 L10 21 L18 10 H13 L13 3 Z" {...p} />,
    info: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    calendar: <g {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></g>,
    repeat: <g {...p}><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></g>,
    edit: <g {...p}><path d="M5 19h14M14 5l5 5-9 9H6v-4l8-10z" /></g>,
    receipt: <g {...p}><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3z" /><path d="M9 8h6M9 12h6" /></g>,
    download: <g {...p}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M5 19h14" /></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 10.9l6.8-3.8M8.1 13.1l6.8 3.8" /></g>,
    mail: <g {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7.5l8 5.5 8-5.5" /></g>,
    instagram: <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.1" cy="6.9" r="1.1" fill={color} stroke="none" /></g>,
    table: <g {...p}><rect x="3" y="10" width="18" height="4" rx="1.5" /><path d="M6 14v6M18 14v6M4 10l2-4h12l2 4" /></g>,
    gift: <g {...p}><rect x="4" y="8.5" width="16" height="4" rx="1" /><path d="M5 12.5v6.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5M12 8.5v11.5" /><path d="M12 8.5S10.5 4 8.2 4.6C6.6 5 6.8 7.8 9 8.5h3zM12 8.5s1.5-4.5 3.8-3.9C17.4 5 17.2 7.8 15 8.5h-3z" /></g>,
    copy: <g {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></g>,
    fire: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.8-2.5 1.5-3 .2 1 .8 1.5 1.5 1.5.8 0 1-1 .3-2.2C10.5 5.5 11 4 12 3z" {...p} />,
    spark: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...p} />,
    user: <g {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></g>,
    pin: <g {...p}><path d="M12 22s-8-6.5-8-12a8 8 0 0 1 16 0c0 5.5-8 12-8 12z" /><circle cx="12" cy="10" r="3" /></g>,
    home: <g {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" /></g>,
    // dineIn & takeaway: ikon terisi dari Figma (Icon/dineIn = Material local_dining, Icon/takeaway)
    dineIn: <path fill={color} d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />,
    takeaway: <path fill={color} d="M5.23 10L3 7.45L4.19 6.05L5.55 7.65L5.51 7.05L8.95 3H14.05L17.49 7.05L17.45 7.65L18.81 6.05L20 7.45L17.77 10H5.23ZM6.36 20L5.8 11.55H17.2L16.64 20H6.36Z" />,
    // store: Figma Icon/storefront (Material storefront, terisi) — opsi "Bayar di Kasir"
    store: <path fill={color} d="M21 11.05V19C21 19.55 20.8 20.02 20.41 20.41C20.02 20.8 19.55 21 19 21H5C4.45 21 3.98 20.8 3.59 20.41C3.2 20.02 3 19.55 3 19V11.05C2.62 10.7 2.32 10.25 2.11 9.7C1.9 9.15 1.9 8.55 2.1 7.9L3.15 4.5C3.28 4.07 3.52 3.71 3.86 3.43C4.2 3.14 4.6 3 5.05 3H18.95C19.4 3 19.79 3.14 20.12 3.41C20.46 3.69 20.7 4.05 20.85 4.5L21.9 7.9C22.1 8.55 22.1 9.14 21.89 9.67C21.68 10.21 21.38 10.67 21 11.05ZM14.2 10C14.65 10 14.99 9.85 15.22 9.54C15.46 9.23 15.55 8.88 15.5 8.5L14.95 5H13V8.7C13 9.05 13.12 9.35 13.35 9.61C13.58 9.87 13.87 10 14.2 10ZM9.7 10C10.08 10 10.4 9.87 10.64 9.61C10.88 9.35 11 9.05 11 8.7V5H9.05L8.5 8.5C8.43 8.9 8.52 9.25 8.76 9.55C9 9.85 9.32 10 9.7 10ZM5.25 10C5.55 10 5.81 9.89 6.04 9.67C6.26 9.46 6.4 9.18 6.45 8.85L7 5H5.05L4.05 8.35C3.95 8.68 4 9.04 4.21 9.43C4.42 9.81 4.77 10 5.25 10ZM18.75 10C19.23 10 19.58 9.81 19.8 9.43C20.02 9.04 20.07 8.68 19.95 8.35L18.9 5H17L17.55 8.85C17.6 9.18 17.74 9.46 17.96 9.67C18.19 9.89 18.45 10 18.75 10ZM5 19H19V11.95C18.92 11.98 18.86 12 18.84 12H18.75C18.3 12 17.9 11.92 17.56 11.78C17.22 11.62 16.88 11.38 16.55 11.05C16.25 11.35 15.91 11.58 15.52 11.75C15.14 11.92 14.73 12 14.3 12C13.85 12 13.43 11.92 13.04 11.75C12.64 11.58 12.3 11.35 12 11.05C11.72 11.35 11.39 11.58 11.01 11.75C10.64 11.92 10.23 12 9.8 12C9.32 12 8.88 11.92 8.49 11.75C8.1 11.58 7.75 11.35 7.45 11.05C7.1 11.4 6.75 11.65 6.41 11.79C6.07 11.93 5.68 12 5.25 12H5.14C5.1 12 5.05 11.98 5 11.95V19Z" />,
    whatsapp: <path fill={color} d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.69-.17 1.37z" />,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
    megaphone: <g {...p}><path d="M4 10v4h3l9 4V6l-9 4H4z" /><path d="M18.5 9a4 4 0 0 1 0 6" /><path d="M7 14v3.5a1.5 1.5 0 0 0 3 0V16" /></g>,
    percent: <g {...p}><circle cx="7.5" cy="7.5" r="1.9" /><circle cx="16.5" cy="16.5" r="1.9" /><path d="M18 6L6 18" /></g>,
    coupon: <g {...p}><path d="M3 7.5h18v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3v-3z" /><path d="M13 7.5v1.5M13 13v1.5M13 18.5V20" /></g>
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
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {options.map((o, i) =>
      <span key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: size, color: color || t.muted, lineHeight: 1.42 }}>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 5, height: 5, marginTop: 1, borderRadius: 999, border: '1px solid ' + t.faint, alignSelf: 'center' }} />
        <span>{o}</span>
      </span>
      )}
    </div>);
}

// ── Struk Rinci — pecah harga dasar + tiap tambahan berbayar per baris ──
// Rekonstruksi grup + harga per opsi dari definisi mods item; sisanya (mis. isi
// paket / opsi tak dikenal) tetap tampil sebagai baris label. Item gratis → semua Rp0.
function lineBreakdown(line) {
  const item = itemById(line.itemId);
  const defs = (item && item.mods) || [];
  const opts = line.options || [];
  const base = line.free ? 0 : item ? item.price : line.unit;
  const used = opts.map(() => false);
  const mods = [];
  defs.forEach((g) => {
    g.options.forEach((o) => {
      const paid = o.label + ' (+' + rupiah(o.price) + ')';
      const idx = opts.findIndex((s, i) => !used[i] && (s === o.label || s === paid));
      if (idx !== -1) {used[idx] = true;mods.push({ group: g.label, label: o.label, price: line.free ? 0 : o.price });}
    });
  });
  opts.forEach((s, i) => {
    if (used[i]) return;
    const m = s.match(/^(.*) \(\+Rp([\d.,]+)\)$/);
    if (m) mods.push({ group: null, label: m[1], price: line.free ? 0 : Number(m[2].replace(/[^\d]/g, '')) });
    else mods.push({ group: null, label: s, price: 0 });
  });
  return { base, mods };
}

// Baris rincian gaya struk: modifier dikelompokkan per grup. Grup dengan >1 opsi
// tampil sebagai header sekali + daftar di bawahnya (mis. "Tambahan:" lalu tiap item).
// Grup 1 opsi tampil inline "Grup: Nilai". Harga inline dalam kurung (×qty); gratis = tanpa harga.
function ReceiptLines({ line, size = 12, style }) {
  const t = useTheme();
  const { mods } = lineBreakdown(line);
  if (!mods.length) return null;
  const q = line.qty || 1;
  const priceStr = (p) => p > 0 ? ' (+' + rupiah(p * q) + ')' : '';
  // kelompokkan berdasar nama grup; opsi tanpa grup (null) berdiri sendiri
  const groups = [];
  mods.forEach((m) => {
    const g = m.group ? groups.find((x) => x.name === m.group) : null;
    if (g) g.items.push(m);else groups.push({ name: m.group || null, items: [m] });
  });
  return (
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3, ...style }}>
      {groups.map((g, gi) => {
        if (!g.name) return g.items.map((m, i) =>
        <span key={gi + '-' + i} style={{ fontSize: size, color: t.muted, lineHeight: 1.4 }}>{m.label}{priceStr(m.price)}</span>);
        // pilihan tunggal & pendek → inline; grup banyak-opsi / nama panjang → header + list
        const inlineStr = g.name + ': ' + g.items[0].label + priceStr(g.items[0].price);
        const useHeader = g.items.length > 1 || inlineStr.length > 38;
        if (useHeader) return (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: size, color: t.faint, lineHeight: 1.4 }}>{g.name}:</span>
            {g.items.map((m, i) =>
            <span key={i} style={{ fontSize: size, color: t.muted, lineHeight: 1.4, paddingLeft: 10 }}>{m.label}{priceStr(m.price)}</span>)}
          </div>);
        return (
          <span key={gi} style={{ fontSize: size, color: t.muted, lineHeight: 1.4 }}>
            <span style={{ color: t.faint }}>{g.name}: </span>{g.items[0].label}{priceStr(g.items[0].price)}
          </span>);
      })}
    </div>);
}

// ── EmptyState — ilustrasi statis (image-slot, bisa diisi user) + judul + teks ──
// slotId: id unik untuk persistensi drop. src: ilustrasi bawaan (opsional).
// resolveAsset: di build standalone, tukar path aset ke blob window.__resources[<basename>].
function resolveAsset(src) {
  if (!src) return src;
  if (typeof window !== 'undefined' && window.__resources) {
    const m = String(src).match(/([^/]+)\.[a-z0-9]+$/i);
    if (m && window.__resources[m[1]]) return window.__resources[m[1]];
  }
  return src;
}
function EmptyState({ slotId, src, title, desc, size = 208, children }) {
  const t = useTheme();
  return (
    <>
      {src ?
      <img src={resolveAsset(src)} alt="" style={{ width: size, height: size, objectFit: 'contain', marginBottom: 14, display: 'block' }} /> :
      React.createElement('image-slot', {
        id: slotId, shape: 'rounded', radius: '20', fit: 'contain',
        placeholder: 'Taruh ilustrasi',
        style: { width: size, height: size, marginBottom: 14 } })}
      <p style={{ color: t.ink, fontSize: 17, fontWeight: 700, textAlign: 'center', margin: 0 }}>{title}</p>
      <p style={{ color: t.muted, fontSize: 14, textAlign: 'center', margin: 0, lineHeight: 1.5, textWrap: 'pretty', maxWidth: 280 }}>{desc}</p>
      {children}
    </>);
}

// ── Button ─────────────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'lg', disabled, loading, full, icon, style }) {
  const t = useTheme();
  const isDisabled = disabled || loading;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: t.fontBody, fontWeight: 650, cursor: isDisabled ? 'not-allowed' : 'pointer',
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
  const spinnerColor = variant === 'ghost' ? t.ink : variant === 'soft' ? t.primary : variant === 'dark' ? t.surface : t.onPrimary;
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      aria-busy={loading || undefined}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style, fontWeight: 700 }}
      onMouseDown={(e) => !isDisabled && (e.currentTarget.style.transform = 'scale(0.975)')}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>

      {loading ?
      <span style={{ width: 15, height: 15, borderRadius: 999, border: '2px solid ' + hexA(spinnerColor, 0.35), borderTopColor: spinnerColor, animation: 'om-spin .7s linear infinite', flexShrink: 0 }} /> :
      icon && <Icon name={icon} size={size === 'sm' ? 17 : 20} />}
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

// ── PaketDetail — rincian Barang Grup: rail teal 3px + satu baris per slot ──
// Figma "Case: Isi Paket & Pilihan": Keranjang menyembunyikan isi tetap (maks. 3 slot,
// sisanya "+n lainnya"); Konfirmasi & Struk menampilkan isi tetap + pilihan.
// Add-on berbayar "(+RpX)" ditulis Regular muted, sama seperti opsi biasa.
const isPaketLine = (line) => (line.contents || []).length > 0;
function PaketDetail({ line, withContents, max, gap = 7 }) {
  const t = useTheme();
  const all = line.options || [];
  const slots = withContents ? all : all.slice((line.contents || []).length);
  if (!slots.length) return null;
  const shown = max ? slots.slice(0, max) : slots;
  const more = slots.length - shown.length;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
      <div style={{ width: 3, borderRadius: 2, background: t.primary, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap }}>
        {shown.map((o, i) => {
          const cut = o.indexOf(' (+');
          return (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.42, color: t.ink, fontWeight: 600 }}>
              {cut < 0 ? o : <>{o.slice(0, cut)}<span style={{ fontWeight: 400, color: t.muted }}>{o.slice(cut)}</span></>}
            </div>);
        })}
        {more > 0 && <div style={{ fontSize: 12, lineHeight: 1.42, color: t.muted }}>+{more} lainnya</div>}
      </div>
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
          <Button size="md" full onClick={onOk} style={{ background: c.tone === 'primary' ? undefined : t.primary, boxShadow: 'none', color: t.onPrimary }}>{c.confirmLabel || 'Hapus'}</Button>
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

// Klaim item gratis \u2014 kalau pilihannya cuma 1 varian, skip sheet pemilihan (tidak ada gunanya
// menyuruh user "pilih" saat cuma ada 1 opsi) dan langsung ke halaman detail/varian item itu.
function openFreeItemPick(app, promo) {
  if (promo.choices && promo.choices.length === 1) {
    app.go('item', { id: promo.choices[0], freePromo: promo.id });
    return;
  }
  app.openSheet('freeitem', { promoId: promo.id });
}

Object.assign(window, {
  ThemeCtx, AppCtx, useTheme, useApp,
  Icon, Money, OptLines, ReceiptLines, lineBreakdown, PaketDetail, isPaketLine, EmptyState, Button, QtyStepper, Pill, FoodImg, Sheet, TopBar, ConfirmDialog, OrderTypePills, hexA, shade, openFreeItemPick
});