// popup-explore.jsx — Eksplorasi 3 arah redesain popup "Pesanan perlu diperbarui/disesuaikan"
// Fokus: judul/copy, layout daftar isu, dan penambahan elemen visual.

const DANGER = '#BE4137';
const DSOFT = 'rgba(190,60,55,0.10)';
const PRICE = '#B8781F';
const PSOFT = 'rgba(184,120,31,0.12)';

const SCN = { subtotal: 284000, promoAmount: 30000, total: 254000 };

const ISSUE = {
  stock: { icon: 'cart', cat: 'Stok', color: DANGER, soft: DSOFT, line: 'Ayam Goreng Lengkuas habis', detail: 'Tidak tersedia · dihapus dari pesanan', itemId: 'ayam-goreng-lengkuas' },
  price: { icon: 'tag', cat: 'Harga', color: PRICE, soft: PSOFT, line: 'Nasi Ayam Bakar Madu naik harga', before: 45000, after: 48000, itemId: 'nasi-ayam-bakar' },
  promo: { icon: 'coupon', cat: 'Promo', color: '#1799A5', soft: 'rgba(23,153,165,0.12)', line: 'Diskon 20% gugur', detail: 'Kuota harian habis', amount: 30000 }
};

const ACTION_SUB = {
  stock: 'Barang ini kosong. Hapus dari keranjang sebelum lanjut bayar.',
  price: 'Harga baru berlaku otomatis. Lanjut kalau sudah oke.',
  promo: 'Diskon ini tidak lagi berlaku untuk pesananmu.'
};

function textFor(keys) {
  const hasStock = keys.includes('stock');
  const multi = keys.length > 1;
  if (!multi) {
    const it = ISSUE[keys[0]];
    return { title: it.line, sub: ACTION_SUB[keys[0]], hasStock, single: true, it };
  }
  const title = hasStock ? 'Yuk, sesuaikan pesananmu' : 'Ada perubahan di pesananmu';
  const sub = hasStock ?
  'Ada barang yang habis. Hapus dulu dari keranjang sebelum lanjut bayar.' :
  'Kami perbarui beberapa hal saat cek ulang stok & harga. Cek dulu sebelum lanjut.';
  return { title, sub, hasStock, single: false };
}

function InlineDelta({ it }) {
  if (it.before) return <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', justifyContent: 'center', marginTop: 10 }}><Money value={it.before} strike style={{ fontSize: 13 }} /><Money value={it.after} style={{ fontSize: 15 }} /></div>;
  if (it.amount) return <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: it.color, textAlign: 'center' }}>{'\u2212' + rupiah(it.amount) + ' dihapus'}</div>;
  return null;
}

// ══════════════════════════════════════════════════════════════
// Variant A — Kartu ringkas + badge kategori bertumpuk
// ══════════════════════════════════════════════════════════════
function RowA({ k, last }) {
  const t = useTheme();
  const it = ISSUE[k];
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'center', padding: '12px 13px', marginBottom: last ? 0 : 8, borderRadius: 14, background: it.soft }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 10, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <Icon name={it.icon} size={16} color={it.color} stroke={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: it.color, textTransform: 'uppercase', letterSpacing: 0.4 }}>{it.cat}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.28, marginTop: 1 }}>{it.line}</div>
        {it.detail && <div style={{ fontSize: 12, color: t.muted, marginTop: 1 }}>{it.detail}</div>}
        {it.before && <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginTop: 3 }}>
          <Money value={it.before} strike style={{ fontSize: 12 }} />
          <Money value={it.after} style={{ fontSize: 13 }} />
        </div>}
      </div>
    </div>);
}

