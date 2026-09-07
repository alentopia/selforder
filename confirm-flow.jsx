// confirm-flow.jsx — Prototype interaksi: klik "Konfirmasi Pesanan" -> cek (loading) -> tampilkan
// masalah spesifik (item/voucher) lewat overlay Variant C -> user perbaiki -> lanjut.
// Barang habis TIDAK dihapus otomatis — user harus menghapusnya sendiri di keranjang.

const DANGER = '#BE4137';
const DSOFT = 'rgba(190,60,55,0.10)';
const PRICE = '#B8781F';
const PSOFT = 'rgba(184,120,31,0.12)';
const PROMO = '#1799A5';
const PROMOSOFT = 'rgba(23,153,165,0.12)';

// ── Data pesanan (mutable secara konsep, direset per demo) ─
const INITIAL_LINES = [
{ id: 'nasi-ayam-bakar', name: 'Nasi Ayam Bakar Madu', qty: 2, opts: ['Pedas', '+ Nasi Putih'], unitBefore: 45000, unitAfter: 48000, issue: 'price' },
{ id: 'ayam-goreng-lengkuas', name: 'Ayam Goreng Lengkuas', qty: 1, opts: ['Sedang'], unitBefore: 38000, unitAfter: 38000, issue: 'stock' },
{ id: 'iga-bakar', name: 'Iga Bakar Saji', qty: 2, opts: [], unitBefore: 78000, unitAfter: 78000, issue: null }];


const PROMO_AMOUNT = 30000;

const ISSUE_META = {
  stock: { icon: 'cart', cat: 'Stok', color: DANGER, soft: DSOFT, label: (name) => name + ' habis', detail: 'Stok kosong' },
  price: { icon: 'tag', cat: 'Harga', color: PRICE, soft: PSOFT, label: (name) => name + ' naik harga', detail: null },
  promo: { icon: 'coupon', cat: 'Promo', color: PROMO, soft: PROMOSOFT, label: () => 'Diskon 20% hangus', detail: 'Kuota harian habis' }
};

// ── Baris item di keranjang ─────────────────────────────────
function CartLine({ l, last, resolved, onRemove }) {
  const t = useTheme();
  const flagged = l.issue === 'stock' && !resolved;
  const unit = resolved && l.issue === 'price' ? l.unitAfter : l.unitBefore;
  const total = unit * l.qty;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + t.line }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <FoodImg label={l.name.toLowerCase()} h={56} radius={10} style={{ width: 56, opacity: flagged ? 0.5 : 1 }} src={(itemById(l.id) || {}).photo} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: flagged ? t.muted : t.ink, lineHeight: 1.2 }}>{l.name}</h4>
        {l.opts.length > 0 && !flagged && <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{l.opts.join(' \u00b7 ')}</div>}
        {flagged ?
        <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, fontWeight: 700, color: DANGER, background: DSOFT, borderRadius: 999, padding: '3px 9px' }}>Stok Habis</span> :
        resolved && l.issue === 'price' ?
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: t.muted, textDecoration: 'line-through' }}>{rupiah(l.unitBefore * l.qty)}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: t.ink }}>{rupiah(total)}</span>
          </div> :

        <Money value={total} style={{ fontWeight: 700, fontSize: 14, display: 'block', marginTop: 6 }} />
        }
      </div>
      {flagged ?
      <button onClick={() => onRemove(l.id)} aria-label="Hapus" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 999, border: 'none', background: DSOFT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={15} color={DANGER} stroke={2} />
        </button> :

      <div style={{ minWidth: 24, borderRadius: 8, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, height: 22, padding: '0 7px' }}>{l.qty}</div>
      }
    </div>);
}

// ── Baris isu non-stok (harga) di overlay — pakai thumbnail juga ─
function IssueRow({ l, last }) {
  const t = useTheme();
  const meta = ISSUE_META[l.issue];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: last ? 'none' : '1px dashed ' + t.line }}>
      <FoodImg label={l.name.toLowerCase()} h={38} radius={8} style={{ width: 38, flexShrink: 0 }} src={(itemById(l.id) || {}).photo} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>{l.name}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexShrink: 0 }}>
        <Money value={l.unitBefore} strike style={{ fontSize: 11.5 }} />
        <Money value={l.unitAfter} style={{ fontSize: 12.5 }} />
      </div>
    </div>);
}

// ── Baris isu stok (thumbnail + badge, ala referensi) ──────
function StockIssueRow({ l, last }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: last ? 'none' : '1px dashed ' + t.line }}>
      <FoodImg label={l.name.toLowerCase()} h={38} radius={8} style={{ width: 38, flexShrink: 0 }} src={(itemById(l.id) || {}).photo} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>{l.name}</div>
      <span style={{ fontSize: 11, fontWeight: 700, color: DANGER, background: DSOFT, borderRadius: 999, padding: '3px 9px', flexShrink: 0 }}>Stok Habis</span>
    </div>);
}

