// skeleton-demo.jsx — demo pembanding: skeleton -> konten asli (dibuat meniru tampilan
// nyata Self Order.html: header hero+kartu resto, promo/best seller, keranjang, dan
// konfirmasi pesanan) dengan tombol untuk membandingkan kedua state.

const NEG_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });

// ══════════════════════════════════════════════════════════════
// MENU (loaded) — meniru header hero+kartu, Promo Hari Ini, Best Seller
// ══════════════════════════════════════════════════════════════
function LoadedOfferCard({ item }) {
  const t = useTheme();
  return (
    <div style={{ width: 232, flexShrink: 0, display: 'flex', gap: 11, alignItems: 'center', background: t.surface, border: '1px solid ' + t.line, borderRadius: 14, padding: 10, boxShadow: t.shadow }}>
      <FoodImg label={item.name.toLowerCase()} h={54} radius={10} style={{ width: 54 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: '#E2680E', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Beli 1, gratis Ayam Goreng</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <Money value={item.price} style={{ fontSize: 13 }} />
      </div>
    </div>);
}

function LoadedRailCard({ item }) {
  const t = useTheme();
  return (
    <div style={{ width: 150, flexShrink: 0 }}>
      <div style={{ position: 'relative' }}>
        <FoodImg label={item.name.toLowerCase()} h={150} radius={12} src={item.photo} style={{ width: 150 }} />
        {item.tag && <div style={{ position: 'absolute', top: 8, left: 8 }}><Pill tone="promo" style={{ background: t.primary, color: t.onPrimary, border: 'none' }}>{item.tag}</Pill></div>}
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px ' + hexA(t.primary, 0.4) }}>
          <Icon name="plus" size={15} stroke={2.4} />
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, lineHeight: 1.25, marginTop: 8, minHeight: 32 }}>{item.name}</div>
      <Money value={item.price} style={{ fontSize: 13, marginTop: 2 }} />
    </div>);
}