function CheckAlertA({ keys }) {
  const t = useTheme();
  const { title, sub, hasStock, single, it } = textFor(keys);
  const capColor = single ? it.color : ISSUE[keys[0]].color;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: single ? 'center' : 'flex-end', justifyContent: 'center', padding: single ? 20 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: single ? 340 : 'none', background: t.surface, borderRadius: single ? t.radiusLg : '22px 22px 0 0', overflow: 'hidden', boxShadow: single ? '0 28px 70px rgba(0,0,0,0.42)' : '0 -18px 50px rgba(0,0,0,0.35)', paddingBottom: single ? 0 : 'env(safe-area-inset-bottom)' }}>
        <div style={{ height: 5, background: 'linear-gradient(90deg, ' + keys.map((k) => ISSUE[k].color).join(', ') + (keys.length === 1 ? ', ' + capColor : '') + ')' }} />
        {!single && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 36, height: 4, borderRadius: 3, background: t.line }} /></div>}
        <div style={{ padding: single ? '24px 22px 20px' : '14px 22px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', marginBottom: 14, justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 110, height: 110, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, ' + capColor + '26 0%, transparent 70%)', pointerEvents: 'none' }} />
            {keys.map((k, i) => {
              const ik = ISSUE[k];
              return (
                <div key={k} style={{ position: 'relative', width: 50, height: 50, borderRadius: 999, background: ik.soft, border: '3px solid ' + t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -15, zIndex: keys.length - i, boxShadow: '0 6px 14px rgba(0,0,0,0.10)' }}>
                  <Icon name={ik.icon} size={21} color={ik.color} stroke={2} />
                </div>);
            })}
          </div>
          {single && <div style={{ fontSize: 10.5, fontWeight: 800, color: it.color, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>{it.cat}</div>}
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 21, color: t.ink, lineHeight: 1.22 }}>{title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</p>
          {single && <InlineDelta it={it} />}
        </div>
        {!single && <div style={{ padding: '18px 20px 4px' }}>
          {keys.map((k, i) => <RowA key={k} k={k} last={i === keys.length - 1} />)}
        </div>}
        <div style={{ padding: '16px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <Button full onClick={() => {}}>Kembali ke keranjang</Button> :
          <React.Fragment>
              <Button full onClick={() => {}}>Perbarui &amp; lanjut</Button>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// Variant B — Strip kategori editorial + list bersih
// ══════════════════════════════════════════════════════════════
function ChipB({ k }) {
  const it = ISSUE[k];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px 5px 7px', borderRadius: 999, background: it.soft }}>
      <Icon name={it.icon} size={13} color={it.color} stroke={2.2} />
      <span style={{ fontSize: 11.5, fontWeight: 700, color: it.color }}>{it.cat}</span>
    </div>);
}

function RowB({ k, last }) {
  const t = useTheme();
  const it = ISSUE[k];
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '13px 0', borderBottom: last ? 'none' : '1px solid ' + t.line }}>
      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 3, background: it.color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.3 }}>{it.line}</div>
        {it.detail && <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{it.detail}{it.amount ? ' · \u2212' + rupiah(it.amount) : ''}</div>}
        {it.before && <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginTop: 2 }}>
          <Money value={it.before} strike style={{ fontSize: 12 }} />
          <Money value={it.after} style={{ fontSize: 12.5 }} />
        </div>}
      </div>
    </div>);
}

