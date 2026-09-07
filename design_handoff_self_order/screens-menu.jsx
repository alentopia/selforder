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
              <div style={{ width: 44, height: 44, borderRadius: t.radiusSm, flexShrink: 0, background: on ? hexA(t.primary, 0.15) : t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                <Icon name={o.icon} size={22} color={on ? t.primary : t.muted} stroke={1.7} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: on ? t.primary : t.ink, transition: 'color .15s' }}>{o.label}</div>
                <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>{o.sub}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, border: '2px solid ' + (on ? t.primary : t.faint), background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                {on && <Icon name="check" size={12} color={t.onPrimary} stroke={3} />}
              </div>
            </button>);

        })}
      </div>
    </Sheet>);

}

// ── Search — halaman penuh, saran + hasil ─────────────────
const POPULAR_IDS = ['nasi-ayam-bakar', 'iga-bakar', 'ayam-goreng-kremes', 'nasgor', 'kopi-susu', 'es-teh', 'sup-buntut', 'cendol'];

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
  const popular = POPULAR_IDS.map(itemById).filter(Boolean);
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
            <h3 style={{ margin: '2px 2px 12px', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 19, color: t.ink }}>Paling Dicari</h3>
            {cardRow(popular)}
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

// ── Today's Offer — item diskon, list horizontal (selalu list) ──
// Hanya item dengan diskon harga langsung (oldPrice / promo scope item).
// Item yang cuma jadi HADIAH free-item promo transaksi (mis. Es Teh gratis
// min. belanja) TIDAK ditampilkan di sini — itu muncul sebagai voucher.
const isOfferItem = (m) => m.oldPrice || PROMOS.some((p) => p.scope === 'item' && p.requireItem === m.id);

function OfferCard({ item, onOpen }) {
  const t = useTheme();
  const out = item.stock === 0;
  const triggerPromo = PROMOS.find((p) => p.scope === 'item' && p.requireItem === item.id) ||
  PROMOS.find((p) => p.kind === 'free-item' && (p.fixedItem === item.id || (p.choices || []).includes(item.id)));
  return (
    <div onClick={out ? undefined : onOpen} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 232, display: 'flex', alignItems: 'center', gap: 11, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: 9, cursor: out ? 'default' : 'pointer', opacity: out ? 0.55 : 1 }}>
      <FoodImg label={item.name.toLowerCase()} h={62} radius={t.radiusSm} src={item.photo} style={{ width: 62, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {triggerPromo && <div style={{ fontSize: 11, color: '#E2680E', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: "500" }}>{triggerPromo.tagline || triggerPromo.title}</div>}
        <h4 style={{ margin: 0, color: t.ink, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: "15px", fontWeight: "400" }}>{item.name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
          <Money value={item.price} style={{ fontSize: 14.5, fontWeight: 800, color: t.ink }} />
          {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontSize: 12, color: t.faint, fontWeight: 600 }} />}
          {item.oldPrice && <Icon name="tag" size={13} color={t.primary} />}
        </div>
      </div>
      {out ? <StockNote item={item} /> :
      <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px ' + hexA(t.primary, 0.4) }}><Icon name="plus" size={18} stroke={2.6} /></div>
      }
    </div>);

}