function LoadedMenu() {
  const t = useTheme();
  const bestSeller = MENU.filter((m) => m.cat === 'signature');
  const promoItems = MENU.filter((m) => m.id === 'nasi-ayam-bakar' || m.id === 'sate-ayam-madu');
  return (
    <div style={{ height: '100%', overflow: 'hidden', background: t.bg }}>
      <div style={{ position: 'relative', height: 140 }}>
        <img src={MENU[0].photo.replace('w=320&h=320', 'w=800&h=500')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35))' }} />
      </div>
      <div style={{ background: t.surface, borderRadius: '18px 18px 0 0', marginTop: -14, position: 'relative', padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{BRAND.name[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, color: t.ink, fontSize: 17 }}>{BRAND.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, color: t.muted, fontSize: 11.5 }}><Icon name="pin" size={11} color={t.muted} /> Jakarta Barat</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: t.faint, textTransform: 'uppercase' }}>Meja</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.primary, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}><Icon name="dineIn" size={12} color={t.primary} /> 5</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.muted }}>Pesanan</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 700, color: t.ink }}><Icon name="dineIn" size={13} color={t.primary} /> Dine In <Icon name="chevron" size={11} color={t.muted} style={{ transform: 'rotate(90deg)' }} /></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.primarySoft, borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
          <Icon name="bolt" size={13} color={t.primary} />
          <span style={{ fontSize: 11.5, color: t.ink, fontWeight: 600, flex: 1 }}>Pesanan berikutnya lebih cepat</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: t.primary }}>Masuk</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + t.line, borderRadius: 10, padding: '8px 10px' }}>
            <Icon name="coupon" size={14} color={t.primary} />
            <div style={{ fontSize: 10.5, fontWeight: 700, color: t.ink }}>20% off<div style={{ fontSize: 9, color: t.faint, fontWeight: 500 }}>Min. Rp100.000</div></div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + t.line, borderRadius: 10, padding: '8px 10px' }}>
            <Icon name="coupon" size={14} color={t.primary} />
            <div style={{ fontSize: 10.5, fontWeight: 700, color: t.ink }}>Rp15.000 off<div style={{ fontSize: 9, color: t.faint, fontWeight: 500 }}>Min. Rp75.000</div></div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 16px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: t.ink, marginBottom: 12 }}>Promo Hari Ini</div>
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden', marginBottom: 26 }}>
          {promoItems.map((item) => <LoadedOfferCard key={item.id} item={item} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: t.ink, marginBottom: 12 }}>Best Seller</div>
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
          {bestSeller.map((item) => <LoadedRailCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// KERANJANG (loaded)
// ══════════════════════════════════════════════════════════════
const DEMO_LINES = [
{ id: 'nasi-ayam-bakar', qty: 1, total: 45000, sub: 'Tingkat Pedas: Sedang' },
{ id: 'ayam-goreng-kremes', qty: 1, total: 0, oldTotal: 38000, sub: 'Tingkat Pedas: Sedang · Gratis', free: true }];

function LoadedCartLine({ l, last }) {
  const t = useTheme();
  const item = itemById(l.id);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + t.line, position: 'relative', borderLeft: l.free ? '3px solid ' + t.primary : 'none', paddingLeft: l.free ? 9 : 0, marginLeft: l.free ? -12 : 0 }}>
      <FoodImg label={item.name.toLowerCase()} h={48} radius={10} style={{ width: 48 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{item.name}</div>
        <div style={{ fontSize: 11, color: t.faint, marginTop: 2 }}>{l.sub}</div>
        <div style={{ marginTop: 6 }}>
          {l.free ?
          <span><Money value={l.oldTotal} strike style={{ fontSize: 11.5 }} /> <Money value={0} style={{ fontSize: 13 }} /></span> :
          <Money value={l.total} style={{ fontSize: 13 }} />}
        </div>
      </div>
      {!l.free && <div style={{ position: 'absolute', top: 14, right: 0, width: 20, height: 20, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{l.qty}</div>}
      {l.free && <div style={{ position: 'absolute', top: 14, right: 0 }}><Icon name="trash" size={15} color={t.faint} /></div>}
    </div>);
}

function LoadedCart() {
  const t = useTheme();
  const subtotal = 83000;
  const discount = 38000;
  const tax = 4500;
  const total = subtotal - discount + tax;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Keranjang" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: t.ink, fontSize: 16 }}>Pesanan Kamu</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.primary, fontWeight: 700, fontSize: 13 }}><Icon name="plus" size={13} stroke={2.6} color={t.primary} /> Tambah Barang</span>
        </div>
        <div style={{ background: t.surface, borderRadius: t.radius, padding: '0 16px', border: '1px solid ' + t.line, boxShadow: t.shadow }}>
          {DEMO_LINES.map((l, i) => <LoadedCartLine key={l.id} l={l} last={i === DEMO_LINES.length - 1} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '18px 0 8px' }}>
          <span style={{ fontWeight: 700, color: t.ink, fontSize: 13.5 }}>Catatan pesanan</span>
          <span style={{ fontSize: 11, color: t.faint }}>Opsional</span>
        </div>
        <div style={{ height: 44, borderRadius: t.radius, border: '1px solid ' + t.line, background: t.surface, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 12.5, color: t.faint, marginBottom: 14 }}>cth. minta sendok lebih...</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 14, cursor: 'pointer' }}>
          <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="coupon" size={16} color={t.primary} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>Voucher &amp; diskon</div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>Punya kode promo? Pakai di sini</div>
          </div>
          <Icon name="chevron" size={14} color={t.faint} />
        </div>
        <div style={{ marginTop: 14, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: t.muted }}><span>Subtotal</span><Money value={subtotal} style={{ fontSize: 13, fontWeight: 600 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: t.muted }}><span>Potongan harga</span><span style={{ color: t.primary, fontWeight: 600 }}>{'\u2212' + rupiah(discount)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: t.muted }}><span>PPN 10%</span><Money value={tax} style={{ fontSize: 13, fontWeight: 600 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: t.ink }}>Total</span>
            <Money value={total} style={{ fontWeight: 800, fontSize: 20 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Konfirmasi Pesanan</Button>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// KONFIRMASI PESANAN (loaded)
// ══════════════════════════════════════════════════════════════
function LoadedCheckout() {
  const t = useTheme();
  const [method, setMethod] = React.useState('qris');
  const subtotal = 83000, discount = 38000, tax = 4500, total = subtotal - discount + tax;
  const methods = [
  { id: 'qris', label: 'QRIS', sub: 'Semua e-wallet & m-banking', icon: 'qr' },
  { id: 'cash', label: 'Bayar Langsung', sub: 'Tunai atau kartu di kasir', icon: 'receipt' }];

  const item = itemById('nasi-ayam-bakar');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Konfirmasi Pesanan" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '2px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '12px 14px', boxShadow: t.shadow, marginBottom: 16, fontSize: 12.5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.primary, fontWeight: 700 }}><Icon name="dineIn" size={13} color={t.primary} /> Meja 5</span>
          <div style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted, fontWeight: 600 }}><Icon name="phone" size={13} color={t.muted} /> +62 813 8001 2025 <Icon name="check" size={12} color={t.primary} stroke={2.6} /></span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8 }}>Atas Nama <span style={{ fontWeight: 600, letterSpacing: 0 }}>· Opsional</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.surface, border: '1.5px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '12px 15px', marginBottom: 18 }}>
          <Icon name="user" size={16} color={t.faint} />
          <span style={{ fontSize: 13, color: t.faint }}>Nama pemesan</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Ringkasan Pesanan</span>
          <span style={{ fontSize: 11, color: t.faint, fontWeight: 600 }}>2 item</span>
        </div>
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 12, padding: 14, borderBottom: '1px solid ' + t.line }}>
            <FoodImg label={item.name.toLowerCase()} h={44} radius={10} style={{ width: 44 }} src={item.photo} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{item.name} <span style={{ color: t.faint, fontWeight: 600 }}>1 pcs</span></div>
              <div style={{ fontSize: 10.5, color: t.faint, margin: '2px 0 6px' }}>Sedang</div>
              <Money value={45000} style={{ fontSize: 13 }} />
            </div>
          </div>
          <div style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 700, color: t.primary }}>Lihat semua &middot; 1 item lainnya</div>
          <div style={{ padding: '0 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, color: t.muted }}><span>Subtotal</span><Money value={subtotal} style={{ fontSize: 12, fontWeight: 600 }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, color: t.primary, fontWeight: 600 }}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="gift" size={11} color={t.primary} /> Gratis Ayam Goreng Kremes</span><span>{'\u2212' + rupiah(discount)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 12px', fontSize: 12, color: t.muted }}><span>Pajak (10%)</span><Money value={tax} style={{ fontSize: 12, fontWeight: 600 }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px', borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: t.ink }}>Total</span>
            <Money value={total} style={{ fontWeight: 800, fontSize: 17, color: t.primary }} />
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Metode Pembayaran</div>
        {methods.map((m) => {
          const on = method === m.id;
          return (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderRadius: t.radius, border: '1.5px solid ' + (on ? t.primary : t.line), background: on ? t.primarySoft : t.surface, marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: on ? hexA(t.primary, 0.15) : t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.icon} size={17} color={on ? t.primary : t.muted} stroke={1.7} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: on ? t.primary : t.ink }}>{m.label}</div>
                <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{m.sub}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 999, border: '2px solid ' + (on ? t.primary : t.muted), background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <Icon name="check" size={10} color={t.onPrimary} stroke={3} />}
              </div>
            </div>);
        })}
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Bayar</Button>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// VOUCHER (loaded)
// ══════════════════════════════════════════════════════════════
const VOUCHERS = [
{ title: 'Diskon 20%', conds: ['Min. belanja Rp100.000', 'Maks. potongan Rp30.000'] },
{ title: 'Potongan Rp15.000', conds: ['Min. belanja Rp75.000'] }];

