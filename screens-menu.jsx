// screens-menu.jsx — Menu browser + Item detail sheet. Exported to window.
const { useState: useStateM, useRef: useRefM, useMemo: useMemoM, useEffect: useEffectM } = React;

// ── Dine-in / Takeaway floating pill ──────────────────────
function DineToggle() {
  const t = useTheme();
  const app = useApp();
  const isDine = app.orderType === 'dinein';
  return (
    <button
      onClick={() => app.openSheet('orderType')}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '0 12px', height: 46, borderRadius: 14, flexShrink: 0,
        border: '1.5px solid ' + t.primary,
        background: t.primarySoft,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background .15s'
      }}>
      
      <Icon name={isDine ? 'dineIn' : 'takeaway'} size={17} color={t.primary} stroke={1.8} />
      <span style={{ fontSize: 12.5, fontWeight: 700, color: t.primary, whiteSpace: 'nowrap' }}>
        {isDine ? 'Dine In' : 'Take Away'}
      </span>
    </button>);

}

// ── Order type sheet ───────────────────────────────────
function OrderTypeSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const [pending, setPending] = useStateM(params && params.pending || app.orderType);
  const opts = [
  { id: 'dinein', label: 'Dine In', sub: 'Makan di tempat', icon: 'dineIn' },
  { id: 'takeaway', label: 'Take Away', sub: 'Pesanan dibungkus', icon: 'takeaway' }];

  const confirm = () => {app.setOrderType(pending);app.closeSheet();};
  return (
    <Sheet title="Tipe Pesanan" onClose={app.closeSheet} footer={
    <div style={{ display: 'flex', gap: 10 }}>
        <Button full variant="ghost" onClick={app.closeSheet}>Batal</Button>
        <Button full onClick={confirm}>Pilih</Button>
      </div>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0 4px' }}>
        {opts.map((o) => {
          const on = pending === o.id;
          return (
            <button key={o.id} onClick={() => setPending(o.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: t.radius, cursor: 'pointer',
              border: '1.5px solid ' + (on ? t.primary : t.line),
              background: on ? t.primarySoft : t.surface,
              WebkitTapHighlightColor: 'transparent',
              transition: 'border-color .15s, background .15s',
              textAlign: 'left'
            }}>
              <div style={{ width: 44, height: 44, borderRadius: t.radiusSm, flexShrink: 0, background: on ? t.primary : t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                <Icon name={o.icon} size={22} color={on ? t.onPrimary : t.muted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: on ? t.primary : t.ink, transition: 'color .15s' }}>{o.label}</div>
                <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>{o.sub}</div>
              </div>
              <div style={{ width: 22, height: 22, boxSizing: 'border-box', borderRadius: 999, border: '1px solid ' + (on ? t.primary : t.muted), background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                {on && <Icon name="check" size={12} color={t.onPrimary} stroke={3} />}
              </div>
            </button>);

        })}
      </div>
    </Sheet>);

}

// ── Search — halaman penuh, saran + hasil ─────────────────

// Daftar awal Search (sebelum mengetik): maks. 8 menu, urutan mengikuti Figma Search (531:384).
const SEARCH_DEFAULT_IDS = ['nasi-ayam-bakar', 'iga-bakar', 'ayam-goreng-kremes', 'nasgor', 'kopi-susu', 'es-teh', 'sup-buntut', 'cendol'];

function SearchScreen() {
  const t = useTheme();
  const app = useApp();
  const [q, setQ] = useStateM('');
  const inputRef = useRefM(null);
  const grid = app.menuLayout === 'grid';

  useEffectM(() => {
    const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
    return () => clearTimeout(id);
  }, []);

  const qtyInCart = (id) => app.cart.filter((l) => l.itemId === id && !l.free).reduce((s, l) => s + l.qty, 0);
  const results = q.trim() ? MENU.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase())) : null;

  const cardRow = (items) =>
  <div style={grid ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, rowGap: 22 } : { display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((m) => grid ?
    <MenuCardGrid key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} /> :
    <MenuCardList key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} />)}
    </div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      {/* header: back + search input */}
      <div style={{ flexShrink: 0, background: t.bg, paddingTop: 46, borderBottom: '1px solid ' + t.line }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 12px' }}>
          <button onClick={app.back} aria-label="Kembali" style={{ flexShrink: 0, border: 'none', background: 'none', cursor: 'pointer', color: t.ink, display: 'flex', padding: 4, WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="back" size={24} />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: t.surface, border: '1px solid ' + t.line, borderRadius: 13, padding: '0 13px', height: 46 }}>
            <Icon name="search" size={19} color={t.faint} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari makanan atau minuman" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: t.fontBody, fontSize: 15, color: t.ink }} />
            {q && <button onClick={() => setQ('')} aria-label="Hapus" style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.faint, display: 'flex', padding: 2 }}><Icon name="close" size={18} /></button>}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: grid ? '14px 14px 130px' : '14px 16px 130px' }}>
        {results === null ?
        <>
            {/* Figma Search (531:384): sebelum mengetik tampil judul "Menu" + 8 menu (bukan "Paling
                Dicari" — belum ada data pesanan untuk menentukan yang paling dicari). Hasil ketikan tetap
                menampilkan semua yang cocok. */}
            <h3 style={{ margin: '2px 2px 12px', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 19, color: t.ink }}>Menu</h3>
            {cardRow(SEARCH_DEFAULT_IDS.map(itemById).filter(Boolean))}
          </> :
        results.length === 0 ?
        <div style={{ textAlign: 'center', padding: '60px 24px', color: t.faint }}>
            <Icon name="search" size={34} color={t.faint} />
            <div style={{ fontSize: 14.5, fontWeight: 600, color: t.muted, marginTop: 12 }}>Menu "{q}" tidak ditemukan</div>
            <div style={{ fontSize: 12.5, marginTop: 4 }}>Coba kata kunci lain.</div>
          </div> :

        <>
            <div style={{ fontSize: 13, color: t.muted, padding: '0 2px 12px' }}>{results.length} hasil untuk "{q}"</div>
            {cardRow(results)}
          </>
        }
      </div>
    </div>);

}

// Item diskon langsung (oldPrice / promo scope item) — daftar di OffersScreen.
const isOfferItem = (m) => m.oldPrice || PROMOS.some((p) => p.scope === 'item' && p.requireItem === m.id);