function CheckAlertB({ keys }) {
  const t = useTheme();
  const { title, sub, hasStock, single, it } = textFor(keys);
  const mastColors = keys.map((k) => ISSUE[k].color);
  const mastBg = mastColors.length > 1 ? 'linear-gradient(115deg, ' + mastColors.join(', ') + ')' : mastColors[0];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: single ? 'center' : 'flex-end', justifyContent: 'center', padding: single ? 20 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: single ? 340 : 'none', background: t.surface, borderRadius: single ? t.radiusLg : '22px 22px 0 0', overflow: 'hidden', boxShadow: single ? '0 28px 70px rgba(0,0,0,0.42)' : '0 -18px 50px rgba(0,0,0,0.35)', paddingBottom: single ? 0 : 'env(safe-area-inset-bottom)' }}>
        <div style={{ background: mastBg, padding: single ? '20px 22px 20px' : '10px 22px 18px', position: 'relative' }}>
          {!single && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><div style={{ width: 36, height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.55)' }} /></div>}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {keys.map((k) => {
              const ik = ISSUE[k];
              return (
                <div key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px 5px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.22)' }}>
                  <Icon name={ik.icon} size={13} color="#fff" stroke={2.2} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>{ik.cat}</span>
                </div>);
            })}
          </div>
          <h3 style={{ margin: '14px 0 0', fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 21, color: '#fff', lineHeight: 1.22 }}>{title}</h3>
          <p style={{ margin: '7px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</p>
          {single && it.before && <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginTop: 10 }}><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'line-through' }}>{rupiah(it.before)}</span><span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{rupiah(it.after)}</span></div>}
          {single && it.amount && <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: '#fff' }}>{'\u2212' + rupiah(it.amount) + ' dihapus'}</div>}
        </div>
        {!single && <div style={{ margin: '16px 22px 0' }}>
          {keys.map((k, i) => <RowB key={k} k={k} last={i === keys.length - 1} />)}
        </div>}
        <div style={{ padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <Button full onClick={() => {}}>Kembali ke keranjang</Button> :
          <React.Fragment>
              <Button full onClick={() => {}}>Perbarui &amp; lanjut</Button>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// Variant C — Hero icon besar + struk mini pembanding
// ══════════════════════════════════════════════════════════════
function heroFor(keys) {
  if (keys.includes('stock')) return { icon: 'cart', color: DANGER, soft: DSOFT };
  if (keys.length > 1) return { icon: 'bell', color: PRICE, soft: PSOFT };
  return keys[0] === 'promo' ? { icon: 'coupon', color: '#1799A5', soft: 'rgba(23,153,165,0.12)' } : { icon: 'tag', color: PRICE, soft: PSOFT };
}

function RowC({ k, last }) {
  const t = useTheme();
  const it = ISSUE[k];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: last ? 'none' : '1px dashed ' + t.line }}>
      <Icon name={it.icon} size={15} color={it.color} stroke={2.1} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>{it.line}</div>
      {it.before ?
      <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexShrink: 0 }}>
          <Money value={it.before} strike style={{ fontSize: 11.5 }} />
          <Money value={it.after} style={{ fontSize: 12.5 }} />
        </div> :
      it.amount ?
      <span style={{ fontSize: 12.5, fontWeight: 700, color: it.color, flexShrink: 0 }}>{'\u2212' + rupiah(it.amount)}</span> :

      <span style={{ fontSize: 11, fontWeight: 700, color: it.color, background: it.soft, borderRadius: 999, padding: '3px 8px', flexShrink: 0 }}>Habis</span>}
    </div>);
}

// ── Baris isu sebagai kartu terpisah (thumbnail + badge solid) ─
function CardRowC({ k }) {
  const t = useTheme();
  const it = ISSUE[k];
  const hasPhoto = it.itemId;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: t.surface, borderRadius: t.radius, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + t.line }}>
      {hasPhoto ?
      <FoodImg label={it.line.toLowerCase()} h={44} radius={10} style={{ width: 44, flexShrink: 0 }} src={(itemById(it.itemId) || {}).photo} /> :
      <div style={{ width: 44, height: 44, borderRadius: 10, background: it.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={it.icon} size={19} color={it.color} stroke={2} />
        </div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.3 }}>{it.line}</div>
        {it.before ?
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginTop: 3 }}>
            <Money value={it.before} strike style={{ fontSize: 11.5 }} />
            <Money value={it.after} style={{ fontSize: 12.5 }} />
          </div> :
        it.amount ?
        <span style={{ fontSize: 12, fontWeight: 700, color: it.color, marginTop: 2, display: 'block' }}>{'\u2212' + rupiah(it.amount)}</span> :

        <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3, color: '#fff', background: it.color, borderRadius: 5, padding: '2px 7px' }}>HABIS</span>}
      </div>
    </div>);
}