function LoadedVoucherCard({ v }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 14, marginBottom: 12, boxShadow: t.shadow }}>
      <div style={{ width: 60, height: 60, borderRadius: 12, border: '1.5px solid ' + hexA(t.primary, 0.2), background: t.primarySoft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
        <Icon name="tag" size={20} color={t.primary} />
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, color: t.primary, textTransform: 'uppercase' }}>Voucher</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.ink, marginBottom: 4 }}>{v.title}</div>
        {v.conds.map((c, i) => <div key={i} style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>&middot; {c}</div>)}
      </div>
      <Button size="sm" onClick={() => {}}>Pakai</Button>
    </div>);
}

function LoadedVoucher() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Voucher" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px 24px' }}>
        {VOUCHERS.map((v) => <LoadedVoucherCard key={v.title} v={v} />)}
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// PEMBAYARAN QRIS (loaded)
// ══════════════════════════════════════════════════════════════
function QrFauxDemo({ color, bg, size = 172 }) {
  const n = 21;
  const cells = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    const on = finder ?
    (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4) ? 1 : 0) :
    (rnd() > 0.55 ? 1 : 0);
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={color} />);
  }
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + n + ' ' + n} style={{ display: 'block', background: bg }} shapeRendering="crispEdges">
      {cells}
    </svg>);
}