// ── OfferHeader — judul "Promo Hari Ini" + Lihat Semua → katalog promo ──
// Figma: OfferHeader (Case: Lihat List Voucher Hari Ini). Tombol ikut tweak app.offerSeeAll:
// 'icon' (default) = lingkaran chevron di kanan judul · 'pill' = pill "Lihat Semua" ·
// 'card' = kartu putus-putus di ujung rail (dirender VoucherRail).
function OfferHeader() {
  const t = useTheme();
  const app = useApp();
  const seeAll = app.offerSeeAll || 'icon';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px' }}>
      <h3 style={{ flex: 1, minWidth: 0, margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, color: t.ink, fontSize: 21, overflowWrap: 'break-word' }}>Promo Hari Ini</h3>
      {seeAll === 'pill' &&
      <button onClick={() => app.go('vouchers')} style={{ ...{ flexShrink: 0, border: 'none', cursor: 'pointer', background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 13px', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3, WebkitTapHighlightColor: 'transparent' }, color: "rgb(124, 55, 55)", background: "rgba(2, 2, 2, 0.1)" }}>
          Lihat Semua <Icon name="chevron" size={12} color={t.primary} />
        </button>
      }
      {seeAll === 'icon' &&
      <button onClick={() => app.go('vouchers')} aria-label="Lihat semua promo" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, border: '1px solid ' + t.line, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="chevron" size={15} color={t.primary} />
        </button>
      }
    </div>);

}

function OffersScreen() {
  const t = useTheme();
  const app = useApp();
  const offers = MENU.filter(isOfferItem);
  const qtyInCart = (id) => app.cart.filter((l) => l.itemId === id && !l.free).reduce((s, l) => s + l.qty, 0);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Promo Hari Ini" onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '14px 16px 130px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {offers.map((m) => <MenuCardList key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} />)}
        </div>
      </div>
    </div>);

}

// ── Voucher transaksi — kupon horizontal + halaman + sheet ──
function VoucherTicket({ p, onClick, full }) {
  const t = useTheme();
  const r = promoReward(p);
  const headline = r.free ? 'Gratis ' + r.label : r.value + ' off';
  const sub = (p.min != null ? 'Min. belanja ' + rupiah(p.min) : promoConds(p)[0]) || 'Tanpa syarat';
  return (
    <button onClick={onClick} style={{
      scrollSnapAlign: 'start', flexShrink: 0, width: full ? '100%' : 'auto', textAlign: 'left', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 9, background: t.surface, border: '1px solid ' + t.line,
      borderRadius: 14, padding: '7px 15px 7px 8px', boxShadow: t.shadow, fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent'
    }}>
      <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, background: t.primarySoft, color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={p.kind === 'free-item' ? 'gift' : 'tag'} size={16} color={t.primary} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: t.ink, whiteSpace: 'nowrap' }}>{headline}</div>
        <div style={{ fontSize: 10.5, color: t.muted, marginTop: 1, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </button>);

}

// Figma: PromoRail — tiket voucher transaksi saja; tap tiket → Detail Voucher (lihat saja).
function VoucherRail() {
  const t = useTheme();
  const app = useApp();
  const vouchers = PROMOS.filter(isVoucher);
  if (!vouchers.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 18px 8px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollPaddingLeft: 18, alignItems: 'flex-start' }}>
      {vouchers.map((p) => <VoucherTicket key={p.id} p={p} onClick={() => app.openSheet('voucher', { id: p.id })} />)}
      {app.offerSeeAll === 'card' &&
      <button onClick={() => app.go('vouchers')} aria-label="Lihat semua promo" style={{ scrollSnapAlign: 'start', flexShrink: 0, alignSelf: 'stretch', width: 46, border: '1px dashed ' + t.lineStrong, background: 'transparent', borderRadius: t.radiusSm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="chevron" size={18} color={t.primary} />
        </button>
      }
    </div>);

}

function VoucherSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const p = promoById(params.id);
  if (!p) return null;
  // MVP: promo otomatis — detail ini hanya untuk dilihat (dari menu, katalog, atau
  // penanda promo di keranjang). Tidak ada Pakai/Lepas. Figma: DetailPromoSheet.
  const terms = promoTerms(p);
  const period = promoPeriod(p);
  const box = { border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 7 };
  const boxLabel = { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: t.faint };
  return (
    <Sheet title={p.voucher ? 'Detail Voucher' : 'Detail Promo'} onClose={app.closeSheet} footer={<Button full onClick={app.closeSheet}>Mengerti</Button>}>
      <div style={{ display: 'flex', gap: 13, alignItems: 'center', paddingBottom: 16 }}>
        <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 13, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="tag" size={22} color={t.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* nama promo maks. 25 karakter; di atas itu turun ke 15px (Figma: Input Panjang) */}
          <div style={{ fontSize: p.title.length > 25 ? 15 : 17, fontWeight: 800, color: t.ink, overflowWrap: 'break-word' }}>{p.title}</div>
          <div style={{ fontSize: 12.5, color: t.muted }}>{promoSummary(p)}</div>
        </div>
      </div>

      {/* syarat — berapa pun jumlahnya */}
      <div style={box}>
        <div style={{ ...boxLabel, letterSpacing: 0.5 }}>{p.kelipatan ? 'Syarat (Berlaku kelipatan)' : 'Syarat'}</div>
        {terms.map((c, i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-hidden="true" style={{ flexShrink: 0, width: 4, height: 4, borderRadius: 999, background: t.faint }} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: t.ink }}>{c}</span>
          </div>
        )}
      </div>

      {/* periode promosi — tanggal · hari berlaku · jam berlaku */}
      {period &&
      <div style={{ ...box, marginTop: 14 }}>
          <div style={{ ...boxLabel, letterSpacing: 0.3 }}>Periode Promosi</div>
          {[['calendar', period.dates], ['repeat', period.days], ['clock', period.hours]].map(([icon, text]) =>
        <div key={icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              {/* stroke 3.4 di grid 24 = garis 2px pada ikon 14px, setebal ikon di Figma */}
              <Icon name={icon} size={14} color={t.muted} stroke={3.4} style={{ flexShrink: 0, marginTop: 0.5 }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: t.ink }}>{text}</span>
            </div>
        )}
        </div>
      }

      <div style={{ marginTop: 14, borderTop: '1px solid ' + t.line, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>Deskripsi</div>
        <p style={{ margin: 0, fontSize: 12.5, color: t.muted, lineHeight: 1.55, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{p.detail}</p>
        <p style={{ margin: 0, fontSize: 12, color: t.faint }}>Promo &amp; potongan dihitung saat berada di halaman keranjang.</p>
      </div>
    </Sheet>);

}

function VouchersScreen() {
  const t = useTheme();
  const app = useApp();
  const vouchers = PROMOS.filter(isVoucher);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Voucher" onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 130px' }}>
        {/* banner — voucher dipakai saat checkout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: t.primarySoft, borderRadius: t.radius, padding: '15px 16px', marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 18, color: t.ink, lineHeight: 1.2 }}>Lihat sekarang, pakai nanti</div>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: t.muted, lineHeight: 1.5 }}>Pakai voucher ini saat checkout dan nikmati lebih banyak hemat!</p>
          </div>
          <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="megaphone" size={28} color={t.primary} stroke={1.8} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vouchers.map((p) => <VoucherTicket key={p.id} p={p} full onClick={() => app.openSheet('voucher', { id: p.id })} />)}
        </div>
      </div>
    </div>);

}

// ── Promo rail — tiket promo, scroll horizontal ───────────
function PromoTicket({ p, onClick }) {
  const t = useTheme();
  const dark = shade(t.primary, -16);
  return (
    <button onClick={onClick} style={{
      scrollSnapAlign: 'start', flexShrink: 0, width: 198, textAlign: 'left', cursor: 'pointer',
      border: 'none', padding: 0, borderRadius: 13, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, ' + t.primary + ', ' + dark + ')',
      boxShadow: '0 6px 16px ' + hexA(t.primary, 0.26), color: '#fff',
      fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.14, background: 'radial-gradient(circle at 85% -25%, #fff 0, transparent 42%)', pointerEvents: 'none' }}></div>
      <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
        <div style={{ flexShrink: 0, width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1.5px dashed rgba(255,255,255,0.45)' }}>
          <Icon name={p.kind === 'free-item' ? 'gift' : 'tag'} size={19} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: '9px 11px' }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)', marginBottom: 2 }}>{p.badge}</div>
          <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
        </div>
      </div>
      {/* takik tiket di garis perforasi */}
      <div style={{ position: 'absolute', top: -6, left: 38, width: 12, height: 12, borderRadius: 999, background: t.bg }}></div>
      <div style={{ position: 'absolute', bottom: -6, left: 38, width: 12, height: 12, borderRadius: 999, background: t.bg }}></div>
    </button>);

}

// ── PromoRow — satu rail promo berjudul ────────────────────
function PromoRow({ title, promos, tab }) {
  const t = useTheme();
  const app = useApp();
  if (!promos.length) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 18px 11px' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, color: t.ink, fontSize: '21px' }}>{title}</h3>
        <button onClick={() => app.go('promo', { tab })} style={{ flexShrink: 0, border: 'none', cursor: 'pointer', background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 13px', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3, WebkitTapHighlightColor: 'transparent' }}>
          Lihat Semua <Icon name="chevron" size={12} color={t.primary} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollPaddingLeft: 18, padding: '2px 18px 8px' }}>
        {promos.map((p) => <PromoRailCard key={p.id} p={p} />)}
      </div>
    </div>);

}

// ── PromoToday — "Promo Hari Ini" di menu: judul + rail tiket voucher ──
// Lihat Semua → katalog semua promo (PromoScreen mode lihat). Kartu item promo
// tidak lagi tampil di menu — promo barang cukup lewat katalog (Figma PAGE-04V).
function PromoToday() {
  const app = useApp();
  if (!PROMOS.length) return null;
  const vouchers = PROMOS.filter(isVoucher);
  if (app.voucherStyle === 'kartu') return <PromoRow title="Voucher" promos={vouchers} tab="voucher" />;
  return (
    <>
      <OfferHeader />
      <VoucherRail />
    </>);

}

function PromoRail() {
  const t = useTheme();
  const app = useApp();
  if (!PROMOS.length) return null;
  const open = (p) => {
    if (p.scope === 'item' && p.requireItem) app.go('item', { id: p.requireItem });else
    app.go('promo');
  };
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 18px 9px' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 17, color: t.ink }}>Promo untukmu</h3>
        <button onClick={() => app.go('promo')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontSize: 12.5, fontWeight: 700, fontFamily: t.fontBody, display: 'flex', alignItems: 'center', gap: 2, WebkitTapHighlightColor: 'transparent' }}>
          Semua <Icon name="chevron" size={13} color={t.primary} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 18px 8px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollPaddingLeft: 18 }}>
        {PROMOS.map((p) => <PromoTicket key={p.id} p={p} onClick={() => open(p)} />)}
      </div>
    </div>);

}

