// screen-negcase.jsx — "Negative case" pengecekan keranjang: SATU popup general adaptif.
// Popup yang sama menampilkan masalah apa pun yang terdeteksi (stok / promo / SPA),
// bisa 1 atau beberapa sekaligus. Inti: pesanan belum bisa dilanjutkan. Standalone.

const DANGER = '#BE4137';
const DSOFT = 'rgba(190,60,55,0.10)';
const DLINE = 'rgba(190,60,55,0.28)';

const SCN = { subtotal: 284000, promoAmount: 30000, total: 254000 };

// ── Katalog isu — satu sumber untuk semua jenis masalah ────
const ISSUE = {
  stock: { icon: 'cart', cat: 'Stok', line: 'Ayam Goreng Lengkuas habis', detail: 'Tidak tersedia · dihapus dari pesanan' },
  price: { icon: 'tag', cat: 'Harga', line: 'Nasi Ayam Bakar Madu naik harga', detail: 'Rp45.000 \u2192 Rp48.000 / porsi' },
  promo: { icon: 'percent', cat: 'Promo', line: 'Diskon 20% gugur', detail: 'Kuota harian habis · \u2212' + 'Rp30.000' }
};

// ── Segitiga peringatan ────────────────────────────────────
function Tri({ size = 20, color = DANGER, stroke = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      <path d="M12 3.6 L21.6 20.2 H2.4 Z" />
      <path d="M12 10v4.2" />
      <path d="M12 17.6h.01" />
    </svg>);
}

// ── Backdrop: layar keranjang (statis) ─────────────────────
const BD_LINES = [
{ id: 'nasi-ayam-bakar', name: 'Nasi Ayam Bakar Madu', qty: 2, total: 90000, opts: ['Pedas', '+ Nasi Putih'] },
{ id: 'ayam-goreng-lengkuas', name: 'Ayam Goreng Lengkuas', qty: 1, total: 38000, opts: ['Sedang'] },
{ id: 'iga-bakar', name: 'Iga Bakar Saji', qty: 2, total: 156000, opts: [] }];

function CartLine({ l, last, outOfStock }) {
  const t = useTheme();
  if (outOfStock) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + t.line, opacity: 0.55 }}>
        <div style={{ position: 'relative', width: 56, flexShrink: 0 }}>
          <FoodImg label={l.name.toLowerCase()} h={56} radius={10} style={{ width: 56, filter: 'grayscale(1)' }} src={(itemById(l.id) || {}).photo} />
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', padding: '2px 0', borderRadius: '0 0 10px 10px', background: DANGER, color: '#fff', fontSize: 8, fontWeight: 700 }}>Stok habis</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.muted, lineHeight: 1.2 }}>{l.name}</h4>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: t.muted, lineHeight: 1.4 }}>Hapus item ini untuk melanjutkan pesanan.</div>
        </div>
        <button onClick={() => {}} style={{ border: '1px solid ' + t.line, background: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink, cursor: 'pointer', flexShrink: 0 }}><Icon name="trash" size={15} stroke={2} color={t.ink} /></button>
      </div>);
  }
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + t.line }}>
      <FoodImg label={l.name.toLowerCase()} h={56} radius={10} style={{ width: 56, flexShrink: 0 }} src={(itemById(l.id) || {}).photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>{l.name}</h4>
        {l.opts.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{l.opts.join(' · ')}</div>}
        <Money value={l.total} style={{ fontWeight: 700, fontSize: 14, display: 'block', marginTop: 6 }} />
      </div>
      <div style={{ minWidth: 24, borderRadius: 8, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, height: 22, padding: '0 7px' }}>{l.qty}</div>
    </div>);
}