function LoadedQris() {
  const t = useTheme();
  const steps = ['Buka aplikasi e-wallet atau m-banking', 'Pilih menu "Scan QR" atau "Bayar"', 'Arahkan kamera ke QR di atas', 'Konfirmasi jumlah dan bayar'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Pembayaran QRIS" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 20px 24px' }}>
        <div style={{ background: t.surface, borderRadius: t.radiusLg, border: '1px solid ' + t.line, boxShadow: t.shadow, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <QrFauxDemo color={t.ink} bg={t.surface} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 12.5, color: t.muted }}><span style={{ width: 7, height: 7, borderRadius: 999, background: t.primary }} /> Menunggu pembayaran...</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={13} color={t.ink} /> Berlaku 04:54</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.primary, marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="download" size={13} color={t.primary} /> Download QR</div>
        </div>
        <div style={{ background: t.primary, borderRadius: t.radiusLg, padding: '14px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Pembayaran</div>
          <Money value={49500} style={{ fontSize: 24, fontWeight: 800, color: '#fff' }} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, marginBottom: 10 }}>Cara Bayar</div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, background: t.primarySoft, color: t.primary, fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: t.muted }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Update Status Pesanan</Button>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// STATUS PESANAN (loaded) — bayar langsung / kasir
// ══════════════════════════════════════════════════════════════
function LoadedCashStatus() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Status Pesanan" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '8px 18px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 18px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="clock" size={32} color={t.accent} stroke={1.7} />
          </div>
          <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 18, color: t.ink, marginBottom: 8 }}>Menunggu Pembayaran</div>
          <div style={{ fontSize: 12.5, color: t.muted, lineHeight: 1.5, maxWidth: 260 }}>Terima kasih atas pesananmu. Silakan selesaikan pembayaran di kasir agar pesanan segera diproses.</div>
        </div>
        <div style={{ background: t.primarySoft, borderRadius: t.radius, padding: '14px 18px', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.primary }}>Tunjukkan Kode Ini ke Kasir</div>
          <div style={{ fontFamily: t.fontMono || 'monospace', fontWeight: 800, fontSize: 22, color: t.primary, letterSpacing: 1, margin: '4px 0' }}>REF-007395</div>
          <div style={{ fontSize: 10.5, color: t.muted }}>9 Jul 2026, 15.01</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid ' + t.line, borderRadius: t.radius, padding: '10px 14px', marginBottom: 14, background: t.surface }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: t.ink, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="dineIn" size={13} color={t.primary} /> Dine In</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: t.primary, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="table" size={12} color={t.primary} /> Meja 5</span>
        </div>
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, marginBottom: 10 }}>Pesanan (1)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 8 }}>
            <span style={{ color: t.ink }}><span style={{ fontWeight: 700 }}>1</span> Nasi Ayam Bakar Madu<div style={{ fontSize: 10.5, color: t.faint }}>Sedang</div></span>
            <Money value={45000} style={{ fontSize: 12.5 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted, paddingTop: 8, borderTop: '1px solid ' + t.line, marginBottom: 8 }}>
            <span>Subtotal</span><Money value={45000} style={{ fontSize: 12.5, fontWeight: 600 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted }}>
            <span>Pajak (10%)</span><Money value={4500} style={{ fontSize: 12.5, fontWeight: 600 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Cek Status Pembayaran</Button>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// PEMBAYARAN BERHASIL (loaded)
// ══════════════════════════════════════════════════════════════
function LoadedSuccess() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <div style={{ flexShrink: 0, background: t.primary, padding: '50px 20px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon name="checkCircle" size={30} color="#fff" stroke={2} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>Pembayaran berhasil</div>
        <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 26, marginTop: 4 }}>Rp49.500</div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>
          <span>Pesananmu</span><span>Dine In &middot; Meja 5</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.ink, marginBottom: 16 }}>
          <span><span style={{ fontWeight: 700 }}>1&times;</span> Nasi Ayam Bakar Madu<div style={{ fontSize: 11, color: t.faint }}>Sedang</div></span>
          <Money value={45000} style={{ fontSize: 13, fontWeight: 700 }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Rincian Pembayaran</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted, marginBottom: 6 }}><span>Subtotal</span><Money value={45000} style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted, marginBottom: 16 }}><span>Pajak &amp; layanan</span><Money value={4500} style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }} /></div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Detail Transaksi</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted, marginBottom: 6 }}><span>Metode</span><span style={{ color: t.ink, fontWeight: 700 }}>QRIS</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.muted, marginBottom: 14 }}><span>Tanggal</span><span style={{ color: t.ink, fontWeight: 700 }}>9 Jul 2026, 14.57</span></div>
        <Button variant="ghost" full onClick={() => {}} icon={<Icon name="share" size={15} color={t.ink} />}>Bagikan struk</Button>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={() => {}}>Kembali ke Menu</Button>
      </div>
    </div>);
}