// Strip "Tagihan Berjalan" (Klasik, mode Open Bill). Layout dipilih via tweak
// app.billStripLayout: atas · banner · bawah · dua · pill · chip · struk · shade · tab.
// ctx: 'menu' (mount atas root) · 'menu-inline' (dalam konten, utk banner) · 'cart'.
function BillStrip({ ctx = 'menu' }) {
  const t = useTheme();
  const app = useApp();
  const [open, setOpen] = useStateM(false);
  const eligible = app.menuShell === 'klasik' && (app.billStrip || 'on') !== 'off' && app.mode === 'dyn-openbill' && app.orders.length > 0;
  const layout = app.billStripLayout || 'atas';
  if (!eligible || layout === 'off') return null;

  const total = rupiah(app.grandTotal());
  const tableTxt = app.table ? ' · Meja ' + String(app.table).replace(/^Meja\s*/i, '') : '';
  const meta = app.orders.length + ' order' + tableTxt;
  const hasCart = app.cart.reduce((s, l) => s + l.qty, 0) > 0;
  const dockGap = hasCart ? 84 : 0; // ruang utk CartDock di layar menu
  const goBill = () => app.go('bill');
  const cartCount = app.cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = rupiah(app.productSubtotal());
  const viewCart = () => app.go('cart');
  const isBottom = layout === 'bawah' || layout === 'pill' || layout === 'dua' || layout === 'struk';

  // ── bar ramping (teal) — dipakai atas / banner / cart ──
  const slimBar = (radius, full) =>
  <button onClick={goBill} style={{
    width: full ? '100%' : 'calc(100% - 24px)', margin: full ? 0 : '0 12px', display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 13px', background: t.primary, border: 'none', borderRadius: radius != null ? radius : t.radiusSm,
    boxShadow: '0 4px 12px ' + hexA(t.primary, 0.24), cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
      <Icon name="receipt" size={15} color={t.onPrimary} style={{ flexShrink: 0, opacity: 0.92 }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: t.onPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Tagihan Berjalan<span style={{ fontWeight: 600, fontSize: 11.5, color: hexA('#ffffff', 0.8) }}>{'\u00a0\u00b7\u00a0' + app.orders.length + ' order'}</span>
      </span>
      <span style={{ fontSize: 14, fontWeight: 800, color: t.onPrimary, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{total}</span>
      <Icon name="chevron" size={14} color={hexA('#ffffff', 0.9)} style={{ flexShrink: 0 }} />
    </button>;

  // ── panel ringkasan (utk shade) ──
  const summaryPanel = (radiusTop) =>
  <div style={{ background: t.surface, borderRadius: radiusTop ? t.radius + 'px ' + t.radius + 'px 0 0' : '0 0 ' + t.radius + 'px ' + t.radius + 'px', boxShadow: '0 18px 40px ' + hexA('#000', 0.22), overflow: 'hidden' }}>
      <div style={{ maxHeight: 286, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '2px 16px' }}>
        {app.orders.map((o) =>
      <div key={o.id} style={{ padding: '11px 0', borderBottom: '1px solid ' + t.line }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: t.muted, letterSpacing: 0.3 }}>Order #{o.num}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.muted, fontVariantNumeric: 'tabular-nums' }}>{rupiah(o.total)}</span>
            </div>
            {o.lines.map((l) =>
        <div key={l.uid} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '3px 0' }}>
                <span style={{ fontSize: 13.5, color: t.ink, minWidth: 0 }}>{l.free ? '• ' : ''}{l.name}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: t.muted, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>×{l.qty}</span>
              </div>
        )}
          </div>
      )}
      </div>
      <div style={{ padding: '12px 16px 14px', borderTop: '1px solid ' + t.line, background: t.surface2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 11 }}>
          <span style={{ fontSize: 13, color: t.muted }}>Total · {app.orders.length} order</span>
          <span style={{ fontSize: 19, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" size="md" onClick={() => {setOpen(false);app.go('bill');}}>Detail</Button>
          <Button size="md" full onClick={() => {setOpen(false);app.go('settle');}}>Bayar Sekarang</Button>
        </div>
      </div>
    </div>;

  // ── Keranjang: selalu strip atas ramping (apa pun layout-nya) ──
  if (ctx === 'cart') {
    return <div style={{ position: 'relative', zIndex: 47, flexShrink: 0, background: t.bg, paddingTop: 46, paddingBottom: 4 }}>{slimBar()}</div>;
  }

  // ── Banner: hanya render di mount dalam-konten ──
  if (ctx === 'menu-inline') {
    if (layout !== 'banner') return null;
    return <div style={{ padding: '14px 16px 0' }}>{slimBar(t.radius, true)}</div>;
  }

  // ctx === 'menu' (mount di root, atas)
  if (layout === 'banner') return null; // ditangani mount inline

  // Layout bawah + keranjang berisi → JANGAN digabung. Tagihan pindah ke strip atas
  // (tipis), keranjang tetap dock bawah terpisah. Dua hal beda, dua tempat beda.
  if (isBottom && hasCart) {
    return <div style={{ position: 'relative', zIndex: 47, flexShrink: 0, background: t.bg, paddingTop: 46, paddingBottom: 4 }}>{slimBar()}</div>;
  }

  if (layout === 'atas') {
    return <div style={{ position: 'relative', zIndex: 47, flexShrink: 0, background: t.bg, paddingTop: 46, paddingBottom: 4 }}>{slimBar()}</div>;
  }

  if (layout === 'tab') {
    return (
      <div style={{ flexShrink: 0, background: t.bg, paddingTop: 46 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 12px 8px' }}>
          <div style={{ flex: 1, padding: '9px 0', textAlign: 'center', borderRadius: t.radiusSm, background: t.primary, color: t.onPrimary, fontWeight: 800, fontSize: 13 }}>Menu</div>
          <button onClick={goBill} style={{ flex: 1.4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 0', borderRadius: t.radiusSm, background: t.surface2, color: t.ink, border: '1px solid ' + t.line, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="receipt" size={14} color={t.primary} />Tagihan<span style={{ color: t.primary, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
          </button>
        </div>
      </div>);
  }

  if (layout === 'chip') {
    return (
      <div style={{ position: 'absolute', top: 52, right: 14, zIndex: 46 }}>
        <button onClick={goBill} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', background: t.primary, color: t.onPrimary, border: 'none', borderRadius: 999, boxShadow: '0 4px 12px ' + hexA(t.primary, 0.32), cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="receipt" size={13} color={t.onPrimary} />
          <span style={{ fontSize: 12.5, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
        </button>
      </div>);
  }

  if (layout === 'pill') {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: dockGap, zIndex: 44, display: 'flex', justifyContent: 'center', padding: '0 0 calc(12px + env(safe-area-inset-bottom))', pointerEvents: 'none' }}>
        <button onClick={goBill} style={{ pointerEvents: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 17px', background: t.primary, color: t.onPrimary, border: 'none', borderRadius: 999, boxShadow: '0 8px 22px ' + hexA(t.primary, 0.4), cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="receipt" size={16} color={t.onPrimary} />
          <span style={{ fontSize: 12, fontWeight: 700, color: hexA('#ffffff', 0.85) }}>Tagihan</span>
          <span style={{ fontSize: 14.5, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
        </button>
      </div>);
  }

  if (layout === 'bawah') {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: dockGap, zIndex: 44, padding: '0 12px calc(12px + env(safe-area-inset-bottom))', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>{slimBar(t.radius, true)}</div>
      </div>);
  }

  if (layout === 'dua') {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: dockGap, zIndex: 44, padding: '0 12px calc(12px + env(safe-area-inset-bottom))', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', borderRadius: t.radius, overflow: 'hidden', boxShadow: '0 8px 22px ' + hexA(t.primary, 0.35) }}>
          <button onClick={goBill} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, padding: '9px 15px', background: t.primary, border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: hexA('#ffffff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>Tagihan · {app.orders.length} order</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: t.onPrimary, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
          </button>
          <button onClick={() => app.go('settle')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 18px', background: shade(t.primary, -22), border: 'none', cursor: 'pointer', color: t.onPrimary, fontWeight: 800, fontSize: 14, fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            Bayar<Icon name="chevron" size={15} color={t.onPrimary} />
          </button>
        </div>
      </div>);
  }

  if (layout === 'struk') {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: dockGap, zIndex: 44, padding: '0 16px calc(8px + env(safe-area-inset-bottom))', pointerEvents: 'none' }}>
        <button onClick={goBill} style={{ pointerEvents: 'auto', position: 'relative', width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', background: t.surface, border: '1px solid ' + t.line, borderTop: '2px dashed ' + hexA(t.primary, 0.5), borderRadius: '5px 5px ' + t.radius + 'px ' + t.radius + 'px', boxShadow: '0 12px 30px ' + hexA('#000', 0.18), cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ width: 34, height: 34, borderRadius: t.radiusSm, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="receipt" size={18} color={t.primary} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: t.ink, lineHeight: 1.1 }}>Tagihan Berjalan</div>
            <div style={{ fontSize: 11.5, color: t.muted, fontWeight: 600, marginTop: 1 }}>{meta}</div>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{total}</span>
          <Icon name="chevron" size={16} color={t.faint} style={{ flexShrink: 0 }} />
        </button>
      </div>);
  }

  if (layout === 'shade') {
    return (
      <>
        <div style={{ position: 'absolute', top: 46, left: 0, right: 0, zIndex: 48, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <button onClick={() => setOpen((o) => !o)} style={{ pointerEvents: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 15px 7px', background: t.primary, color: t.onPrimary, border: 'none', borderRadius: '0 0 16px 16px', boxShadow: '0 6px 16px ' + hexA(t.primary, 0.32), cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="receipt" size={13} color={t.onPrimary} />
            <span style={{ fontSize: 12.5, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
            <Icon name="chevron" size={13} color={hexA('#ffffff', 0.9)} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
          </button>
        </div>
        {open &&
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, zIndex: 47, background: hexA('#0a1413', 0.35) }}></div>
          <div style={{ position: 'absolute', top: 46, left: 12, right: 12, zIndex: 48 }}>{summaryPanel(false)}</div>
        </>}
      </>);
  }

  return null;
}

function MenuClassicScreen({ params = {} }) {
  const t = useTheme();
  const app = useApp();
  const [cat, setCat] = useStateM('signature');
  const [q, setQ] = useStateM('');
  const [loginDismissed, setLoginDismissed] = useStateM(false);
  const [showLogout, setShowLogout] = useStateM(false);
  const [collapsed, setCollapsed] = useStateM(false);
  const [catStuck, setCatStuck] = useStateM(false);
  const [catOpen, setCatOpen] = useStateM(false);
  const [billOpen, setBillOpen] = useStateM(false);
  const [navTab, setNavTab] = useStateM('menu');
  const menyatu = app.menuHeader === 'menyatu';
  const BANNER_H = 185;
  const grid = app.menuLayout === 'grid';
  // Strip tagihan berjalan — pinned di atas (Klasik). Tweak: app.billStrip
  const stripOn = (app.billStrip || 'on') !== 'off';
  const showBillStrip = stripOn && app.mode === 'dyn-openbill' && app.orders.length > 0 && !q;
  const billLayout = app.billStripLayout || 'atas';
  const cartHasItems = app.cart.reduce((s, l) => s + l.qty, 0) > 0;
  const billBottom = billLayout === 'bawah' || billLayout === 'pill' || billLayout === 'dua' || billLayout === 'struk';
  // Bill di atas saat: layout strip/tab, ATAU layout bawah tapi keranjang berisi (tagihan pindah ke atas)
  const billAtTop = billLayout === 'atas' || billLayout === 'tab' || (billBottom && cartHasItems);
  const topPush = showBillStrip && billAtTop;
  const isNavbar = app.mode === 'dyn-openbill' && billLayout === 'navbar';
  const isStaticNavbar = false; // navbar bawah dimatikan untuk mode QR Statis — cukup menu + CartDock
  const isAnyNavbar = isNavbar || isStaticNavbar;
  const isNewHero = ['hero-search', 'split', 'search-first', 'cat-visual'].includes(app.menuHeader || 'kartu');
  const effectiveBannerH = ({'hero-search': 210, 'split': 100, 'search-first': 9999, 'cat-visual': 150})[app.menuHeader] ?? BANNER_H;
  const scrollRef = useRefM(null);
  const sectionRefs = useRefM({});
  const chipBarRef = useRefM(null);
  const catBarRef = useRefM(null);
  const chipRefs = useRefM({});
  const searchInputRef = useRefM(null);
  const catLabel = (CATEGORIES.find((c) => c.id === cat) || CATEGORIES[0]).label;

  // Scrollspy: update active chip as user scrolls + collapse header past banner
  useEffectM(() => {
    const container = scrollRef.current;
    if (!container) return;
    const heroDark = (app.menuHeader || 'kartu') !== 'search-first';
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      let active = CATEGORIES[0].id;
      for (const c of CATEGORIES) {
        const el = sectionRefs.current[c.id];
        if (!el) continue;
        const elTop = el.getBoundingClientRect().top - containerRect.top;
        if (elTop <= 110) active = c.id;
      }
      setCat(active);
      const isColl = container.scrollTop > effectiveBannerH - 56;
      setCollapsed(isColl);
      app.setStatusWhite(heroDark && !isColl);
      const cb = catBarRef.current;
      if (cb) setCatStuck((cb.getBoundingClientRect().top - containerRect.top) <= 50.5);
      setCatOpen(false);
    };
    app.setStatusWhite(heroDark && container.scrollTop <= effectiveBannerH - 56);
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => { container.removeEventListener('scroll', handleScroll); app.setStatusWhite(false); };
  }, []);

  // Keep active chip centered in chip bar when changed by scroll
  useEffectM(() => {
    const bar = chipBarRef.current;
    const chip = chipRefs.current[cat];
    if (!bar || !chip) return;
    const target = chip.offsetLeft - (bar.offsetWidth - chip.offsetWidth) / 2;
    bar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [cat]);

  // Sync navTab dari params navigasi (mis. setelah submitOrder → 'riwayat')
  useEffectM(() => { if (params && params.tab) setNavTab(params.tab); }, []);

  const scrollToSection = (catId) => {
    const el = sectionRefs.current[catId];
    const container = scrollRef.current;
    if (!el || !container) return;
    const offset = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTo({ top: offset, behavior: 'smooth' });
    setCat(catId);
  };

  const searchResults = useMemoM(() => {
    if (!q.trim()) return null;
    return MENU.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const qtyInCart = (id) => app.cart.filter((l) => l.itemId === id && !l.free).reduce((s, l) => s + l.qty, 0);

  const cardRow = (items) =>
  <div style={grid ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, rowGap: 22 } : { display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((m) => grid ?
    <MenuCardGrid key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} /> :
    <MenuCardList key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} />)}
    </div>;


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, position: 'relative' }}>

      {/* STRIP TAGIHAN BERJALAN — layout dipilih via tweak (Klasik, Open Bill) */}
      {showBillStrip && billLayout !== 'navbar' && <BillStrip ctx="menu" />}
      {/* NAVBAR — Open Bill: tab Menu / Order List / Riwayat */}
      {isNavbar && <BillNavBar activeTab={navTab} onTabChange={setNavTab} />}
      {/* NAVBAR — Static: tab Menu / Riwayat */}
      {isStaticNavbar && <StaticNavBar activeTab={navTab} onTabChange={setNavTab} />}


      {/* single scrollable container — hidden when on Order List tab */}
      {(!isAnyNavbar || navTab === 'menu') &&
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>

        {/* status bar spacer when searching */}
        {q && <div style={{ height: 50 }} />}
        {q && isNewHero &&
        <div style={{ padding: '4px 16px 8px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={17} color={t.muted} /></div>
            <input ref={searchInputRef} value={q} onChange={(e) => setQ(e.target.value)} autoFocus
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid ' + t.primary, borderRadius: t.radiusSm, padding: '10px 36px 10px 40px', fontSize: 14, fontFamily: t.fontBody, color: t.ink, background: t.surface, outline: 'none' }} />
            <button onClick={() => setQ('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}><Icon name="x" size={15} color={t.muted} /></button>
          </div>
        </div>}

        {/* banner — scroll bersama konten; saat lewat, compact header muncul */}
        {!isNewHero && !q &&
        <div style={{ position: 'relative', height: BANNER_H, overflow: 'hidden' }}>
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" src="assets/menu-banner.png" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
            {/* scrim atas — status bar tetap terbaca */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0))', pointerEvents: 'none' }}></div>
            {menyatu &&
          <>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 52%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 18px 16px', pointerEvents: 'none' }}>
                  <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: '#fff', textShadow: '0 1px 10px rgba(0,0,0,0.5)', lineHeight: 1.05 }}>{BRAND.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                    <Icon name="pin" size={12} color="rgba(255,255,255,0.92)" />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{BRAND.location}{app.table ? ' · ' + app.table : ''}</span>
                  </div>
                </div>
              </>
          }
          </div>
        }

        {/* kartu info — nama + lokasi + status login, overlap tipis di atas banner */}
        {!isNewHero && !q && !menyatu &&
        <div style={{ position: 'relative', zIndex: 1, margin: '-24px 16px 0', background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
              <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 22, lineHeight: 1 }}>{BRAND.name.trim().charAt(0).toUpperCase()}</div>
                <image-slot id="brand-logo" className="brand-logo" shape="circle" placeholder="Logo" style={{ position: 'absolute', inset: 0, display: 'block', width: 46, height: 46, borderRadius: 999 }}></image-slot>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, color: t.ink, lineHeight: 1.1, fontSize: 21 }}>{BRAND.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                  <Icon name="pin" size={12} color={t.muted} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: t.muted }}>{BRAND.location}</span>
                </div>
              </div>
              {app.table &&
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>Meja</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 3, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '5px 11px', fontSize: 13, fontWeight: 800 }}>
                    <Icon name="table" size={13} color={t.primary} />{app.table.replace(/^Meja\s*/i, '')}
                  </div>
                </div>
            }
            </div>
            {/* tipe pesanan — segmented, default order; bisa diubah per item di keranjang */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 10px 16px', borderTop: '1px solid ' + t.line }}>
              <span style={{ fontWeight: 700, color: t.muted, flexShrink: 0, fontSize: "15px" }}>Pesanan</span>
              <div style={{ flex: 1 }}></div>
              <button onClick={() => app.openSheet('orderType')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', border: '1px solid ' + t.line, borderRadius: 8, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={18} color={t.primary} />
                {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
                <Icon name="chevron" size={12} color="#D4E0E0" stroke={2.6} style={{ transform: 'rotate(90deg)' }} />
              </button>
            </div>

          </div>
        }

        {/* ── Hero Variant A: full-bleed foto + floating search + chips ── */}
        {isNewHero && !q && app.menuHeader === 'hero-search' &&
        <div style={{ marginBottom: 4 }}>
          <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" src="assets/menu-banner.png" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 68, background: 'linear-gradient(rgba(0,0,0,0.4),transparent)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 60 }}>
              <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 26, color: '#fff', lineHeight: 1.05, textShadow: '0 2px 14px rgba(0,0,0,0.4)' }}>{BRAND.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Icon name="pin" size={11} color="rgba(255,255,255,0.78)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>{BRAND.location}{app.table ? ' · ' + app.table : ''}</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', margin: '-22px 16px 0', zIndex: 2 }}>
            <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={17} color={t.muted} /></div>
            <input ref={searchInputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari menu..."
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid ' + t.line, borderRadius: t.radius, padding: '12px 12px 12px 40px', fontSize: 14, fontFamily: t.fontBody, color: t.ink, background: t.surface, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', padding: '14px 16px 2px' }}>
            <button onClick={() => app.openSheet('orderType')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', border: '1px solid ' + t.line, borderRadius: 8, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={14} color={t.primary} stroke={1.9} />
              {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
              <Icon name="chevron" size={12} color={t.muted} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>
          <div ref={chipBarRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 16px 12px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) =>
            <button ref={(el) => { chipRefs.current[c.id] = el; }} key={c.id} onClick={() => scrollToSection(c.id)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: '1.5px solid ' + (cat === c.id ? t.primary : t.line), background: cat === c.id ? t.primarySoft : t.bg, color: cat === c.id ? t.primary : t.muted, fontFamily: t.fontBody, fontSize: 13, fontWeight: cat === c.id ? 700 : 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap' }}>{c.label}</button>
            )}
          </div>
        </div>}

        {/* ── Hero Variant B: split header warna primer ── */}
        {isNewHero && !q && app.menuHeader === 'split' &&
        <div>
          <div style={{ background: t.primary, padding: '50px 18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 27, color: t.onPrimary, lineHeight: 1.05 }}>{BRAND.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                  <Icon name="pin" size={11} color={hexA('#fff', 0.7)} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: hexA('#fff', 0.7) }}>{BRAND.location}</span>
                </div>
              </div>
              {app.table &&
              <div style={{ flexShrink: 0, background: hexA('#fff', 0.18), borderRadius: t.radiusSm, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: hexA('#fff', 0.65) }}>Meja</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: t.onPrimary, lineHeight: 1.1 }}>{String(app.table).replace(/^Meja\s*/i, '')}</div>
              </div>}
            </div>
          </div>
          <div style={{ padding: '12px 16px 4px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={17} color={t.muted} /></div>
              <input ref={searchInputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari menu..."
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '11px 12px 11px 40px', fontSize: 14, fontFamily: t.fontBody, color: t.ink, background: t.surface, outline: 'none' }} />
            </div>
          </div>
          <div style={{ padding: '0 16px 4px' }}>
            <button onClick={() => app.openSheet('orderType')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', border: '1px solid ' + t.line, borderRadius: 8, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={14} color={t.primary} stroke={1.9} />
              {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
              <Icon name="chevron" size={12} color={t.muted} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>
          <div ref={chipBarRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 16px 10px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) =>
            <button ref={(el) => { chipRefs.current[c.id] = el; }} key={c.id} onClick={() => scrollToSection(c.id)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: '1.5px solid ' + (cat === c.id ? t.primary : t.line), background: cat === c.id ? t.primarySoft : t.bg, color: cat === c.id ? t.primary : t.muted, fontFamily: t.fontBody, fontSize: 13, fontWeight: cat === c.id ? 700 : 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap' }}>{c.label}</button>
            )}
          </div>
        </div>}

        {/* ── Hero Variant C: search first (search besar di atas) ── */}
        {isNewHero && !q && app.menuHeader === 'search-first' &&
        <div style={{ padding: '54px 16px 0' }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={19} color={t.muted} /></div>
            <input ref={searchInputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari menu atau kategori..."
            style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid ' + t.line, borderRadius: 999, padding: '13px 16px 13px 46px', fontSize: 15, fontFamily: t.fontBody, color: t.ink, background: t.surface, boxShadow: '0 4px 16px ' + hexA('#000', 0.07), outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8 }}>
            <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 15, color: t.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{BRAND.name}</div>
            {app.table && <span style={{ fontSize: 12, fontWeight: 700, color: t.primary, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}><Icon name="table" size={12} color={t.primary} />{String(app.table).replace(/^Meja\s*/i, '')}</span>}
            <button onClick={() => app.openSheet('orderType')} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid ' + t.line, borderRadius: 7, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={13} color={t.primary} stroke={1.9} />
              {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
            </button>
          </div>
          <div ref={chipBarRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 0 12px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) =>
            <button ref={(el) => { chipRefs.current[c.id] = el; }} key={c.id} onClick={() => scrollToSection(c.id)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: '1.5px solid ' + (cat === c.id ? t.primary : t.line), background: cat === c.id ? t.primarySoft : t.bg, color: cat === c.id ? t.primary : t.muted, fontFamily: t.fontBody, fontSize: 13, fontWeight: cat === c.id ? 700 : 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap' }}>{c.label}</button>
            )}
          </div>
        </div>}

        {/* ── Hero Variant D: banner pendek + tile kategori floating ── */}
        {isNewHero && !q && app.menuHeader === 'cat-visual' &&
        <div style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" src="assets/menu-banner.png" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(rgba(0,0,0,0.35),transparent)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: 16, bottom: 52 }}>
              <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 22, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.4)', lineHeight: 1 }}>{BRAND.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none', marginTop: '-28px', position: 'relative', zIndex: 2 }}>
            {CATEGORIES.map((c) => {
              const ico = ({ signature: 'star', minuman: 'bolt', dessert: 'gift' })[c.id] || 'dineIn';
              return (
              <button key={c.id} ref={(el) => { chipRefs.current[c.id] = el; }} onClick={() => scrollToSection(c.id)} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 12px', borderRadius: t.radius, background: cat === c.id ? t.primarySoft : t.surface, border: '1.5px solid ' + (cat === c.id ? t.primary : t.line), cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent', boxShadow: '0 4px 12px ' + hexA('#000', 0.1), minWidth: 62 }}>
                <div style={{ width: 32, height: 32, borderRadius: t.radiusSm, background: cat === c.id ? t.primary : t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={ico} size={16} color={cat === c.id ? t.onPrimary : t.primary} />
                </div>
                <span style={{ fontSize: 11, fontWeight: cat === c.id ? 800 : 600, color: cat === c.id ? t.primary : t.muted, whiteSpace: 'nowrap' }}>{c.label}</span>
              </button>);
            })}
          </div>
          <div style={{ padding: '14px 16px 4px' }}>
            <button onClick={() => app.openSheet('orderType')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', border: '1px solid ' + t.line, borderRadius: 8, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={14} color={t.primary} stroke={1.9} />
              {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
              <Icon name="chevron" size={12} color={t.muted} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>
        </div>}

        {/* tagihan berjalan — layout 'banner': strip ikut konten, di bawah header */}
        {showBillStrip && billLayout === 'banner' && <BillStrip ctx="menu-inline" />}

        {/* tagihan berjalan — Open Bill, hanya jika sudah ada order terkirim */}
        {app.mode === 'dyn-openbill' && app.orders.length > 0 && !q && !stripOn &&
        <button onClick={() => app.go('bill')} style={{
          width: 'calc(100% - 32px)', margin: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', background: t.primary, border: 'none', borderRadius: t.radius,
          boxShadow: '0 6px 18px ' + hexA(t.primary, 0.32), cursor: 'pointer', textAlign: 'left',
          fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 38, height: 38, borderRadius: t.radiusSm, background: hexA('#ffffff', 0.18), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="receipt" size={19} color={t.onPrimary} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: t.onPrimary, lineHeight: 1.1 }}>Tagihan Berjalan</div>
              <div style={{ fontSize: 12, color: hexA('#ffffff', 0.85), fontWeight: 600, marginTop: 2 }}>
                {app.orders.length} order terkirim{app.table ? ' · Meja ' + String(app.table).replace(/^Meja\s*/i, '') : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: hexA('#ffffff', 0.8) }}>Total</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.onPrimary, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginTop: 1 }}>{rupiah(app.grandTotal())}</div>
            </div>
            <Icon name="chevron" size={18} color={hexA('#ffffff', 0.9)} style={{ flexShrink: 0 }} />
          </button>
        }

        {/* sticky chip bar — muncul hanya saat scroll (collapsed) */}
        {!q && collapsed &&
        <div ref={catBarRef} style={{ position: 'sticky', top: topPush ? 0 : 50, zIndex: 9, background: t.bg, borderBottom: '1px solid ' + t.line, display: 'flex', alignItems: 'stretch', boxShadow: catStuck ? '0 2px 8px ' + hexA('#000', 0.06) : 'none', animation: 'om-fade .2s ease' }}>
          {/* notch backdrop — tutup area status bar saat sticky (hanya kalau tak ada strip atas) */}
          {!topPush && (catStuck || collapsed) && <div style={{ position: 'absolute', left: 0, right: 0, bottom: '100%', height: 50, background: t.bg }}></div>}
          <div ref={chipBarRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1, scrollbarWidth: 'none', padding: '10px 4px 10px 16px', alignItems: 'center' }}>
            {CATEGORIES.map((c) =>
            <button ref={(el) => { chipRefs.current[c.id] = el; }} key={c.id} onClick={() => scrollToSection(c.id)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: '1.5px solid ' + (cat === c.id ? t.primary : t.line), background: cat === c.id ? t.primary : t.surface, color: cat === c.id ? t.onPrimary : t.muted, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: cat === c.id ? 700 : 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap', transition: 'all .15s' }}>{c.label}</button>
            )}
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', paddingRight: 12, paddingLeft: 14, background: 'linear-gradient(to right, transparent, ' + t.bg + ' 45%)' }}>
            <button onClick={() => app.go('search')} aria-label="Cari menu" style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <Icon name="search" size={17} color={t.primary} />
            </button>
          </div>
        </div>}

        {/* semua promo & voucher — satu section gabungan */}
        <PromoToday />

        {/* menu content */}
        <div style={{ position: 'relative', zIndex: 1, background: t.bg, padding: grid ? '12px 14px 130px' : '12px 16px 130px' }}>
          {
          CATEGORIES.map((c) => {
            const items = MENU.filter((m) => m.cat === c.id);
            if (items.length === 0) return null;
            return (
              <div key={c.id} ref={(el) => {sectionRefs.current[c.id] = el;}}>
                  {/* Section header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 12px' }}>
                    <h2 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 21, color: t.ink, lineHeight: 1, flexShrink: 0, whiteSpace: 'nowrap' }}>{c.label}</h2>
                    <div style={{ flex: 1, height: 1, background: t.line }} />
                  </div>
                  {cardRow(items)}
                </div>);
          })
          }
        </div>
      </div>}

      {/* Order List tab — inline BillScreen (Open Bill navbar) */}
      {isNavbar && navTab === 'orders' &&
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <BillScreen embedded navbarMode />
      </div>}

      {/* Riwayat tab — Static only */}
      {isStaticNavbar && navTab === 'riwayat' &&
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', background: t.bg }}>
        <RiwayatPesanan />
      </div>}

      {(!isAnyNavbar || navTab === 'menu') && <CartDock />}

      {/* konfirmasi keluar akun */}
      {showLogout &&
      <div onClick={() => setShowLogout(false)} style={{ position: 'absolute', inset: 0, zIndex: 95, background: hexA('#0a1413', 0.5), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: t.surface, borderRadius: t.radiusLg, padding: '24px 22px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="phone" size={22} color={t.primary} />
            </div>
            <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink, lineHeight: 1.15 }}>Keluar dari akun?</h3>
            <p style={{ margin: '8px 0 20px', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Kamu perlu masuk lagi pakai WhatsApp untuk melihat keranjang dan menyelesaikan pesanan.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" size="md" full onClick={() => setShowLogout(false)}>Batal</Button>
              <Button size="md" full onClick={() => {setShowLogout(false);app.logout();}}>Keluar</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

function MenuCardList({ item, qty, onOpen, hidePromo }) {
  const t = useTheme();
  return (
    <div onClick={onOpen} style={{ display: 'flex', gap: 14, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 12, boxShadow: t.shadow, cursor: 'pointer', position: 'relative' }}>
      <FoodImg label={item.name.toLowerCase()} h={92} style={{ width: 92 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: t.ink, lineHeight: 1.2, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: t.muted, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Money value={item.price} style={{ fontWeight: 700, fontSize: 15, color: t.ink }} />
            {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontWeight: 600, fontSize: 12, color: t.faint }} />}
          </div>
          {qty > 0 ?
          <div style={{ minWidth: 24, height: 24, padding: '0 7px', borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{qty}</div> :
          <div style={{ width: 24, height: 24, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={14} stroke={3} color={t.onPrimary} /></div>}
        </div>
      </div>
    </div>);

}

function MenuCardGrid({ item, qty, onOpen }) {
  const t = useTheme();
  return (
    <div onClick={onOpen} style={{
      // minWidth 0: item grid tidak boleh melebar mengikuti nama panjang (nama dipotong "…")
      minWidth: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column',
      background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '8px 8px 10px', gap: 10,
      boxShadow: t.shadow
    }}>
      <div style={{ position: 'relative', height: 146 }}>
        <FoodImg label={item.name.toLowerCase()} h={146} radius={t.radiusSm} src={item.photo} style={{ width: '100%', display: 'block', borderRadius: t.radiusSm, objectFit: 'cover' }} />
        {qty > 0 ?
        <div style={{ position: 'absolute', right: 8, bottom: 8, minWidth: 24, height: 24, padding: '0 6px', borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5, boxShadow: '0 4px 12px ' + hexA(t.primary, 0.4) }}>{qty}</div> :
        <div style={{ position: 'absolute', right: 8, bottom: 8, width: 24, height: 24, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px ' + hexA(t.primary, 0.4) }}>
          <Icon name="plus" size={14} stroke={3} color={t.onPrimary} />
        </div>
        }
      </div>
      {/* Figma MenuCard grid: teks selebar isi kartu (tanpa padding samping tambahan) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0', fontSize: 14.5, color: t.ink, lineHeight: 1.25, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
        <div style={{ margin: '6px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Money value={item.price} style={{ fontWeight: 800, fontSize: 15, color: t.ink }} />
              {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontWeight: 600, fontSize: 12.5, color: t.faint }} />}
            </div>
        </div>
      </div>
    </div>);
}

// ── Bottom nav tab bar — Open Bill (Klasik) ────────────────
function BillNavBar({ activeTab = 'menu', onTabChange = () => {} }) {
  const t = useTheme();
  const app = useApp();
  if (!(app.menuShell === 'klasik' && app.mode === 'dyn-openbill' && (app.billStripLayout || 'navbar') === 'navbar')) return null;
  const hasOrders = app.orders.length > 0;
  const tabs = [
    { id: 'menu',   label: 'Menu',       icon: 'home' },
    { id: 'orders', label: 'Pesanan Saya', icon: 'receipt', badge: hasOrders ? app.orders.length : null },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
      background: t.surface, borderTop: '1px solid ' + t.line,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 20px ' + hexA('#000', 0.08) }}>
      <div style={{ display: 'flex', height: 68 }}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', position: 'relative', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent', padding: '8px 0 4px' }}>
            {active && <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2.5, borderRadius: '0 0 3px 3px', background: t.primary }} />}
            <div style={{ position: 'relative' }}>
              <Icon name={tab.icon} size={22} color={active ? t.primary : t.muted} />
              {tab.badge != null &&
              <span style={{ position: 'absolute', top: -6, right: -10, background: t.primary, color: t.onPrimary, fontSize: 10, fontWeight: 800, minWidth: 16, height: 16, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>{tab.badge}</span>}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: active ? 800 : 600, color: active ? t.primary : t.muted, lineHeight: 1, whiteSpace: 'nowrap' }}>{tab.label}</span>
            {tab.sub && <span style={{ fontSize: 10.5, fontWeight: 700, color: t.muted, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: -1 }}>{tab.sub}</span>}
          </button>);
        })}
      </div>
    </div>);
}

// ── StaticNavBar — navbar bawah untuk mode statis (non-open-bill) ──────────
function StaticNavBar({ activeTab = 'menu', onTabChange = () => {} }) {
  const t = useTheme();
  const app = useApp();
  const orderCount = app.orders.length;
  const tabs = [
    { id: 'menu',    label: 'Menu',    icon: 'home' },
    { id: 'riwayat', label: 'Riwayat', icon: 'clock', badge: orderCount > 0 ? orderCount : null },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
      background: t.surface, borderTop: '1px solid ' + t.line,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 20px ' + hexA('#000', 0.08) }}>
      <div style={{ display: 'flex', height: 68 }}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', position: 'relative', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent', padding: '8px 0 4px' }}>
              {active && <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2.5, borderRadius: '0 0 3px 3px', background: t.primary }} />}
              <div style={{ position: 'relative' }}>
                <Icon name={tab.icon} size={22} color={active ? t.primary : t.muted} />
                {tab.badge != null &&
                <span style={{ position: 'absolute', top: -6, right: -10, background: t.primary, color: t.onPrimary, fontSize: 10, fontWeight: 800, minWidth: 16, height: 16, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>{tab.badge}</span>}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? t.primary : t.muted, lineHeight: 1, whiteSpace: 'nowrap' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── RiwayatPesanan — konten tab Riwayat (static + open bill) ─────────────
function RiwayatPesanan() {
  const t = useTheme();
  const app = useApp();
  const orders = app.orders;
  if (orders.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 28px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Icon name="clock" size={32} color={t.muted} stroke={1.6} />
        </div>
        <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink, lineHeight: 1.2, marginBottom: 8 }}>Belum ada riwayat</div>
        <p style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.55, margin: 0 }}>Pesanan yang sudah dikirim akan muncul di sini.</p>
      </div>
    );
  }
  const grandTotal = orders.reduce((s, o) => s + o.total, 0);
  return (
    <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink }}>Riwayat Pesanan</div>
        <span style={{ fontSize: 13, color: t.muted }}>{orders.length} pesanan</span>
      </div>
      {/* summary bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.primarySoft, borderRadius: t.radius, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: t.radiusSm, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px ' + hexA('#000', 0.06) }}>
          <Icon name="receipt" size={19} color={t.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: t.muted, fontWeight: 600 }}>Total Semua Pesanan</div>
          <Money value={grandTotal} style={{ fontSize: 17, fontWeight: 800, color: t.ink }} />
        </div>
        <button onClick={() => app.go('bill')} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 13px', border: 'none', background: t.primary, borderRadius: 999, color: t.onPrimary, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
          Detail <Icon name="chevron" size={13} color={t.onPrimary} />
        </button>
      </div>
      {[...orders].reverse().map((order) => (
        <div key={order.id} style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, marginBottom: 12, overflow: 'hidden', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid ' + t.line }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: t.ink }}>Pesanan #{order.num}</div>
              <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>{order.time}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Money value={order.total} style={{ fontSize: 15, fontWeight: 800, color: t.ink }} />
              <div style={{ fontSize: 11, color: t.primary, fontWeight: 700, marginTop: 2 }}>Terkirim ✓</div>
            </div>
          </div>
          <div style={{ padding: '6px 16px 12px' }}>
            {order.lines.map((l, i) => (
              <div key={l.uid || i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: i < order.lines.length - 1 ? '1px solid ' + t.line : 'none', alignItems: 'flex-start' }}>
                <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: l.free ? t.primarySoft : t.surface2, color: l.free ? t.primary : t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11.5, flexShrink: 0, marginTop: 1 }}>{l.qty}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, color: t.ink, fontWeight: 600, display: 'block' }}>{l.name}</span>
                  {l.options && l.options.length > 0 && <span style={{ fontSize: 11.5, color: t.muted }}>{l.options.join(' · ')}</span>}
                </div>
                {!l.free
                  ? <Money value={l.unit * l.qty} style={{ fontSize: 13, fontWeight: 600, color: t.muted, flexShrink: 0 }} />
                  : <span style={{ fontSize: 12, fontWeight: 700, color: t.primary, flexShrink: 0 }}>Gratis</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sticky cart dock ───────────────────────────────────────
function CartDock() {
  const t = useTheme();
  const app = useApp();
  const count = app.cart.reduce((s, l) => s + l.qty, 0);
  const total = app.productSubtotal(); // setelah Promo Produk (beli-N ikut terpotong)
  const isNavbar = app.menuShell === 'klasik' && (app.billStripLayout || 'atas') === 'navbar';
  const bottomOffset = isNavbar ? 'calc(80px + env(safe-area-inset-bottom))' : 'calc(10px + env(safe-area-inset-bottom))';
  if (count === 0) return null;
  // QR Dinamis: meja sudah teridentifikasi dari QR → pesan tanpa login.
  // Login (WhatsApp/OTP) hanya untuk akun member, opsional via footer home.
  const viewCart = () => {
    app.go('cart');
  };
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 20px ' + bottomOffset, zIndex: 45, pointerEvents: 'none' }}>
      <button onClick={viewCart} style={{ height: 48, pointerEvents: 'auto', width: '100%', border: 'none', cursor: 'pointer', background: t.primary, color: t.onPrimary, borderRadius: t.radius, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 15px ' + hexA(t.primary, 0.4), WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <Icon name="cart" size={24} />
          <span style={{ position: 'absolute', top: -7, right: -9, background: t.onPrimary, color: t.primary, fontSize: 11, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</span>
        </div>
        <span style={{ flex: 1, textAlign: 'left', fontWeight: 700, fontSize: 15.5 }}>Lihat Keranjang</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: t.onPrimary, fontVariantNumeric: 'tabular-nums' }}>{rupiah(total)}</span>
      </button>
    </div>);

}

// ── Item detail sheet ──────────────────────────────────────
function ItemScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const item = itemById(params.id);
  const editLine = params.edit || null; // baris keranjang yang sedang diubah
  const mods = item.mods || [];
  // grup wajib yang hanya punya SATU opsi: terpilih otomatis, tampil sebagai baris tetap (OptionRow State=Fixed)
  const isFixedGroup = (m) => m.type === 'single' && m.required && m.options.length === 1;
  const [qty, setQty] = useStateM(editLine ? editLine.qty : 1);
  const [sel, setSel] = useStateM(() => {
    const init = {};
    const matchOpt = (o) => (editLine.options || []).some((s) => s === o.label || s.indexOf(o.label + ' (+') === 0);
    const initGroup = (m) => {
      if (m.type === 'single') {
        const found = editLine && m.options.find((o) => matchOpt(o));
        init[m.id] = found ? found.id : isFixedGroup(m) ? m.options[0].id : undefined;
      } else if (m.type === 'multi') {
        init[m.id] = editLine ? m.options.filter((o) => matchOpt(o)).map((o) => o.id) : [];
      }
    };
    // sub-grup bersarang (o.subs) disimpan di sel yang sama, dengan id grupnya sendiri
    mods.forEach((m) => {initGroup(m);m.options.forEach((o) => (o.subs || []).forEach(initGroup));});
    return init;
  });
  // grup bersarang yang sedang dibuka lagi daftarnya (untuk ganti pilihan utama)
  const [openGroups, setOpenGroups] = useStateM({});
  const [notes, setNotes] = useStateM(editLine ? editLine.notes || '' : '');

  const chosen = (m) => m.type === 'single' ? m.options.filter((o) => o.id === sel[m.id]) : m.options.filter((o) => (sel[m.id] || []).includes(o.id));
  // sub-grup aktif = milik opsi yang terpilih di grup pilih-1 (mis. Potongan dst. setelah pilih ayam)
  const subsOf = (m) => m.type === 'single' && chosen(m)[0] && chosen(m)[0].subs || [];
  const groupPrice = (m) => chosen(m).reduce((s2, o) => s2 + o.price, 0);
  const modPrice = mods.reduce((sum, m) => sum + groupPrice(m) + subsOf(m).reduce((s2, sg) => s2 + groupPrice(sg), 0), 0);
  const unit = item.price + modPrice;
  // semua grup wajib (termasuk sub-grup bersarang) harus terisi sebelum bisa ditambahkan
  const filled = (m) => !m.required || chosen(m).length > 0;
  const subsFilled = (m) => subsOf(m).every(filled);
  const requiredOk = mods.every((m) => filled(m) && subsFilled(m));

  const pick = (m, o) => setSel((s) => {
    if (m.type === 'single') {
      if (s[m.id] === o.id) return s;
      // ganti pilihan utama → sub-grup pilihan lama dikosongkan
      const next = { ...s, [m.id]: o.id };
      m.options.forEach((x) => (x.subs || []).forEach((sg) => {next[sg.id] = sg.type === 'single' ? undefined : [];}));
      return next;
    }
    const cur = s[m.id] || [];
    return { ...s, [m.id]: cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id] };
  });

  const add = () => {
    const contentLabels = (item.contents || []).map((c) => c.qty + '× ' + c.name);
    // sertakan biaya tambahan di label opsi (mis. "Telur Dadar (+Rp7.000)") biar user paham kenapa harganya beda
    const fmt = (o) => o.price > 0 ? o.label + ' (+' + rupiah(o.price) + ')' : o.label;
    const optLabels = mods.flatMap((m) => [...chosen(m), ...subsOf(m).flatMap(chosen)].map(fmt));
    if (editLine) app.removeLine(editLine.uid);
    // isi tetap paket ikut disimpan di options (tampil di Keranjang, Konfirmasi & Struk) dan
    // ditandai lewat `contents` supaya bisa dirender sebagai PaketDetail.
    app.addToCart({ itemId: item.id, name: item.name, unit, qty, options: [...contentLabels, ...optLabels], contents: contentLabels, notes });
    // Promo terkait item (mis. item gratis) dihitung otomatis di keranjang dari barang yang ditambah tamu.
    app.back();
  };

  // ── tampilan — Figma: Item Detail (529:361) & Burger Combo Deluxe (4461:3140) ──
  const groupLabel = (title, subtitle) =>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.ink }}>{title}</h4>
      {subtitle && <div style={{ fontSize: 11.5, color: t.faint }}>{subtitle}</div>}
    </div>;
  const group = (key, children) =>
  <div key={key} style={{ marginTop: 16, borderTop: '1px solid ' + t.line, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>;
  // OptionRow: label 14.5 semibold · harga +RpX · kotak centang 24 (r8), sama untuk pilih-1 & pilih-banyak
  const rowStyle = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14.5px 2px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' };
  const labelStyle = (on) => ({ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, lineHeight: '21px', color: on ? t.ink : t.muted });
  const check = (on) =>
  <span style={{ height: 21, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: 8, border: on ? 'none' : '1px solid ' + t.faint, background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .12s' }}>
        {on && <Icon name="check" size={14} color={t.onPrimary} stroke={3} />}
      </span>
    </span>;
  const fixedRow = (label, key) =>
  <div key={key} style={rowStyle}><span style={labelStyle(true)}>{label}</span><span style={{ width: 24, height: 21, flexShrink: 0 }} /></div>;
  const priceTag = (o) => o.price > 0 && <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 600, lineHeight: '21px', color: t.muted, whiteSpace: 'nowrap' }}>+{rupiah(o.price)}</span>;
  // ModifierChip (Figma 1952:136) — opsi sub-grup bersarang. Terpilih: latar surface, garis primary
  // 1.5px, teks primary (padding dikurangi 0.5px supaya ukuran chip tidak bergeser).
  const chip = (sg, o) => {
    const on = chosen(sg).includes(o);
    return (
      <button key={o.id} onClick={() => pick(sg, o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: on ? '9.5px 15.5px' : '10px 16px', borderRadius: 999, border: on ? '1.5px solid ' + t.primary : '1px solid ' + t.line, background: on ? t.surface : t.surface2, color: on ? t.primary : t.ink, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, lineHeight: 'normal', whiteSpace: 'nowrap', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        {o.label}
        {o.price > 0 && <span style={{ color: t.primary }}>+{rupiah(o.price)}</span>}
      </button>);
  };
  // sub-grup bersarang di bawah pilihan utama: garis penghubung teal 3px + grup chip.
  // Pill "PILIH 1" hanya tampil selama grup wajibnya belum diisi (Figma 1948:56053 vs 1948:69731).
  const nested = (m) =>
  <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 3, borderRadius: 2, background: t.primary, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {subsOf(m).map((sg) =>
      <div key={sg.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>{sg.label}</span>
              {!filled(sg) && <Pill tone="primary" style={{ fontSize: 8, border: 'none' }}>{sg.type === 'single' ? 'Pilih 1' : 'Wajib'}</Pill>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{sg.options.map((o) => chip(sg, o))}</div>
          </div>
      )}
      </div>
    </div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title={editLine ? 'Ubah Pesanan' : 'Detail Menu'} onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 18px 24px' }}>
        <FoodImg label={item.name.toLowerCase()} h={210} radius={t.radius} src={item.photo} />
        <h2 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 26, color: t.ink, lineHeight: 1.1, overflowWrap: 'anywhere' }}>{item.name}</h2>
        <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.55, margin: '8px 0 4px' }}>{item.desc}</p>

        {/* isi tetap paket — tanpa kontrol & tanpa harga: tidak ada yang perlu diputuskan */}
        {(item.contents || []).length > 0 &&
        group('isi', <>
            {groupLabel('Isi paket')}
            <div>{item.contents.map((c, i) => fixedRow(c.qty + '× ' + c.name, i))}</div>
          </>)
        }

        {mods.map((m) => {
          // Paket Bundling (Figma 1952:53362): opsi ber-sub-grup tampil sebagai "1x <opsi>" + sub-grupnya
          // (prefiks "1x" langsung tampil, juga selama sub-grup belum terisi).
          // · grup satu opsi (Paket Komplit Berdua: "Isi paket" → 1x Ayam Goreng Kremes) = isi tetap:
          //   judul "Isi paket" tanpa subtitle, baris tidak bisa diketuk.
          // · grup banyak opsi: setelah dipilih, judul & opsi lain disembunyikan; ketuk baris untuk
          //   membuka daftar lagi (ganti pilihan).
          if (subsOf(m).length && !openGroups[m.id]) {
            const o = chosen(m)[0];
            const fixed = isFixedGroup(m);
            const rowContent = <>
                <span style={labelStyle(true)}>{'1x ' + o.label}</span>
                {priceTag(o)}
                <span style={{ width: 24, height: 21, flexShrink: 0 }} />
              </>;
            return group(m.id, <>
              {fixed && groupLabel(m.label)}
              <div>
                {fixed ?
                <div style={rowStyle}>{rowContent}</div> :
                <button onClick={() => setOpenGroups((g) => ({ ...g, [m.id]: true }))} style={{ ...rowStyle, cursor: 'pointer' }}>{rowContent}</button>}
                {nested(m)}
              </div>
            </>);
          }
          const fixed = isFixedGroup(m);
          const subtitle = fixed ? null : m.required ?
          m.type === 'single' ? 'Wajib dipilih · maks. 1' : 'Wajib dipilih' :
          m.type === 'single' ? 'Opsional · maks. 1' : 'Opsional · bisa lebih dari satu';
          return (
            group(m.id, <>
              {groupLabel(m.label, subtitle)}
              <div>
                {fixed ? fixedRow(m.options[0].label) :
                m.options.map((o) => {
                  const on = chosen(m).includes(o);
                  return (
                    <button key={o.id} onClick={() => {pick(m, o);if (o.subs) setOpenGroups((g) => ({ ...g, [m.id]: false }));}} style={{ ...rowStyle, cursor: 'pointer' }}>
                      <span style={labelStyle(on)}>{o.label}</span>
                      {priceTag(o)}
                      {check(on)}
                    </button>);
                })}
              </div>
            </>));
        })}

        <h4 style={{ margin: '22px 0 10px', fontSize: 15, fontWeight: 700, color: t.ink }}>Catatan untuk dapur</h4>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="cth. tanpa bawang, sambal pisah" rows={2} style={{ width: '100%', boxSizing: 'border-box', resize: 'none', display: 'block', border: '1.5px solid ' + t.line, borderRadius: t.radiusSm, background: t.surface2, padding: '12px 12px 24px', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
      </div>
      {/* dock bawah — qty + tambah */}
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px 26px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <QtyStepper value={qty} onChange={setQty} />
          <Button full onClick={add} disabled={!requiredOk} style={{ flex: 1 }}>{editLine ? 'Simpan · ' + rupiah(unit * qty) : 'Tambah · ' + rupiah(unit * qty)}</Button>
        </div>
      </div>
    </div>);

}

// dispatcher — pilih shell menu sesuai tweak (sidebar = default, klasik = scroll lama)
function MenuScreen(props) {
  const app = useApp();
  return app.menuShell === 'klasik' ? <MenuClassicScreen {...props} /> : <MenuSidebarScreen {...props} />;
}

Object.assign(window, { MenuScreen, MenuClassicScreen, BillStrip, PromoToday, MenuCardList, MenuCardGrid, SearchScreen, OffersScreen, VouchersScreen, VoucherSheet, ItemScreen, OrderTypeSheet, CartDock, DineToggle, StaticNavBar, RiwayatPesanan });