function CartBackdrop({ outOfStockId }) {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Keranjang" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: t.ink, fontSize: 16 }}>Pesanan Kamu</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.primary, fontWeight: 600, fontSize: 14 }}><Icon name="plus" size={15} stroke={2.6} color={t.primary} /> Tambah Barang</span>
        </div>
        <div style={{ background: t.surface, borderRadius: t.radius, padding: '0 16px', border: '1px solid ' + t.line, boxShadow: t.shadow }}>
          {BD_LINES.map((l, i) =>
          <CartLine key={l.id} l={l} last={i === BD_LINES.length - 1} outOfStock={l.id === outOfStockId} />)}
        </div>
        <div style={{ marginTop: 14, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: t.muted }}><span>Subtotal</span><span style={{ color: t.ink, fontWeight: 600 }}>{rupiah(SCN.subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: t.muted }}><span>Diskon transaksi</span><span style={{ color: t.primary, fontWeight: 600 }}>−{rupiah(SCN.promoAmount)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Total</span>
            <Money value={SCN.total} style={{ fontWeight: 800, fontSize: 22 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full disabled={!!outOfStockId} onClick={() => {}}>Konfirmasi Pesanan</Button>
      </div>
    </div>);
}

// ── Baris isu — gaya struk, token desain sistem ─────
function IssueRow({ k, last }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline', padding: '9px 0', borderBottom: last ? 'none' : '1px dashed ' + t.line }}>
      {k === 'price' ?
      <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <FoodImg label="nasi ayam bakar madu" h={30} radius={7} style={{ width: 30, flexShrink: 0 }} src={(itemById('nasi-ayam-bakar') || {}).photo} />
            <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>Nasi Ayam Bakar Madu</span>
          </div>
          <span style={{ fontFamily: t.fontMono || t.fontBody, fontSize: 12.5, whiteSpace: 'nowrap' }}><span style={{ color: t.muted, textDecoration: 'line-through' }}>45.000</span> <span style={{ color: DANGER, fontWeight: 700 }}>48.000</span></span>
        </React.Fragment> :
      k === 'promo' ?
      <React.Fragment>
          <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>Diskon 20%</span>
          <span style={{ fontFamily: t.fontMono || t.fontBody, fontSize: 12.5, color: DANGER, fontWeight: 700, whiteSpace: 'nowrap' }}>GUGUR</span>
        </React.Fragment> :

      <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <FoodImg label="ayam goreng lengkuas" h={30} radius={7} style={{ width: 30, flexShrink: 0, filter: 'grayscale(1)' }} src={(itemById('ayam-goreng-lengkuas') || {}).photo} />
            <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>Ayam Goreng Lengkuas</span>
          </div>
          <span style={{ fontFamily: t.fontMono || t.fontBody, fontSize: 12.5, color: DANGER, fontWeight: 700, whiteSpace: 'nowrap' }}>HABIS</span>
        </React.Fragment>}

    </div>);
}

// ── Popup general adaptif ──────────────────────────────────
function CheckAlert({ keys }) {
  const t = useTheme();
  const multi = keys.length > 1;
  const hasStock = keys.includes('stock');
  const title = hasStock ?
  multi ? 'Pesanan perlu disesuaikan' : 'Item tidak tersedia' :
  multi ? 'Pesanan perlu diperbarui' :
  keys[0] === 'promo' ? 'Promo tidak berlaku' :
  'Harga menyesuaikan';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 320, background: t.surface, borderRadius: t.radiusLg, overflow: 'hidden', boxShadow: '0 28px 70px rgba(0,0,0,0.42)' }}>
        <div style={{ padding: '20px 22px 4px', textAlign: 'center' }}>
          <Tri size={22} stroke={2.2} />
          <h3 style={{ margin: '10px 0 0', fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 19, color: t.ink, lineHeight: 1.25 }}>{title}</h3>
          <div style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.muted, marginTop: 5 }}>Pengecekan pesanan</div>
        </div>
        <div style={{ margin: '16px 22px 0', borderTop: '1px dashed ' + t.line }} />
        <div style={{ padding: '6px 22px 4px' }}>
          {keys.map((k, i) => <IssueRow key={k} k={k} last={i === keys.length - 1} />)}
        </div>
        <div style={{ margin: '4px 22px 0', borderTop: '1px dashed ' + t.line }} />
        <div style={{ padding: '16px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <Button full onClick={() => {}}>Kembali ke keranjang</Button> :
          <React.Fragment>
              <Button full onClick={() => {}}>Perbarui &amp; lanjut</Button>
              <button onClick={() => {}} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ── Komposisi: keranjang + popup ───────────────────────────
// ── Popup khusus BARANG HABIS — pakai ilustrasi ───────────
// ── Ilustrasi 'stok habis' — Lottie (lottie-web) ───────────
function StockOutArt() {
  const elRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.lottie || !elRef.current) return;
    const anim = window.lottie.loadAnimation({
      container: elRef.current, renderer: 'svg', loop: true, autoplay: true, path: 'lottie-stockout.json'
    });
    return () => anim.destroy();
  }, []);
  return <div ref={elRef} style={{ width: 200, height: 158 }} aria-label="Stok habis" />;
}