function PromoRow({ last }) {
  const t = useTheme();
  const meta = ISSUE_META.promo;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: last ? 'none' : '1px dashed ' + t.line }}>
      <Icon name={meta.icon} size={15} color={meta.color} stroke={2.1} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>{meta.label()}</div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: meta.color, flexShrink: 0 }}>{'\u2212' + rupiah(PROMO_AMOUNT)}</span>
    </div>);
}

// ── Overlay masalah (Variant C: hero ilustrasi + struk mini) ─
function IssuesSheet({ lines, promoBroken, onKeep, onFix }) {
  const t = useTheme();
  const stockLines = lines.filter((l) => l.issue === 'stock');
  const priceLines = lines.filter((l) => l.issue === 'price');
  const hasStock = stockLines.length > 0;
  const count = stockLines.length + priceLines.length + (promoBroken ? 1 : 0);
  const single = count === 1;

  let title, sub, artCat, artSoft;
  if (single) {
    if (hasStock) {
      title = stockLines[0].name + ' habis';
      sub = 'Barang ini kosong. Hapus dari keranjang sebelum lanjut bayar.';
      artCat = 'stok'; artSoft = DSOFT;
    } else if (promoBroken) {
      title = 'Diskon 20% hangus';
      sub = 'Diskon ini tidak lagi berlaku untuk pesananmu.';
      artCat = 'promo'; artSoft = PROMOSOFT;
    } else {
      title = priceLines[0].name + ' naik harga';
      sub = 'Harga baru berlaku otomatis. Lanjut kalau sudah oke.';
      artCat = 'harga'; artSoft = PSOFT;
    }
  } else {
    title = hasStock ? 'Yuk, sesuaikan pesananmu' : 'Ada perubahan di pesananmu';
    sub = hasStock ?
    'Ada barang yang habis. Hapus dulu dari keranjang sebelum lanjut bayar.' :
    'Kami perbarui beberapa hal saat cek ulang harga & promo. Cek dulu sebelum lanjut.';
    artCat = 'pesanan berubah'; artSoft = hasStock ? DSOFT : PSOFT;
  }

  const slotId = 'issue-art-' + stockLines.map((l) => l.id).join('-') + priceLines.map((l) => l.id).join('-') + (promoBroken ? '-promo' : '');

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: single ? 'center' : 'flex-end', justifyContent: 'center', padding: single ? 20 : 0, animation: single ? 'om-pop .28s ease-out' : 'om-sheet .3s cubic-bezier(.2,.8,.3,1)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,13,13,0.6)', backdropFilter: 'blur(3px)', animation: 'om-fade .2s ease-out' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: single ? 340 : 'none', background: t.surface, borderRadius: single ? t.radiusLg : '22px 22px 0 0', overflow: 'hidden', boxShadow: single ? '0 28px 70px rgba(0,0,0,0.42)' : '0 -18px 50px rgba(0,0,0,0.35)', paddingBottom: single ? 0 : 'env(safe-area-inset-bottom)' }}>
        {!single && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 36, height: 4, borderRadius: 3, background: t.line }} /></div>}
        <div style={{ background: artSoft, padding: single ? '22px 22px 20px' : '16px 22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <image-slot id={slotId} shape="rounded" radius="16" placeholder={'Ilustrasi \u2013 ' + artCat} style={{ width: 148, height: 112, marginBottom: 14, flexShrink: 0 }}></image-slot>
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 21, color: t.ink, lineHeight: 1.22 }}>{title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</p>
        </div>
        {(!single || hasStock) && <div style={{ margin: '16px 22px 0' }}>
          {stockLines.length > 0 && <React.Fragment>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: DANGER, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 14px 6px' }}>Perlu dihapus</div>
              <div style={{ background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '4px 14px', marginBottom: (priceLines.length > 0 || promoBroken) ? 14 : 0 }}>
                {stockLines.map((l, i) => <StockIssueRow key={l.id} l={l} last={i === stockLines.length - 1} />)}
              </div>
            </React.Fragment>}
          {(priceLines.length > 0 || promoBroken) && <React.Fragment>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: t.muted, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 14px 6px' }}>Diperbarui otomatis</div>
              <div style={{ background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '4px 14px' }}>
                {priceLines.map((l, i) => <IssueRow key={l.id} l={l} last={i === priceLines.length - 1 && !promoBroken} />)}
                {promoBroken && <PromoRow last />}
              </div>
            </React.Fragment>}
        </div>}
        <div style={{ padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <Button full onClick={onKeep}>Kembali ke keranjang</Button> :
          <React.Fragment>
              <Button full onClick={onFix}>Perbarui Pesanan</Button>
              <button onClick={onKeep} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ── Layar sukses ────────────────────────────────────────────
function SuccessScreen({ total, onRestart }) {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', animation: 'om-fade .25s ease-out' }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(23,153,165,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon name="checkCircle" size={34} color={t.primary} stroke={2} />
      </div>
      <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 22, color: t.ink }}>Pesanan dikonfirmasi</h3>
      <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, maxWidth: 260 }}>Lanjut ke pembayaran sebesar <strong style={{ color: t.ink }}>{rupiah(total)}</strong>.</p>
      <button onClick={onRestart} style={{ marginTop: 22, border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13, fontWeight: 600, textDecoration: 'underline' }}>Mulai ulang demo</button>
    </div>);
}