function TodayOffer() {
  const t = useTheme();
  const app = useApp();
  const offers = MENU.filter(isOfferItem);
  if (!offers.length) return null;
  const seeAll = app.offerSeeAll || 'card';
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 18px 11px' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, color: t.ink, fontSize: '21px', whiteSpace: 'nowrap' }}>Promo Hari Ini</h3>
        {seeAll === 'pill' &&
        <button onClick={() => app.go('offers')} style={{ ...{ flexShrink: 0, border: 'none', cursor: 'pointer', background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 13px', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3, WebkitTapHighlightColor: 'transparent' }, color: "rgb(124, 55, 55)", background: "rgba(2, 2, 2, 0.1)" }}>
            Lihat Semua <Icon name="chevron" size={12} color={t.primary} />
          </button>
        }
        {seeAll === 'icon' &&
        <button onClick={() => app.go('offers')} aria-label="Lihat semua promo" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, border: '1px solid ' + t.line, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', fontWeight: "400", fontSize: "13px" }}>
            <Icon name="chevron" size={15} color={t.primary} />
          </button>
        }
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollPaddingLeft: 18, padding: '2px 18px 8px' }}>
        {offers.slice(0, 3).map((m) => <OfferCard key={m.id} item={m} onOpen={() => app.openItem(m.id)} />)}
        {seeAll === 'card' &&
        <button onClick={() => app.go('offers')} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 104, alignSelf: 'stretch', border: '1px dashed ' + t.line, background: 'transparent', borderRadius: t.radius, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: t.primary, fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrowRight" size={18} color={t.primary} /></div>
            Lihat Semua
          </button>
        }
      </div>
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
        <div style={{ fontSize: 13, fontWeight: 800, color: t.ink, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{headline}</div>
        <div style={{ fontSize: 10.5, color: t.muted, marginTop: 1, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </button>);

}

function VoucherRail() {
  const t = useTheme();
  const app = useApp();
  const vouchers = PROMOS.filter(isVoucher);
  if (!vouchers.length) return null;
  return (
    <div style={{ marginTop: 16, margin: "10px 0px 0px" }}>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 18px 8px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollPaddingLeft: 18, textAlign: "left", justifyContent: "flex-start", alignItems: "flex-start" }}>
        {vouchers.map((p) => <VoucherTicket key={p.id} p={p} onClick={() => app.openSheet('voucher', { id: p.id })} />)}
        <button onClick={() => app.go('vouchers')} aria-label="Lihat semua voucher" style={{ scrollSnapAlign: 'start', flexShrink: 0, alignSelf: 'stretch', width: 46, border: '1px dashed ' + t.lineStrong, background: 'transparent', borderRadius: t.radiusSm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="chevron" size={18} color={t.primary} />
        </button>
      </div>
    </div>);

}

function VoucherSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const p = promoById(params.id);
  if (!p) return null;
  const r = promoReward(p);
  const conds = promoConds(p);
  const canClaim = !!(params && params.claim);
  const locked = p.activation === 'locked' && !(app.unlocked || []).includes(p.id);
  const on = app.applied.some((a) => a.id === p.id);
  // syarat min. belanja — promo tak bisa dipakai sampai keranjang memenuhi minimum
  const sub = app.cartSubtotal();
  const belowMin = !!(p.min && sub < p.min);
  const shortfall = belowMin ? p.min - sub : 0;
  const doClaim = () => {
    if (belowMin) return;
    if (p.kind === 'free-item' && p.needsPick) {app.closeSheet();app.openSheet('freeitem', { promoId: p.id });return;}
    app.applyPromo(p.id);app.closeSheet();
  };
  const footer = !canClaim ?
  <Button full onClick={app.closeSheet}>Mengerti</Button> :
  locked ?
  <Button full icon="instagram" onClick={() => app.unlockPromo(p.id)}>Saya Sudah Follow</Button> :
  on ?
  <Button full variant="ghost" onClick={() => {app.removePromo(p.id);app.closeSheet();}}>Lepas Promo</Button> :
  belowMin ?
  <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 9, fontSize: 12.5, fontWeight: 600, color: t.muted }}>
        <Icon name="info" size={14} color={t.faint} />
        <span>Kurang {rupiah(shortfall)} lagi untuk pakai promo ini</span>
      </div>
      <Button full disabled onClick={() => {}}>Belanja Min. {rupiah(p.min)}</Button>
    </div> :
  <Button full onClick={doClaim}>{p.kind === 'free-item' && p.needsPick ? 'Pilih & Pakai' : 'Pakai Promo'}</Button>;
  return (
    <Sheet title={p.voucher ? 'Detail Voucher' : 'Detail Promo'} onClose={app.closeSheet} footer={footer}>
      <div style={{ display: 'flex', gap: 13, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flexShrink: 0, width: 58, minHeight: 58, borderRadius: 15, background: t.primary, color: t.onPrimary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 4px' }}>
          {r.free ?
          <Icon name="gift" size={26} color={t.onPrimary} /> :
          <span style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: r.value.length > 4 ? 17 : 24, lineHeight: 1 }}>{r.value}</span>}
          <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.9, marginTop: 1 }}>{r.free ? 'Gratis' : 'Off'}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: t.ink, lineHeight: 1.2 }}>{p.title}</div>
          </div>
          <div style={{ fontSize: 12.5, color: t.muted, marginTop: 2 }}>{p.sub}</div>
        </div>
      </div>

      {/* syarat — berapa pun jumlahnya, sebagai deskripsi */}
      <div style={{ marginBottom: 14, border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '11px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>Syarat</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {conds.map((c, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="checkCircle" size={14} color={t.primary} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: t.ink, lineHeight: 1.45 }}>{c}</span>
            </div>
          )}
        </div>
      </div>

      {/* blok follow Instagram — hanya untuk promo terkunci, saat mode klaim (di keranjang) */}
      {locked && canClaim && p.social &&
      <a href={p.social.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14, padding: '12px 14px', borderRadius: t.radius, background: t.primarySoft, textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="instagram" size={20} color={t.onPrimary} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>Buka Instagram</div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 1 }}>{p.social.handle}</div>
          </div>
          <Icon name="arrowRight" size={16} color={t.primary} style={{ flexShrink: 0 }} />
        </a>
      }

      <div style={{ borderTop: '1px solid ' + t.line, paddingTop: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink, marginBottom: 5 }}>Syarat &amp; Ketentuan</div>
        <p style={{ margin: 0, fontSize: 12.5, color: t.muted, lineHeight: 1.55, whiteSpace: 'pre-line' }}>{p.detail}</p>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: t.faint, lineHeight: 1.5 }}>{!canClaim ? 'Pakai promo ini dari keranjang.' : locked ? 'Follow Instagram kami untuk membuka promo ini.' : 'Promo & potongan dihitung saat konfirmasi pesanan.'}</p>
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