function StockOutPopup() {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 342, background: t.surface, borderRadius: t.radiusLg, overflow: 'hidden', boxShadow: '0 28px 70px rgba(0,0,0,0.42)' }}>
        {/* area ilustrasi — user bisa taruh gambar sendiri */}
        <div style={{ background: DSOFT, padding: '18px 22px 8px', display: 'flex', justifyContent: 'center' }}>
          <StockOutArt />
        </div>
        {/* teks penjelasan */}
        <div style={{ padding: '18px 22px 6px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 20, color: t.ink, lineHeight: 1.25 }}>Yah, ada barang yang habis</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.55, textWrap: 'pretty' }}>Item ini kehabisan stok dan belum bisa dipesan. Yuk sesuaikan keranjangmu.</p>
        </div>
        {/* aksi */}
        <div style={{ padding: '16px 22px 20px' }}>
          <Button full onClick={() => {}}>Kembali ke keranjang</Button>
        </div>
      </div>
    </div>);
}

function NegCase({ keys, cartState }) {
  const t = useTheme();
  const stockOnly = keys.length === 1 && keys[0] === 'stock';
  if (cartState === 'stockout') {
    return (
      <div style={{ position: 'relative', height: '100%', background: t.bg, fontFamily: t.fontBody, color: t.ink }}>
        <CartBackdrop outOfStockId="ayam-goreng-lengkuas" />
      </div>);
  }
  return (
    <div style={{ position: 'relative', height: '100%', background: t.bg, fontFamily: t.fontBody, color: t.ink }}>
      <CartBackdrop />
      {stockOnly ? <StockOutPopup /> : <CheckAlert keys={keys} />}
    </div>);
}

// ════════════════════════════════════════════════════════════
// Kanvas — popup yang SAMA dalam beberapa keadaan
// ════════════════════════════════════════════════════════════
const NEG_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });
const FRAMES = [
{ keys: ['stock'], label: 'Barang habis · ilustrasi', desc: 'Popup ilustrasi · Kembali ke keranjang' },
{ keys: ['promo', 'price'], label: 'Promo & harga', desc: 'Bisa auto · Perbarui & lanjut' },
{ keys: ['stock', 'price', 'promo'], label: 'Campuran (ada habis)', desc: 'Ada item habis → Kembali ke keranjang' },
{ keys: ['stock'], cartState: 'stockout', label: 'Keranjang · setelah kembali', desc: 'Item habis ditandai · hapus untuk lanjut' }];


function Frame({ f, left }) {
  return (
    <div style={{ position: 'absolute', top: 64, left, width: 402 }}>
      <div style={{ position: 'absolute', top: -56, left: 2, right: 0 }}>
        <div style={{ fontFamily: NEG_THEME.fontDisplay, fontWeight: 700, fontSize: 19, color: '#EAF0F0' }}>{f.label}</div>
        <div style={{ fontFamily: NEG_THEME.fontBody, fontSize: 13, color: 'rgba(234,240,240,0.55)', marginTop: 3 }}>{f.desc}</div>
      </div>
      <ThemeCtx.Provider value={NEG_THEME}>
        <IOSDevice width={402} height={874} dark={NEG_THEME.statusDark}>
          <NegCase keys={f.keys} cartState={f.cartState} />
        </IOSDevice>
      </ThemeCtx.Provider>
    </div>);
}

function Canvas() {
  const GAP = 512;
  return (
    <div style={{ position: 'relative', width: 80 + FRAMES.length * GAP, height: 64 + 874 + 60 }}>
      {FRAMES.map((f, i) => <Frame key={f.label} f={f} left={80 + i * GAP} />)}
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Canvas />);