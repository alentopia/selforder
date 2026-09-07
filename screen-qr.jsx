// screen-qr.jsx — Halaman error: Kode QR kedaluwarsa (gerbang masuk self-order).
// Muncul saat user pertama scan QR meja tapi sesi QR-nya sudah lewat batas waktu.
// Standalone (tanpa store). Konsisten dengan design system Self Order.
const { useState: useSQ, useEffect: useEQ } = React;
const QR_DANGER = '#BE4137';
const QR_DSOFT = 'rgba(190,60,55,0.10)';

// ── Ilustrasi QR kedaluwarsa (kotak-kotak + badge jam) ─────
function QrArt() {
  const t = useTheme();
  const Finder = ({ x, y }) => (
    <g>
      <rect x={x} y={y} width="34" height="34" rx="9" fill="none" stroke={t.ink} strokeWidth="5" />
      <rect x={x + 11} y={y + 11} width="12" height="12" rx="3" fill={t.ink} />
    </g>);
  // modul data semu (hindari area finder)
  const mods = [
    [92, 44], [104, 44], [128, 56], [44, 92], [56, 92], [92, 92], [104, 104],
    [128, 92], [140, 104], [92, 128], [56, 116], [116, 128], [128, 140],
  ];
  return (
    <div style={{ position: 'relative' }}>
      <svg width="190" height="190" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kode QR kedaluwarsa">
        <rect x="14" y="14" width="162" height="162" rx="26" fill={t.surface} stroke={t.line} strokeWidth="2" />
        <g opacity="0.32">
          <Finder x="34" y="34" />
          <Finder x="122" y="34" />
          <Finder x="34" y="122" />
          {mods.map(([x, y], i) => <rect key={i} x={x} y={y} width="9" height="9" rx="2.5" fill={t.ink} />)}
        </g>
        {/* badge jam — kedaluwarsa */}
        <g className="qr-badge">
          <circle cx="146" cy="146" r="27" fill={t.surface} />
          <circle cx="146" cy="146" r="22" fill={QR_DANGER} />
          <circle cx="146" cy="146" r="11" fill="none" stroke="#fff" strokeWidth="2.4" />
          <line x1="146" y1="146" x2="146" y2="139" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="146" y1="146" x2="151" y2="148" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </svg>
    </div>);
}

// ── Layar utama ────────────────────────────────────────────
function QrExpiredScreen() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, fontFamily: t.fontBody, color: t.ink }}>
      {/* brand */}
      <div style={{ paddingTop: 56, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: t.primary }} />
          <span style={{ fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 15, letterSpacing: 0.3, color: t.ink }}>Self Order</span>
        </div>
      </div>

      {/* konten tengah */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 32px', textAlign: 'center' }}>
        <QrArt />
        <h1 style={{ margin: '22px 0 0', fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 25, color: t.ink, lineHeight: 1.2 }}>Kode QR kedaluwarsa</h1>
        <p style={{ margin: '9px 0 0', fontSize: 14, color: t.muted, lineHeight: 1.55, textWrap: 'pretty', maxWidth: 280 }}>Sesi pemesanan dari kode ini sudah lewat batas waktu. Scan ulang QR di mejamu untuk mulai memesan.</p>
        <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: t.surface2, border: '1px solid ' + t.line }}>
          <Icon name="clock" size={13} color={t.faint} />
          <span style={{ fontSize: 11.5, color: t.muted, fontWeight: 600 }}>Kode QR diperbarui berkala demi keamanan</span>
        </div>
      </div>
    </div>);
}

// ── Stage (fit 402×874 ke viewport) ────────────────────────
const QR_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });
function QrStage() {
  const [scale, setScale] = useSQ(1);
  useEQ(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 402, (window.innerHeight - 32) / 874, 1));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: 402, height: 874, transform: 'scale(' + scale + ')', transformOrigin: 'center', flexShrink: 0 }}>
        <ThemeCtx.Provider value={QR_THEME}>
          <IOSDevice width={402} height={874} dark={QR_THEME.statusDark}>
            <QrExpiredScreen />
          </IOSDevice>
        </ThemeCtx.Provider>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<QrStage />);