// ── Layar keranjang + tombol konfirmasi ──────────────────────
function CartScreen({ lines, resolved, stage, onConfirm, onRemove }) {
  const t = useTheme();
  const subtotal = lines.reduce((s, l) => s + (resolved && l.issue === 'price' ? l.unitAfter : l.unitBefore) * l.qty, 0);
  const total = subtotal - (resolved ? 0 : PROMO_AMOUNT);
  const checking = stage === 'checking';
  const hasStockPending = lines.some((l) => l.issue === 'stock' && !resolved);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Keranjang" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: t.ink, fontSize: 16 }}>Pesanan Kamu</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.primary, fontWeight: 600, fontSize: 14 }}><Icon name="plus" size={15} stroke={2.6} color={t.primary} /> Tambah Barang</span>
        </div>
        {hasStockPending && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: DSOFT, border: '1px solid rgba(190,60,55,0.22)', borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
          <Icon name="info" size={15} color={DANGER} stroke={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: DANGER, lineHeight: 1.4, fontWeight: 600 }}>Ada barang habis di pesananmu. Hapus dulu sebelum konfirmasi.</span>
        </div>}
        <div style={{ background: t.surface, borderRadius: t.radius, padding: '0 16px', border: '1px solid ' + t.line, boxShadow: t.shadow }}>
          {lines.map((l, i) => <CartLine key={l.id} l={l} last={i === lines.length - 1} resolved={resolved} onRemove={onRemove} />)}
        </div>
        <div style={{ marginTop: 14, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: t.muted }}><span>Subtotal</span><span style={{ color: t.ink, fontWeight: 600 }}>{rupiah(subtotal)}</span></div>
          {!resolved && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: t.muted }}><span>Diskon transaksi</span><span style={{ color: t.primary, fontWeight: 600 }}>{'\u2212' + rupiah(PROMO_AMOUNT)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Total</span>
            <Money value={total} style={{ fontWeight: 800, fontSize: 22 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={onConfirm} disabled={checking}>
          {checking ?
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 15, height: 15, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'om-spin .7s linear infinite' }} />
              Mengecek pesanan\u2026
            </span> :
          'Konfirmasi Pesanan'}
        </Button>
      </div>
    </div>);
}

// ── Skala stage agar frame 402x874 selalu pas & bisa diklik ─
function useStageScale(w, h) {
  React.useEffect(() => {
    const inner = document.getElementById('stage-inner');
    function fit() {
      const margin = 32;
      const scale = Math.min((window.innerWidth - margin) / w, (window.innerHeight - margin) / h, 1);
      inner.style.transform = 'scale(' + scale + ')';
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h]);
}

// ── Root ─────────────────────────────────────────────────────
function App() {
  useStageScale(402, 874);
  const [stage, setStage] = React.useState('cart'); // cart | checking | issues | success
  const [lines, setLines] = React.useState(INITIAL_LINES);
  const [promoBroken, setPromoBroken] = React.useState(true);
  const [resolved, setResolved] = React.useState(false);

  const hasStockPending = lines.some((l) => l.issue === 'stock' && !resolved);
  const hasIssues = !resolved && (hasStockPending || lines.some((l) => l.issue === 'price') || promoBroken);

  function handleConfirm() {
    setStage('checking');
    window.setTimeout(() => {
      setStage(hasIssues ? 'issues' : 'success');
    }, 900);
  }

  function handleKeep() {
    setStage('cart');
  }

  function handleFix() {
    // hanya dipanggil ketika tidak ada isu stok tersisa (lihat gating tombol di IssuesSheet).
    // Kembali ke keranjang dulu (bukan langsung success) — user harus menekan "Konfirmasi
    // Pesanan" lagi supaya backend re-check dari awal (kalau ada isu lain yang baru muncul,
    // misal stok habis di antara waktu perbaikan harga & klik lanjut, itu tetap tertangkap).
    setResolved(true);
    setStage('cart');
  }

  function handleRemove(id) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function handleRestart() {
    setLines(INITIAL_LINES);
    setPromoBroken(true);
    setResolved(false);
    setStage('cart');
  }

  const subtotal = lines.reduce((s, l) => s + (resolved && l.issue === 'price' ? l.unitAfter : l.unitBefore) * l.qty, 0);
  const total = subtotal - (resolved ? 0 : PROMO_AMOUNT);

  const t = React.useMemo(() => makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' }), []);

  return (
    <ThemeCtx.Provider value={t}>
      <IOSDevice width={402} height={874} dark={t.statusDark}>
        <div style={{ position: 'relative', height: '100%', fontFamily: t.fontBody, color: t.ink }}>
          <CartScreen lines={lines} resolved={resolved} stage={stage} onConfirm={handleConfirm} onRemove={handleRemove} />
          {stage === 'issues' && <IssuesSheet lines={lines} promoBroken={promoBroken && !resolved} onKeep={handleKeep} onFix={handleFix} />}
          {stage === 'success' && <SuccessScreen total={total} onRestart={handleRestart} />}
        </div>
      </IOSDevice>
    </ThemeCtx.Provider>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
