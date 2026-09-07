// skeleton-screens.jsx — Skeleton loading states untuk halaman inti (Menu, Keranjang,
// Konfirmasi Pesanan) — dibuat meniru layout ASLI dari Self Order.html persis (hero +
// kartu resto, promo/best seller horizontal scroll, ringkasan bill, dst) supaya saat
// koneksi lambat, bentuk halaman langsung kelihatan dan tidak terasa blank/macet.

// ── primitif shimmer ─────────────────────────────────────────
function Skel({ w, h, r, style }) {
  const t = useTheme();
  return (
    <div
      className="skel-shimmer"
      style={{
        width: w, height: h, borderRadius: r != null ? r : 6, flexShrink: 0,
        background: (style && style.background) || t.surface2, position: 'relative', overflow: 'hidden', ...style
      }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(100deg, transparent 30%, ${hexA(t.ink, 0.06)} 45%, ${hexA(t.ink, 0.06)} 55%, transparent 70%)`,
        backgroundSize: '200% 100%', animation: 'skel-sweep 1.5s ease-in-out infinite'
      }} />
    </div>);
}

// injeksikan keyframe sekali (skel-sweep dipakai semua instance Skel)
(function ensureSkelKeyframes() {
  if (document.getElementById('skel-kf')) return;
  const s = document.createElement('style');
  s.id = 'skel-kf';
  s.textContent = '@keyframes skel-sweep{0%{background-position:120% 0}100%{background-position:-40% 0}}';
  document.head.appendChild(s);
})();

const SG = '#DCE1E3'; // abu skeleton netral (dipakai di atas foto/hero gelap juga)

// ══════════════════════════════════════════════════════════════
// MENU — hero foto + kartu resto + Promo Hari Ini + Best Seller
// ══════════════════════════════════════════════════════════════
function SkelRailCard({ w = 122, tall = true }) {
  return (
    <div style={{ width: w, flexShrink: 0 }}>
      <Skel h={tall ? w : 70} r={12} style={{ width: w, background: SG, marginBottom: 8 }} />
      <Skel h={11} style={{ width: '85%', background: SG, marginBottom: 6 }} />
      <Skel h={11} style={{ width: '50%', background: SG }} />
    </div>);
}

function SkelOfferCard() {
  return (
    <div style={{ width: 232, flexShrink: 0, display: 'flex', gap: 11, background: '#fff', border: '1px solid ' + SG, borderRadius: 14, padding: 10 }}>
      <Skel h={54} r={10} style={{ width: 54, background: SG }} />
      <div style={{ flex: 1, paddingTop: 2 }}>
        <Skel h={9} style={{ width: '60%', background: SG, marginBottom: 6 }} />
        <Skel h={12} style={{ width: '85%', background: SG, marginBottom: 8 }} />
        <Skel h={12} style={{ width: 50, background: SG }} />
      </div>
    </div>);
}

function MenuSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', overflow: 'hidden', background: t.bg }}>
      <div style={{ position: 'relative', height: 140, background: SG, paddingTop: 44 }} />
      <div style={{ background: t.surface, borderRadius: '18px 18px 0 0', marginTop: -14, position: 'relative', padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Skel h={46} r={999} style={{ width: 46, background: SG }} />
          <div style={{ flex: 1 }}>
            <Skel h={15} style={{ width: '55%', background: SG, marginBottom: 7 }} />
            <Skel h={11} style={{ width: '35%', background: SG }} />
          </div>
          <Skel h={22} style={{ width: 46, background: SG }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skel h={13} style={{ width: 70, background: SG }} />
          <Skel h={22} r={7} style={{ width: 90, background: SG }} />
        </div>
        <Skel h={30} r={10} style={{ width: '100%', background: SG, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Skel h={44} r={10} style={{ flex: 1, background: SG }} />
          <Skel h={44} r={10} style={{ flex: 1, background: SG }} />
        </div>
      </div>
      <div style={{ padding: '20px 16px 20px' }}>
        <Skel h={16} style={{ width: 130, background: SG, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden', marginBottom: 26 }}>
          <SkelOfferCard /><SkelOfferCard />
        </div>
        <Skel h={16} style={{ width: 110, background: SG, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
          <SkelRailCard w={150} /><SkelRailCard w={150} /><SkelRailCard w={150} />
        </div>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// KERANJANG — Pesanan Kamu, item, catatan, voucher, ringkasan
// ══════════════════════════════════════════════════════════════
function SkelCartLine({ last }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + t.line, position: 'relative' }}>
      <Skel h={48} r={10} style={{ width: 48 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Skel h={13} style={{ width: '65%', marginBottom: 7 }} />
        <Skel h={10} style={{ width: '35%', marginBottom: 8 }} />
        <Skel h={13} style={{ width: 60 }} />
      </div>
      <Skel h={20} r={999} style={{ width: 20, position: 'absolute', top: 14, right: 0 }} />
    </div>);
}

function CartSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Keranjang" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Skel h={16} style={{ width: 110 }} />
          <Skel h={13} style={{ width: 90 }} />
        </div>
        <div style={{ background: t.surface, borderRadius: t.radius, padding: '0 16px 4px', border: '1px solid ' + t.line, boxShadow: t.shadow }}>
          <SkelCartLine /><SkelCartLine last />
        </div>
        <Skel h={13} style={{ width: 110, margin: '18px 0 8px' }} />
        <Skel h={44} r={t.radius} style={{ width: '100%', marginBottom: 14 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 14 }}>
          <Skel h={20} r={6} style={{ width: 20 }} />
          <div style={{ flex: 1 }}>
            <Skel h={13} style={{ width: '45%', marginBottom: 6 }} />
            <Skel h={10} style={{ width: '65%' }} />
          </div>
          <Skel h={14} r={999} style={{ width: 14 }} />
        </div>
        <div style={{ marginTop: 14, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><Skel h={12} style={{ width: 70 }} /><Skel h={12} style={{ width: 55 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><Skel h={12} style={{ width: 95 }} /><Skel h={12} style={{ width: 45 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><Skel h={12} style={{ width: 60 }} /><Skel h={12} style={{ width: 50 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <Skel h={15} style={{ width: 45 }} /><Skel h={19} style={{ width: 85 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Skel h={54} r={t.radius} style={{ width: '100%' }} />
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// KONFIRMASI PESANAN — meja/telp, atas nama, ringkasan, pembayaran
// ══════════════════════════════════════════════════════════════
function SkelPayRow() {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderRadius: t.radius, border: '1.5px solid ' + t.line, marginBottom: 10 }}>
      <Skel h={38} r={10} style={{ width: 38 }} />
      <div style={{ flex: 1 }}>
        <Skel h={13} style={{ width: '40%', marginBottom: 6 }} />
        <Skel h={10} style={{ width: '60%' }} />
      </div>
      <Skel h={18} r={999} style={{ width: 18 }} />
    </div>);
}

function CheckoutSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Konfirmasi Pesanan" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '2px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '12px 14px', boxShadow: t.shadow, marginBottom: 16 }}>
          <Skel h={12} style={{ width: 60 }} />
          <div style={{ flex: 1 }} />
          <Skel h={12} style={{ width: 100 }} />
        </div>
        <Skel h={10} style={{ width: 80, marginBottom: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.surface, border: '1.5px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '13px 15px', marginBottom: 18 }}>
          <Skel h={17} r={999} style={{ width: 17 }} />
          <Skel h={13} style={{ width: '55%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><Skel h={10} style={{ width: 110 }} /><Skel h={10} style={{ width: 40 }} /></div>
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 12, padding: 14, borderBottom: '1px solid ' + t.line }}>
            <Skel h={44} r={10} style={{ width: 44 }} />
            <div style={{ flex: 1 }}>
              <Skel h={13} style={{ width: '60%', marginBottom: 6 }} />
              <Skel h={10} style={{ width: '30%', marginBottom: 8 }} />
              <Skel h={13} style={{ width: 55 }} />
            </div>
          </div>
          <div style={{ padding: '10px 14px' }}><Skel h={11} style={{ width: 140 }} /></div>
          <div style={{ padding: '0 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><Skel h={11} style={{ width: 60 }} /><Skel h={11} style={{ width: 50 }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><Skel h={11} style={{ width: 100 }} /><Skel h={11} style={{ width: 45 }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 12px' }}><Skel h={11} style={{ width: 55 }} /><Skel h={11} style={{ width: 40 }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px', borderTop: '1px solid ' + t.line }}>
            <Skel h={14} style={{ width: 40 }} /><Skel h={17} style={{ width: 75 }} />
          </div>
        </div>
        <Skel h={10} style={{ width: 130, marginBottom: 10 }} />
        <SkelPayRow /><SkelPayRow />
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Skel h={54} r={t.radius} style={{ width: '100%' }} />
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// VOUCHER — daftar kartu voucher (chip tag + judul + syarat + tombol)
// ══════════════════════════════════════════════════════════════
function SkelVoucherCard() {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 14, marginBottom: 12, boxShadow: t.shadow }}>
      <Skel h={60} r={12} style={{ width: 60 }} />
      <div style={{ flex: 1 }}>
        <Skel h={14} style={{ width: '55%', marginBottom: 8 }} />
        <Skel h={10} style={{ width: '75%', marginBottom: 5 }} />
        <Skel h={10} style={{ width: '60%' }} />
      </div>
      <Skel h={30} r={999} style={{ width: 56 }} />
    </div>);
}

function VoucherSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Voucher" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px 24px' }}>
        <SkelVoucherCard /><SkelVoucherCard /><SkelVoucherCard />
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// PEMBAYARAN QRIS — kotak QR, timer, total, cara bayar
// ══════════════════════════════════════════════════════════════
function QrisSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Pembayaran QRIS" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 20px 24px' }}>
        <div style={{ background: t.surface, borderRadius: t.radiusLg, border: '1px solid ' + t.line, boxShadow: t.shadow, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <Skel h={172} r={12} style={{ width: 172, marginBottom: 14 }} />
          <Skel h={12} style={{ width: 120, marginBottom: 10 }} />
          <Skel h={14} style={{ width: 90, marginBottom: 10 }} />
          <Skel h={12} style={{ width: 100 }} />
        </div>
        <Skel h={64} r={t.radiusLg} style={{ width: '100%', marginBottom: 16 }} />
        <Skel h={13} style={{ width: 80, marginBottom: 10 }} />
        {[0, 1, 2, 3].map((i) => <Skel key={i} h={11} style={{ width: 220 - i * 12, marginBottom: 8 }} />)}
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Skel h={54} r={t.radius} style={{ width: '100%' }} />
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// STATUS PESANAN (bayar langsung / kasir) — ikon jam pasir, kode, ringkasan
// ══════════════════════════════════════════════════════════════
function CashStatusSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Status Pesanan" onBack={() => {}} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '8px 18px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 18px' }}>
          <Skel h={72} r={999} style={{ width: 72, marginBottom: 14 }} />
          <Skel h={16} style={{ width: 190, marginBottom: 10 }} />
          <Skel h={11} style={{ width: 240, marginBottom: 5 }} />
          <Skel h={11} style={{ width: 200 }} />
        </div>
        <Skel h={64} r={t.radius} style={{ width: '100%', marginBottom: 14 }} />
        <Skel h={40} r={t.radius} style={{ width: '100%', marginBottom: 14 }} />
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: 14 }}>
          <Skel h={13} style={{ width: 90, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <Skel h={11} style={{ flex: 1 }} /><Skel h={11} style={{ width: 60 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid ' + t.line }}>
            <Skel h={11} style={{ width: 60 }} /><Skel h={11} style={{ width: 55 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Skel h={54} r={t.radius} style={{ width: '100%' }} />
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// PEMBAYARAN BERHASIL — hero teal + struk (pesanan, rincian, transaksi)
// ══════════════════════════════════════════════════════════════
function SuccessSkeleton() {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <div style={{ flexShrink: 0, background: hexA(t.primary, 0.55), padding: '50px 20px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Skel h={64} r={999} style={{ width: 64, background: 'rgba(255,255,255,0.4)', marginBottom: 12 }} />
        <Skel h={13} style={{ width: 130, background: 'rgba(255,255,255,0.4)', marginBottom: 10 }} />
        <Skel h={26} style={{ width: 150, background: 'rgba(255,255,255,0.4)' }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 18px' }}>
        <Skel h={10} style={{ width: 90, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><Skel h={12} style={{ width: 150 }} /><Skel h={12} style={{ width: 55 }} /></div>
        <Skel h={10} style={{ width: 110, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Skel h={11} style={{ width: 60 }} /><Skel h={11} style={{ width: 55 }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><Skel h={11} style={{ width: 80 }} /><Skel h={11} style={{ width: 50 }} /></div>
        <Skel h={10} style={{ width: 100, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Skel h={11} style={{ width: 55 }} /><Skel h={11} style={{ width: 45 }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Skel h={11} style={{ width: 60 }} /><Skel h={11} style={{ width: 90 }} /></div>
        <Skel h={44} r={t.radius} style={{ width: '100%', marginTop: 16, marginBottom: 14 }} />
      </div>
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Skel h={54} r={t.radius} style={{ width: '100%' }} />
      </div>
    </div>);
}

Object.assign(window, {
  Skel, MenuSkeleton, SkelRailCard, SkelOfferCard,
  CartSkeleton, SkelCartLine,
  CheckoutSkeleton, SkelPayRow,
  VoucherSkeleton, SkelVoucherCard, QrisSkeleton, CashStatusSkeleton, SuccessSkeleton
});