function CheckAlertC({ keys }) {
  const t = useTheme();
  const { title, sub, hasStock, single, it } = textFor(keys);
  const hero = heroFor(keys);
  const slotId = 'issue-art-' + keys.join('-');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: single ? 'center' : 'flex-end', justifyContent: 'center', padding: single ? 20 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: single ? 340 : 'none', background: t.surface, borderRadius: single ? t.radiusLg : '22px 22px 0 0', overflow: 'hidden', boxShadow: single ? '0 28px 70px rgba(0,0,0,0.42)' : '0 -18px 50px rgba(0,0,0,0.35)', paddingBottom: single ? 0 : 'env(safe-area-inset-bottom)' }}>
        {!single && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 36, height: 4, borderRadius: 3, background: t.line }} /></div>}
        <div style={{ background: hero.soft, padding: single ? '22px 22px 20px' : '16px 22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <image-slot id={slotId} shape="rounded" radius="16" placeholder={'Ilustrasi \u2013 ' + (single ? it.cat.toLowerCase() : 'pesanan berubah')} style={{ width: 148, height: 112, marginBottom: 14, flexShrink: 0 }}></image-slot>
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 21, color: t.ink, lineHeight: 1.22 }}>{title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</p>
          {single && <InlineDelta it={it} />}
        </div>
        {!single && <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: 999, background: 'rgba(12,14,14,0.55)' }} />
          <div style={{ position: 'absolute', right: -8, top: -8, width: 16, height: 16, borderRadius: 999, background: 'rgba(12,14,14,0.55)' }} />
          <div style={{ borderTop: '1px dashed ' + t.line }} />
          <div style={{ margin: '16px 22px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {keys.map((k) => <CardRowC key={k} k={k} />)}
          </div>
        </div>}
        <div style={{ padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <React.Fragment>
              <Button full onClick={() => {}}>Lihat Menu Lain</Button>
              <Button full variant="soft" onClick={() => {}}>Kembali ke Keranjang</Button>
            </React.Fragment> :
          <React.Fragment>
              <Button full onClick={() => {}}>Perbarui &amp; lanjut</Button>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ══════════════════════════════════════════════════════════════
// Variant C2 — sama seperti C, tapi hero polos putih (tanpa tint warna)
// ══════════════════════════════════════════════════════════════
function CheckAlertC2({ keys }) {
  const t = useTheme();
  const { title, sub, hasStock, single, it } = textFor(keys);
  const hero = heroFor(keys);
  const slotId = 'issue-art2-' + keys.join('-');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', alignItems: single ? 'center' : 'flex-end', justifyContent: 'center', padding: single ? 20 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: single ? 340 : 'none', background: t.surface, borderRadius: single ? t.radiusLg : '22px 22px 0 0', overflow: 'hidden', boxShadow: single ? '0 28px 70px rgba(0,0,0,0.42)' : '0 -18px 50px rgba(0,0,0,0.35)', paddingBottom: single ? 0 : 'env(safe-area-inset-bottom)' }}>
        {!single && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}><div style={{ width: 36, height: 4, borderRadius: 3, background: t.line }} /></div>}
        <div style={{ background: t.surface, padding: single ? '22px 22px 20px' : '16px 22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <image-slot id={slotId} shape="rounded" radius="16" placeholder={'Ilustrasi \u2013 ' + (single ? it.cat.toLowerCase() : 'pesanan berubah')} style={{ width: 148, height: 112, marginBottom: 14, flexShrink: 0 }}></image-slot>
          <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 21, color: t.ink, lineHeight: 1.22 }}>{title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5, textWrap: 'pretty' }}>{sub}</p>
          {single && <InlineDelta it={it} />}
        </div>
        {!single && <div style={{ position: 'relative' }}>
          <div style={{ borderTop: '1px solid ' + t.line }} />
          <div style={{ margin: '16px 22px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {keys.map((k) => <CardRowC key={k} k={k} />)}
          </div>
        </div>}
        <div style={{ padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {hasStock ?
          <React.Fragment>
              <Button full onClick={() => {}}>Lihat Menu Lain</Button>
              <Button full variant="soft" onClick={() => {}}>Kembali ke Keranjang</Button>
            </React.Fragment> :
          <React.Fragment>
              <Button full onClick={() => {}}>Perbarui &amp; lanjut</Button>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.muted, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}>Kembali ke keranjang</button>
            </React.Fragment>}
        </div>
      </div>
    </div>);
}

// ── Backdrop keranjang (statis, sama untuk semua) ──────────
const BD_LINES = [
{ id: 'nasi-ayam-bakar', name: 'Nasi Ayam Bakar Madu', qty: 2, total: 90000, opts: ['Pedas', '+ Nasi Putih'] },
{ id: 'ayam-goreng-lengkuas', name: 'Ayam Goreng Lengkuas', qty: 1, total: 38000, opts: ['Sedang'] },
{ id: 'iga-bakar', name: 'Iga Bakar Saji', qty: 2, total: 156000, opts: [] }];

function CartBackdrop() {
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
          <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: i === BD_LINES.length - 1 ? 'none' : '1px solid ' + t.line }}>
              <FoodImg label={l.name.toLowerCase()} h={56} radius={10} style={{ width: 56, flexShrink: 0 }} src={(itemById(l.id) || {}).photo} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>{l.name}</h4>
                {l.opts.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{l.opts.join(' · ')}</div>}
                <Money value={l.total} style={{ fontWeight: 700, fontSize: 14, display: 'block', marginTop: 6 }} />
              </div>
              <div style={{ minWidth: 24, borderRadius: 8, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, height: 22, padding: '0 7px' }}>{l.qty}</div>
            </div>)}
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
        <Button full onClick={() => {}}>Konfirmasi Pesanan</Button>
      </div>
    </div>);
}