// ── DemoFrame: kartu HP + tombol banding skeleton/asli ───────
function DemoFrame({ label, desc, Skeleton, Loaded, left, top }) {
  const [loading, setLoading] = React.useState(true);

  return (
    <div style={{ position: 'absolute', top, left, width: 402 }}>
      <div style={{ position: 'absolute', top: -92, left: 2, right: 0 }}>
        <div style={{ fontFamily: NEG_THEME.fontDisplay, fontWeight: 700, fontSize: 20, color: '#EAF0F0' }}>{label}</div>
        <div style={{ fontFamily: NEG_THEME.fontBody, fontSize: 13, color: 'rgba(234,240,240,0.6)', marginTop: 4, maxWidth: 340, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <ThemeCtx.Provider value={NEG_THEME}>
        <IOSDevice width={402} height={874} dark={NEG_THEME.statusDark}>
          <div style={{ position: 'relative', height: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: loading ? 1 : 0, transition: 'opacity .35s ease', pointerEvents: loading ? 'auto' : 'none' }}><Skeleton /></div>
            <div style={{ position: 'absolute', inset: 0, opacity: loading ? 0 : 1, transition: 'opacity .35s ease' }}><Loaded /></div>
          </div>
        </IOSDevice>
      </ThemeCtx.Provider>
      <button onClick={() => setLoading((v) => !v)} style={{ marginTop: 14, width: '100%', height: 42, border: 'none', borderRadius: 999, background: loading ? '#1799A5' : 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: NEG_THEME.fontBody, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading ?
        <React.Fragment><Icon name="arrowRight" size={15} color="#fff" stroke={2} /> Ini skeleton-nya {'\u2014'} lihat konten asli</React.Fragment> :
        <React.Fragment><Icon name="clock" size={15} color="#EAF0F0" stroke={2} /> Kembali ke tampilan skeleton</React.Fragment>}
      </button>
    </div>);
}

// ── Demo kecil: state loading pada Button ────────────────────
function ButtonLoadingDemo({ left, top }) {
  const [loading, setLoading] = React.useState(false);
  const trigger = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  };
  return (
    <div style={{ position: 'absolute', top, left, width: 300 }}>
      <div style={{ position: 'absolute', top: -92, left: 2, right: 0 }}>
        <div style={{ fontFamily: NEG_THEME.fontDisplay, fontWeight: 700, fontSize: 20, color: '#EAF0F0', marginBottom: 4 }}>Button — loading</div>
        <div style={{ fontFamily: NEG_THEME.fontBody, fontSize: 13, color: 'rgba(234,240,240,0.6)', lineHeight: 1.4, maxWidth: 280 }}>Ikon berganti jadi spinner &amp; tombol nonaktif sejenak setelah ditekan — dipakai pada "Bayar", "Update Status Pesanan", dan "Cek Status Pembayaran".</div>
      </div>
      <ThemeCtx.Provider value={NEG_THEME}>
        <div style={{ background: NEG_THEME.surface, borderRadius: NEG_THEME.radiusLg, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button full loading={loading} onClick={trigger}>{loading ? 'Bayar' : 'Tekan untuk simulasi'}</Button>
          <Button full variant="soft" loading={loading} onClick={trigger}>Cek Status Pembayaran</Button>
        </div>
      </ThemeCtx.Provider>
    </div>);
}

function SkeletonCanvas() {
  const GAP_X = 460;
  const frames = [
  { label: 'Menu', desc: 'Skeleton meniru header hero + kartu resto, lalu baris Promo Hari Ini & Best Seller (scroll horizontal).', Skeleton: MenuSkeleton, Loaded: LoadedMenu },
  { label: 'Keranjang', desc: 'Skeleton meniru daftar item, catatan pesanan, voucher & diskon, dan ringkasan bill.', Skeleton: CartSkeleton, Loaded: LoadedCart },
  { label: 'Konfirmasi Pesanan', desc: 'Skeleton meniru info meja/telepon, ringkasan pesanan, dan metode pembayaran.', Skeleton: CheckoutSkeleton, Loaded: LoadedCheckout },
  { label: 'Voucher', desc: 'Skeleton meniru daftar kartu voucher (chip, judul, syarat, tombol Pakai).', Skeleton: VoucherSkeleton, Loaded: LoadedVoucher },
  { label: 'Pembayaran QRIS', desc: 'Skeleton meniru kotak QR, timer, total pembayaran, dan langkah cara bayar.', Skeleton: QrisSkeleton, Loaded: LoadedQris },
  { label: 'Status Pesanan (Bayar Langsung)', desc: 'Skeleton meniru ikon status, kode referensi ke kasir, dan ringkasan pesanan.', Skeleton: CashStatusSkeleton, Loaded: LoadedCashStatus },
  { label: 'Pembayaran Berhasil', desc: 'Skeleton meniru hero teal + struk (pesanan, rincian, detail transaksi).', Skeleton: SuccessSkeleton, Loaded: LoadedSuccess }];

  return (
    <div style={{ position: 'relative', width: 60 + (frames.length + 1) * GAP_X, height: 1120 }}>
      <div style={{ position: 'absolute', top: 0, left: 40, fontFamily: NEG_THEME.fontDisplay, fontWeight: 700, fontSize: 26, color: '#fff' }}>Skeleton Loading — Halaman Inti</div>
      <div style={{ position: 'absolute', top: 36, left: 40, fontFamily: NEG_THEME.fontBody, fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.5 }}>Setiap kartu HP di bawah menampilkan skeleton-nya duluan (default) — tekan tombolnya untuk lihat konten asli yang akan tampil setelahnya, atau kembali lagi ke skeleton untuk bandingkan.</div>
      {frames.map((f, i) => <DemoFrame key={f.label} {...f} left={40 + i * GAP_X} top={210} />)}
      <ButtonLoadingDemo left={40 + frames.length * GAP_X} top={210} />
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<SkeletonCanvas />);