// ── PromoToday — satu rail gabungan semua promo & voucher ──
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

function PromoToday() {
  const app = useApp();
  if (!PROMOS.length) return null;
  const vouchers = PROMOS.filter(isVoucher);
  return (
    <>
      {app.voucherStyle === 'kartu' ?
      <PromoRow title="Voucher" promos={vouchers} tab="voucher" /> :
      <VoucherRail />}
      <TodayOffer />
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
  const cartTotal = rupiah(app.cartSubtotal());
  const viewCart = () => (app.mode === 'dyn-openbill' || app.loggedIn) ? app.go('cart') : app.openSheet('login', { next: 'cart' });
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

function MenuClassicScreen() {
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
      {/* NAVBAR — tab Menu / Order List (Klasik, Open Bill) */}
      {isNavbar && <BillNavBar activeTab={navTab} onTabChange={setNavTab} />}


      {/* single scrollable container — hidden when on Order List tab */}
      {(!isNavbar || navTab === 'menu') &&
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
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
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
                <Icon name={app.orderType === 'dinein' ? 'dineIn' : 'takeaway'} size={14} color={t.primary} stroke={1.9} />
                {app.orderType === 'dinein' ? 'Dine In' : 'Take Away'}
                <Icon name="chevron" size={12} color={t.muted} style={{ transform: 'rotate(90deg)' }} />
              </button>
            </div>
            {/* footer — prompt login / status akun */}
            {app.loggedIn ?
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: '1px solid ' + t.line, background: hexA(t.primary, 0.05) }}>
                <Icon name="phone" size={15} color={t.muted} />
                <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Masuk sebagai <b style={{ fontWeight: 800 }}>+62 {(app.phone || '').slice(0, 3)}•••{(app.phone || '').slice(-4)}</b></span>
                <button onClick={() => setShowLogout(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontWeight: 700, fontSize: 13, fontFamily: t.fontBody, padding: 0, flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>Keluar</button>
              </div> :
          <button onClick={() => app.openSheet('login')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', borderTop: '1px solid ' + t.line, background: hexA(t.primary, 0.05), cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
                <Icon name="bolt" size={15} color={t.primary} />
                <span style={{ flex: 1, minWidth: 0, color: t.muted, fontSize: "13px", fontWeight: "600" }}>Pesanan berikutnya lebih cepat</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.primary, flexShrink: 0 }}>Masuk</span>
              </button>
          }
          </div>
        }

        {/* ── Hero Variant A: full-bleed foto + floating search + chips ── */}
        {isNewHero && !q && app.menuHeader === 'hero-search' &&
        <div style={{ marginBottom: 4 }}>
          <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
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
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
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

        {/* sticky chip bar — disembunyikan saat di atas, muncul saat scroll */}
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

      {/* Order List tab — inline BillScreen (navbar stays persistent) */}
      {isNavbar && navTab === 'orders' &&
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <BillScreen embedded navbarMode />
      </div>}

      {(!isNavbar || navTab === 'menu') && <CartDock />}

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
function StockNote({ item }) {
  const t = useTheme();
  if (item.stock === 0) return <Pill tone="danger">Habis</Pill>;
  if (item.stock <= 5) return <Pill tone="promo" icon="fire">Sisa {item.stock}</Pill>;
  return null;
}

function MenuCardList({ item, qty, onOpen, hidePromo }) {
  const t = useTheme();
  const out = item.stock === 0;
  const triggerPromo = PROMOS.find((p) => p.scope === 'item' && p.requireItem === item.id);
  const freeInPromo = PROMOS.find((p) => p.scope === 'item' && (
  p.choices && p.choices.includes(item.id) || p.fixedItem === item.id)
  );
  return (
    <div onClick={out ? undefined : onOpen} style={{ display: 'flex', gap: 14, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 12, boxShadow: t.shadow, cursor: out ? 'default' : 'pointer', opacity: out ? 0.6 : 1, position: 'relative' }}>
      <FoodImg label={item.name.toLowerCase()} h={92} style={{ width: 92 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: t.ink, lineHeight: 1.2, flex: 1 }}>{item.name}</h3>
        </div>
        {!hidePromo && triggerPromo && <div style={{ marginTop: 4, fontSize: 12, letterSpacing: 0.1, fontWeight: "400", color: "rgb(230, 125, 47)" }}>{triggerPromo.tagline || triggerPromo.title}</div>}
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: t.muted, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Money value={item.price} style={{ fontWeight: 700, fontSize: 15, color: t.ink }} />
            {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontWeight: 600, fontSize: 12, color: t.faint }} />}
          </div>
          {out ? <StockNote item={item} /> : qty > 0 ?
          <div style={{ minWidth: 32, height: 32, padding: '0 10px', borderRadius: 10, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{qty}</div> :
          <div style={{ width: 32, height: 32, borderRadius: 10, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18} stroke={2.6} /></div>}
        </div>
      </div>
    </div>);

}

function MenuCardGrid({ item, qty, onOpen }) {
  const t = useTheme();
  const out = item.stock === 0;
  const triggerPromo = PROMOS.find((p) => p.scope === 'item' && p.requireItem === item.id);
  const freeInPromo = PROMOS.find((p) => p.scope === 'item' && (
  p.choices && p.choices.includes(item.id) || p.fixedItem === item.id)
  );
  const hasPromo = triggerPromo || freeInPromo;
  return (
    <div onClick={out ? undefined : onOpen} style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 8, boxShadow: t.shadow, cursor: out ? 'default' : 'pointer', opacity: out ? 0.55 : 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <FoodImg label={item.name.toLowerCase()} h={146} radius={t.radiusSm} src={item.photo} style={{ width: '100%' }} />
        {hasPromo &&
        <div style={{ position: 'absolute', top: 8, left: 8 }}><Pill tone="promo" style={{ background: t.primary, color: t.onPrimary, border: 'none', boxShadow: '0 2px 8px ' + hexA(t.primary, 0.4) }}>Promo</Pill></div>
        }
        {!out && (qty > 0 ?
        <div style={{ position: 'absolute', right: 8, bottom: 8, minWidth: 34, height: 34, padding: '0 10px', borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, boxShadow: '0 4px 12px ' + hexA(t.primary, 0.4) }}>{qty}</div> :
        <div style={{ position: 'absolute', right: 8, bottom: 8, width: 34, height: 34, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px ' + hexA(t.primary, 0.4) }}><Icon name="plus" size={19} stroke={2.6} /></div>)
        }
      </div>
      <h3 style={{ margin: '10px 2px 0', fontSize: 14.5, color: t.ink, lineHeight: 1.25, fontWeight: "300" }}>{item.name}</h3>
      <div style={{ margin: '4px 2px 2px' }}>
        {out ? <StockNote item={item} /> :
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Money value={item.price} style={{ fontWeight: 800, fontSize: 15, color: t.ink }} />
            {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontWeight: 600, fontSize: 12, color: t.faint }} />}
          </div>
        }
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
    { id: 'orders', label: 'Order List', icon: 'receipt',
      badge: hasOrders ? app.orders.length : null },
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
            {tab.sub && <span style={{ fontSize: 10.5, fontWeight: 700, color: t.muted, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: -1 }}>{tab.sub}</span>}
          </button>);
        })}
      </div>
    </div>);
}

// ── Sticky cart dock ───────────────────────────────────────
function CartDock() {
  const t = useTheme();
  const app = useApp();
  const count = app.cart.reduce((s, l) => s + l.qty, 0);
  const total = app.cartSubtotal();
  const isNavbar = app.menuShell === 'klasik' && app.mode === 'dyn-openbill' && (app.billStripLayout || 'navbar') === 'navbar';
  const bottomOffset = isNavbar ? 'calc(80px + env(safe-area-inset-bottom))' : 'calc(20px + env(safe-area-inset-bottom))';
  if (count === 0) return null;
  // QR Dinamis: meja sudah teridentifikasi dari QR → pesan tanpa login.
  // Login (WhatsApp/OTP) hanya untuk akun member, opsional via footer home.
  const viewCart = () => {
    // Open Bill (QR dinamis): tanpa login — info pelanggan opsional di konfirmasi.
    if (app.mode === 'dyn-openbill' || app.loggedIn) {app.go('cart');return;}
    app.openSheet('login', { next: 'cart' });
  };
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 16px ' + bottomOffset, zIndex: 45, pointerEvents: 'none' }}>
      <button onClick={viewCart} style={{ pointerEvents: 'auto', width: '100%', border: 'none', cursor: 'pointer', background: t.primary, color: t.onPrimary, borderRadius: t.radius, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 30px ' + hexA(t.primary, 0.4), WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <Icon name="cart" size={24} />
          <span style={{ position: 'absolute', top: -7, right: -9, background: t.onPrimary, color: t.primary, fontSize: 11, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15.5 }}>Lihat Keranjang</span>
        <div style={{ flex: 1 }} />
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
  const freePromoId = params.freePromo || (editLine && editLine.free ? editLine.promoId : null);
  const isFree = !!freePromoId;
  const [qty, setQty] = useStateM(editLine ? editLine.qty : 1);
  const [sel, setSel] = useStateM(() => {
    const init = {};
    const matchOpt = (o) => (editLine.options || []).some((s) => s === o.label || s.indexOf(o.label + ' (+') === 0);
    (item.mods || []).forEach((m) => {
      if (m.type === 'single') {
        const found = editLine && m.options.find((o) => matchOpt(o));
        init[m.id] = found ? found.id : undefined;
      } else if (m.type === 'multi') {
        init[m.id] = editLine ? m.options.filter((o) => matchOpt(o)).map((o) => o.id) : [];
      }
    });
    return init;
  });
  const [notes, setNotes] = useStateM(editLine ? editLine.notes || '' : '');

  const modPrice = (item.mods || []).reduce((sum, m) => {
    const v = sel[m.id];
    if (m.type === 'single') {const o = m.options.find((x) => x.id === v);return sum + (o ? o.price : 0);}
    if (m.type === 'multi') {return sum + (v || []).reduce((s, id) => s + (m.options.find((x) => x.id === id)?.price || 0), 0);}
    return sum;
  }, 0);
  const unit = isFree ? 0 : item.price + modPrice;

  // semua grup wajib harus terisi sebelum bisa ditambahkan
  const requiredOk = (item.mods || []).every((m) => {
    if (!m.required) return true;
    return m.type === 'single' ? sel[m.id] != null : (sel[m.id] || []).length > 0;
  });

  const toggleMulti = (mid, oid) => setSel((s) => {
    const cur = s[mid] || [];
    return { ...s, [mid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] };
  });

  const add = () => {
    const contentLabels = (item.contents || []).map((c) => c.qty + '× ' + c.name);
    // sertakan biaya tambahan di label opsi (mis. "Telur Dadar (+Rp7.000)") biar user paham kenapa harganya beda
    const fmt = (o) => !isFree && o.price > 0 ? o.label + ' (+' + rupiah(o.price) + ')' : o.label;
    const optLabels = (item.mods || []).flatMap((m) => {
      if (m.type === 'single') {const o = m.options.find((x) => x.id === sel[m.id]);return o ? [fmt(o)] : [];}
      if (m.type === 'multi') return (sel[m.id] || []).map((id) => fmt(m.options.find((x) => x.id === id)));
      return [];
    });
    if (isFree) {
      app.applyPromo(freePromoId, item.id, { options: optLabels, notes });
      app.back();
      return;
    }
    if (editLine) app.removeLine(editLine.uid);
    app.addToCart({ itemId: item.id, name: item.name, unit, qty, options: [...contentLabels, ...optLabels], notes });
    // Item ini memicu promo gratis (mis. Beli 1 Gratis 1) → wajib isi item gratisnya.
    // Langsung arahkan: kalau ada beberapa varian, pilih dulu lewat sheet; kalau item
    // gratisnya sudah tetap, langsung ke halaman detailnya untuk isi opsi wajib.
    if (!editLine && triggerPromo && triggerPromo.kind === 'free-item' &&
    !app.applied.some((a) => a.id === triggerPromo.id)) {
      app.back();
      if (triggerPromo.needsPick) app.openSheet('freeitem', { promoId: triggerPromo.id });else
      if (triggerPromo.fixedItem) app.go('item', { id: triggerPromo.fixedItem, freePromo: triggerPromo.id });
      return;
    }
    app.back();
  };

  const triggerPromo = PROMOS.find((p) => p.scope === 'item' && p.requireItem === item.id);
  const freeInPromo = PROMOS.find((p) => p.scope === 'item' && (
  p.choices && p.choices.includes(item.id) || p.fixedItem === item.id)
  );
  const freeItemLabel = triggerPromo ?
  triggerPromo.needsPick ?
  triggerPromo.choices.map((id) => itemById(id)?.name).filter(Boolean).join(' atau ') :
  itemById(triggerPromo.fixedItem)?.name :
  null;
  const triggerItemName = freeInPromo ? itemById(freeInPromo.requireItem)?.name : null;
  const promoName = triggerPromo ? triggerPromo.tagline || triggerPromo.title : freeInPromo ? freeInPromo.title : item.oldPrice ? 'Diskon Produk' : null;
  const promoObj = triggerPromo || freeInPromo;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title={isFree ? editLine ? 'Ubah Item Gratis' : 'Item Gratis' : editLine ? 'Ubah Pesanan' : 'Detail Menu'} onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 18px 24px' }}>
      <FoodImg label={item.name.toLowerCase()} h={210} radius={t.radius} src={item.photo} />
      <h2 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 26, color: t.ink, lineHeight: 1.1 }}>{item.name}</h2>
      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.55, margin: '8px 0 4px' }}>{item.desc}</p>
      {item.stock <= 5 && item.stock > 0 && <Pill tone="promo" icon="fire" style={{ marginTop: 6 }}>Stok terbatas · sisa {item.stock}</Pill>}


      {/* Informasi Promo — ketuk untuk lihat detail promo terkait */}
      {!isFree && promoName &&
        <div style={{ marginTop: 20 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: t.ink }}>Informasi Promo</h4>
          <button
            onClick={() => promoObj && app.openSheet('voucher', { id: promoObj.id })}
            disabled={!promoObj}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', fontFamily: t.fontBody,
              background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '13px 14px',
              cursor: promoObj ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: hexA('#E2680E', 0.12), color: '#E2680E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="tag" size={18} color="#E2680E" />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.4, color: t.muted }}>
              Item ini diberlakukan Promo:<br /><b style={{ color: t.ink, fontWeight: 700 }}>{promoName}</b>
            </div>
            {promoObj && <Icon name="chevron" size={16} color={t.faint} />}
          </button>
        </div>
        }

      {(item.mods || []).map((m) => {
          const isSingle = m.type === 'single';
          const chosen = isSingle ? sel[m.id] != null : (sel[m.id] || []).length > 0;
          const sub = m.required ?
          isSingle ? 'Wajib dipilih · maks. 1' : 'Wajib dipilih' :
          isSingle ? 'Opsional · maks. 1' : 'Opsional · bisa lebih dari satu';
          return (
            <div key={m.id} style={{ marginTop: 16, borderTop: '1px solid ' + t.line, paddingTop: 16 }}>
          {/* header grup: judul + subjudul + status centang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.ink }}>{m.label}</h4>
              <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2 }}>{sub}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                  background: chosen ? '#1F8A5B' : 'transparent',
                  border: chosen ? 'none' : '2px solid ' + t.faint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
              {chosen && <Icon name="check" size={11} color="#fff" stroke={3} />}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {m.options.map((o, oi) => {
                  const on = isSingle ? sel[m.id] === o.id : (sel[m.id] || []).includes(o.id);
                  return (
                    <button key={o.id} onClick={() => isSingle ? setSel((s) => ({ ...s, [m.id]: o.id })) : toggleMulti(m.id, o.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 2px', cursor: 'pointer',
                      background: 'transparent', border: 'none', borderTop: oi ? '1px solid ' + t.line : 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 14.5, fontWeight: 600, color: on ? t.ink : t.muted }}>{o.label}</span>
                  {!isFree && o.price > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: t.muted, flexShrink: 0 }}>+{rupiah(o.price)}</span>}
                  <span style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                        border: on ? 'none' : '2px solid ' + t.faint, background: on ? t.primary : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s' }}>
                    {on && <Icon name="check" size={14} color={t.onPrimary} stroke={3} />}
                  </span>
                </button>);
                })}
          </div>
        </div>);
        })}

      <div style={{ marginTop: 22 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: t.ink }}>Catatan untuk dapur</h4>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="cth. tanpa bawang, sambal pisah" rows={2} style={{ width: '100%', boxSizing: 'border-box', resize: 'none', border: '1.5px solid ' + t.line, borderRadius: t.radiusSm, padding: 12, fontFamily: t.fontBody, fontSize: 14, color: t.ink, background: t.surface2, outline: 'none' }} />
      </div>
      </div>
      {/* dock bawah — qty + tambah */}
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px 26px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isFree && <QtyStepper value={qty} onChange={setQty} />}
          <Button full onClick={add} disabled={!requiredOk} style={{ flex: 1 }}>{isFree ? editLine ? 'Simpan Item Gratis' : 'Tambahkan' : editLine ? 'Simpan · ' + rupiah(unit * qty) : 'Tambah · ' + rupiah(unit * qty)}</Button>
        </div>
      </div>
    </div>);

}

// dispatcher — pilih shell menu sesuai tweak (sidebar = default, klasik = scroll lama)
function MenuScreen(props) {
  const app = useApp();
  return app.menuShell === 'klasik' ? <MenuClassicScreen {...props} /> : <MenuSidebarScreen {...props} />;
}

Object.assign(window, { MenuScreen, MenuClassicScreen, BillStrip, PromoToday, MenuCardList, MenuCardGrid, StockNote, SearchScreen, OffersScreen, VouchersScreen, VoucherSheet, ItemScreen, OrderTypeSheet, CartDock, DineToggle });