function NegCase({ keys, Variant }) {
  const t = useTheme();
  return (
    <div style={{ position: 'relative', height: '100%', background: t.bg, fontFamily: t.fontBody, color: t.ink }}>
      <CartBackdrop />
      <Variant keys={keys} />
    </div>);
}

// ════════════════════════════════════════════════════════════
const NEG_THEME = makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' });
const VARIANTS = [
{ Variant: CheckAlertA, label: 'A · Badge bertumpuk', desc: 'Header ikon kategori + kartu tinted per isu' },
{ Variant: CheckAlertB, label: 'B · Strip kategori editorial', desc: 'Chip kategori di atas + list garis aksen tipis' },
{ Variant: CheckAlertC, label: 'C · Hero ikon + struk mini', desc: 'Panel ikon besar ala popup stok habis + baris pembanding' },
{ Variant: CheckAlertC2, label: 'C2 · Hero polos putih', desc: 'Sama seperti C, tapi latar ilustrasi putih (tanpa tint warna)' }];


const KEYSETS = [
{ keys: ['stock'], sub: 'Cuma stok habis' },
{ keys: ['price'], sub: 'Cuma harga naik' },
{ keys: ['promo'], sub: 'Cuma promo gugur' },
{ keys: ['promo', 'price'], sub: 'Promo & harga' },
{ keys: ['stock', 'price', 'promo'], sub: 'Campuran (ada habis)' }];


function Frame({ v, ks, left, top }) {
  return (
    <div style={{ position: 'absolute', top, left, width: 402 }}>
      <div style={{ position: 'absolute', top: -30, left: 2, right: 0 }}>
        <div style={{ fontFamily: NEG_THEME.fontBody, fontSize: 13, color: 'rgba(234,240,240,0.55)' }}>{ks.sub}</div>
      </div>
      <ThemeCtx.Provider value={NEG_THEME}>
        <IOSDevice width={402} height={874} dark={NEG_THEME.statusDark}>
          <NegCase keys={ks.keys} Variant={v.Variant} />
        </IOSDevice>
      </ThemeCtx.Provider>
    </div>);
}

function Canvas() {
  const GAP_X = 460;
  const GAP_Y = 1010;
  return (
    <div style={{ position: 'relative', width: 60 + KEYSETS.length * GAP_X, height: 130 + VARIANTS.length * GAP_Y }}>
      {VARIANTS.map((v, vi) =>
      <div key={v.label} style={{ position: 'absolute', top: 60 + vi * GAP_Y, left: 0, right: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: 40, fontFamily: NEG_THEME.fontDisplay, fontWeight: 700, fontSize: 24, color: '#EAF0F0' }}>{v.label}</div>
          <div style={{ position: 'absolute', top: 32, left: 40, fontFamily: NEG_THEME.fontBody, fontSize: 13.5, color: 'rgba(234,240,240,0.6)' }}>{v.desc}</div>
          {KEYSETS.map((ks, ki) => <Frame key={ks.sub} v={v} ks={ks} left={40 + ki * GAP_X} top={110} />)}
        </div>
      )}
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Canvas />);
