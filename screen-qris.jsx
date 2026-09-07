// screen-qris.jsx — "QRIS pembayaran kedaluwarsa" sebagai POPUP di atas layar bayar.
// Layar QRIS tetap tampak (redup) di belakang; popup ringkas memberi tahu kode hangus
// dan menawarkan Perbarui QR / Ganti metode. Standalone (tanpa store).
const { useState: useSQR, useEffect: useEQR } = React;
const QX_DANGER = '#BE4137';
const QX_SOFT = 'rgba(190,60,55,0.10)';
const QX_AMOUNT = 254000;

// ── QR semu ────────────────────────────────────────────────
function QrFaux({ color, bg, size = 172 }) {
  const n = 21;
  const cells = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    const on = finder
      ? (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4) ? 1 : 0)
      : (rnd() > 0.55 ? 1 : 0);
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={color} />);
  }
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + n + ' ' + n} style={{ display: 'block', background: bg }} shapeRendering="crispEdges">
      {cells}
    </svg>);
}

// ── Backdrop: layar pembayaran QRIS (statis) ───────────────
function QrisBackdrop() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Pembayaran QRIS" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 20px 24px' }}>
        <div style={{ background: t.surface, borderRadius: t.radiusLg, border: '1px solid ' + t.line, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '22px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ border: '3px solid ' + t.ink, borderRadius: 8, padding: 8, background: '#fff' }}>
              <QrFaux color="#000" bg="#fff" size={172} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22c55e' }} />
              <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>Menunggu pembayaran…</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, background: t.primary, borderRadius: t.radius, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Total Pembayaran</div>
          <Money value={QX_AMOUNT} style={{ fontSize: 26, fontWeight: 800, color: '#fff' }} />
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(20px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Update Status Pesanan</Button>
      </div>
    </div>);
}

// ── Popup ringkas: QR kedaluwarsa ──────────────────────────
function ExpiredPopup() {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 330, background: t.surface, borderRadius: t.radiusLg, overflow: 'hidden', boxShadow: '0 28px 70px rgba(0,0,0,0.42)' }}>
        <div style={{ padding: '26px 22px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: QX_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="clock" size={30} color={QX_DANGER} stroke={2} />
          </div>
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 20, color: t.ink, lineHeight: 1.25 }}>Kode QRIS kedaluwarsa</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, textWrap: 'pretty' }}>Masa berlaku kode habis. Kembali ke konfirmasi untuk membuat pembayaran baru—pesananmu tetap tersimpan.</p>
        </div>
        <div style={{ padding: '18px 22px 20px' }}>
          <Button full onClick={() => {}}>Kembali ke konfirmasi</Button>
        </div>
      </div>
    </div>);
}

// ── Stage ──────────────────────────────────────────────────
const QX_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });
function QrisStage() {
  const [scale, setScale] = useSQR(1);
  useEQR(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 402, (window.innerHeight - 32) / 874, 1));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: 402, height: 874, transform: 'scale(' + scale + ')', transformOrigin: 'center', flexShrink: 0 }}>
        <ThemeCtx.Provider value={QX_THEME}>
          <IOSDevice width={402} height={874} dark={QX_THEME.statusDark}>
            <div style={{ position: 'relative', height: '100%', background: QX_THEME.bg, fontFamily: QX_THEME.fontBody, color: QX_THEME.ink }}>
              <QrisBackdrop />
              <ExpiredPopup />
            </div>
          </IOSDevice>
        </ThemeCtx.Provider>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<QrisStage />);
