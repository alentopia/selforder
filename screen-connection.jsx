// screen-connection.jsx — Negative case "sistem": (1) tidak ada koneksi internet,
// (2) sedang maintenance. Full-screen state, ilustrasi Lottie + pesan + aksi. Standalone.

// ── Pemuat Lottie generik (lottie-web, file lokal) ─────────
function LottieArt({ path, w = 212, h = 170, label }) {
  const elRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.lottie || !elRef.current) return;
    const anim = window.lottie.loadAnimation({
      container: elRef.current, renderer: 'svg', loop: true, autoplay: true, path
    });
    return () => anim.destroy();
  }, [path]);
  return <div ref={elRef} style={{ width: w, height: h }} aria-label={label} role="img" />;
}

// ── Titik berdenyut kecil (indikator status) ───────────────
function LiveDot({ color }) {
  return (
    <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex', flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: color, opacity: 0.35, animation: 'om-ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
      <span style={{ position: 'absolute', inset: 2, borderRadius: 999, background: color }} />
    </span>);
}

// ── Scaffold state penuh layar ─────────────────────────────
function SystemState({ artPath, glow, kicker, kickerColor, title, msg, primaryLabel, onPrimary, secondaryLabel, footer }) {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, fontFamily: t.fontBody, color: t.ink }}>
      {/* badge merek kecil di atas — menjaga konteks ini layar aplikasi */}
      <div style={{ flexShrink: 0, height: 'calc(54px + env(safe-area-inset-top))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6 }}>
        <span style={{ fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 15, color: t.faint, letterSpacing: 0.2 }}>Self Order</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
        {/* ilustrasi + halo lembut */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <div style={{ position: 'absolute', width: 248, height: 248, borderRadius: 999, background: glow, filter: 'blur(2px)' }} />
          <div className="om-float" style={{ position: 'relative' }}>
            <LottieArt path={artPath} label={title} />
          </div>
        </div>

        <div style={{ fontFamily: t.fontBody, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: kickerColor }}>{kicker}</div>
        <h1 style={{ margin: '11px 0 0', fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 25, lineHeight: 1.18, color: t.ink, maxWidth: 300 }}>{title}</h1>
        <p style={{ margin: '11px 0 0', fontSize: 14.5, lineHeight: 1.55, color: t.muted, maxWidth: 292, textWrap: 'pretty' }}>{msg}</p>
      </div>

      <div style={{ flexShrink: 0, padding: '0 24px calc(20px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
        {footer}
        <Button full onClick={onPrimary}>{primaryLabel}</Button>
        {secondaryLabel &&
          <button onClick={() => {}} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '2px 0' }}>{secondaryLabel}</button>}
      </div>
    </div>);
}

// ── Footer info chip (status) ──────────────────────────────
function StatusChip({ icon, text, tone }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '11px 14px', background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow }}>
      {icon}
      <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>{text}</span>
    </div>);
}

// ── Case 1: Tidak ada koneksi internet ─────────────────────
function NoInternetScreen() {
  const t = useTheme();
  return (
    <SystemState
      artPath="lottie-nointernet.json"
      glow="radial-gradient(circle, rgba(190,60,55,0.10) 0%, rgba(190,60,55,0) 70%)"
      kicker="Koneksi terputus"
      kickerColor="#BE4137"
      title="Kamu sedang offline"
      msg="Sepertinya internet kamu terputus. Cek WiFi atau data seluler, lalu muat ulang halaman ini."
      primaryLabel="Muat Ulang"
      secondaryLabel="Lihat pesanan tersimpan"
      footer={<StatusChip icon={<LiveDot color="#BE4137" />} text="Otomatis tersambung saat koneksi pulih" />}
    />);
}

// ── Case 2: Sedang maintenance ─────────────────────────────
function MaintenanceScreen() {
  const t = useTheme();
  return (
    <SystemState
      artPath="lottie-maintenance.json"
      glow={'radial-gradient(circle, ' + hexA(t.primary, 0.12) + ' 0%, ' + hexA(t.primary, 0) + ' 70%)'}
      kicker="Pemeliharaan sistem"
      kickerColor={t.primary}
      title="Sebentar, lagi kami benahi"
      msg="Sistem sedang dalam perbaikan singkat supaya makin lancar. Pesananmu tetap aman — coba lagi beberapa menit lagi."
      primaryLabel="Coba Lagi"
      secondaryLabel="Hubungi kasir"
      footer={<StatusChip icon={<Icon name="clock" size={16} color={t.primary} stroke={2} />} text="Perkiraan kembali normal ± 15 menit" />}
    />);
}

// ════════════════════════════════════════════════════════════
// Kanvas
// ════════════════════════════════════════════════════════════
const CONN_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });
const CONN_FRAMES = [
  { Screen: NoInternetScreen, label: 'Tidak ada koneksi', desc: 'Case 1 · Offline · Muat ulang' },
  { Screen: MaintenanceScreen, label: 'Sedang maintenance', desc: 'Case 2 · Pemeliharaan sistem' }];

function ConnFrame({ f, left }) {
  const Screen = f.Screen;
  return (
    <div style={{ position: 'absolute', top: 64, left, width: 402 }}>
      <div style={{ position: 'absolute', top: -56, left: 2, right: 0 }}>
        <div style={{ fontFamily: CONN_THEME.fontDisplay, fontWeight: 700, fontSize: 19, color: '#EAF0F0' }}>{f.label}</div>
        <div style={{ fontFamily: CONN_THEME.fontBody, fontSize: 13, color: 'rgba(234,240,240,0.55)', marginTop: 3 }}>{f.desc}</div>
      </div>
      <ThemeCtx.Provider value={CONN_THEME}>
        <IOSDevice width={402} height={874} dark={CONN_THEME.statusDark}>
          <Screen />
        </IOSDevice>
      </ThemeCtx.Provider>
    </div>);
}

function ConnCanvas() {
  const GAP = 512;
  return (
    <div style={{ position: 'relative', width: 80 + CONN_FRAMES.length * GAP, height: 64 + 874 + 60 }}>
      {CONN_FRAMES.map((f, i) => <ConnFrame key={f.label} f={f} left={80 + i * GAP} />)}
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConnCanvas />);
