// screens-cart.jsx — Cart, Promo sheet, Free-item picker. Exported to window.
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// ── PromoLine — penanda promo di tempat hasil promo jatuh ──
// Figma: promo-line (ikon tag 12 + nama promo teal 12). Tap → Detail Promo.
function PromoLine({ promo }) {
  const t = useTheme();
  const app = useApp();
  if (!promo) return null;
  return (
    <button onClick={(e) => {e.stopPropagation();app.openSheet('voucher', { id: promo.id });}} style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%', minWidth: 0, padding: 0, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
      <Icon name="tag" size={12} color={t.primary} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 1.42, color: t.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{promo.title}</span>
    </button>);
}

// modifier per baris (teks polos 12 muted) + catatan dapur (ikon edit + italic)
function LineOptions({ options }) {
  const t = useTheme();
  if (!options || !options.length) return null;
  return <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.25 }}>{options.map((o, i) => <div key={i}>{o}</div>)}</div>;
}
function LineNote({ notes }) {
  const t = useTheme();
  if (!notes) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
      <Icon name="edit" size={12} color={t.faint} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, fontStyle: 'italic', color: t.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notes}</span>
    </div>);
}
// badge qty bulat 24 primary — sama untuk item berbayar & item gratis
function QtyBadge({ qty, top }) {
  const t = useTheme();
  return <div style={{ position: 'absolute', right: 0, top, width: 24, height: 24, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5 }}>{qty}</div>;
}

// ── LineRow — baris item keranjang ─────────────────────────
// Figma: LineRow (Tanpa Promo / PromoProduk). Promo Produk (beli-N, item gratis yang
// ditambah tamu sendiri) → penanda promo + harga asal dicoret + harga akhir.
// SPA → harga normal dicoret + harga SPA, tanpa penanda promo.
function LineRow({ line, editable, noSep }) {
  const t = useTheme();
  const app = useApp();
  const price = app.linePrice(line);
  const openEdit = () => {
    if (!editable) return;
    app.openSheet('itemPicker', { id: line.itemId });
  };
  return (
    <div onClick={openEdit} style={{ position: 'relative', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: noSep ? 'none' : '1px solid ' + t.line, cursor: editable ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}>
      <FoodImg label={line.name.toLowerCase()} h={60} radius={t.radiusSm} style={{ width: 60, flexShrink: 0 }} src={itemById(line.itemId)?.photo} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 32 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.3, overflowWrap: 'anywhere' }}>{line.name}</h4>
        <PromoLine promo={price.promo} />
        {isPaketLine(line) ? <PaketDetail line={line} /> : <LineOptions options={line.options} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {price.orig !== price.final && <Money value={price.orig} strike style={{ fontSize: 12, fontWeight: 600, color: t.faint }} />}
          <Money value={price.final} style={{ fontSize: 14, fontWeight: 700, color: t.ink }} />
        </div>
        <LineNote notes={line.notes} />
      </div>
      {editable ?
      <QtyBadge qty={line.qty} top={14} /> :
      <span style={{ position: 'absolute', right: 0, top: 14, fontSize: 12, color: t.muted, fontWeight: 600 }}>×{line.qty}</span>}
    </div>);

}

// ── OrderTypeSelect ────────────────────────────────────────
function OrderTypeSelect() {
  const t = useTheme();
  const app = useApp();
  const opts = [
  { id: 'dinein', label: 'Dine In', icon: 'dineIn', sub: 'Disajikan ke meja' },
  { id: 'takeaway', label: 'Take Away', icon: 'takeaway', sub: 'Dikemas untuk dibawa' }];

  return (
    <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {opts.map((o) => {
        const on = app.orderType === o.id;
        return (
          <button key={o.id} onClick={() => app.setOrderType(o.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
            cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
            background: on ? t.primarySoft : t.surface,
            border: '1.5px solid ' + (on ? t.primary : t.line),
            borderRadius: t.radius, padding: '12px 14px',
            boxShadow: on ? 'none' : t.shadow, transition: 'all .15s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10,
                background: on ? t.primary : t.surface2, color: on ? t.onPrimary : t.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={o.icon} size={18} />
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 999,
                border: '2px solid ' + (on ? t.primary : t.faint),
                background: on ? t.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <Icon name="check" size={11} color={t.onPrimary} stroke={3} />}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }}>{o.label}</div>
              <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>{o.sub}</div>
            </div>
          </button>);

      })}
    </div>);

}

// ── CartScreen ─────────────────────────────────────────────
// Rekomendasi best-seller untuk upsell di keranjang
function UpsellRail() {
  const t = useTheme();
  const app = useApp();
  const inCart = new Set(app.cart.map((l) => l.itemId));
  const avail = (m) => !inCart.has(m.id);
  const isBest = (m) => m.cat === 'signature' || m.tag === 'Terlaris' || m.tag === 'Favorit';
  // mulai dari best-seller; kalau menipis, isi dengan pelengkap (minuman/pembuka) lalu item lain
  const order = (m) => isBest(m) ? 0 : m.cat === 'minuman' || m.cat === 'pembuka' ? 1 : 2;
  const recs = MENU.
  filter(avail).
  sort((a, b) => order(a) - order(b)).
  slice(0, 5);
  if (recs.length === 0) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: t.ink, fontSize: 16 }}>Lengkapi pesananmu</span>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', flexDirection: "row", alignItems: "stretch", gap: "12px", margin: "0 -18px 0 0", padding: "2px 18px 4px 0" }}>
        {recs.map((m) =>
        <div key={m.id} onClick={() => app.openItem(m.id)} style={{
          scrollSnapAlign: 'start', flexShrink: 0, width: 132, cursor: 'pointer',
          background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radiusSm,
          overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ position: 'relative', width: '100%', height: 88, background: t.placeholder }}>
              <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
              position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, borderRadius: 999,
              background: t.surface, color: t.primary, boxShadow: t.shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus" size={16} stroke={2.6} />
              </div>
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink, lineHeight: 1.3, height: 32, overflow: 'hidden' }}>{m.name}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{rupiah(m.price)}</div>
            </div>
          </div>
        )}
      </div>
    </div>);
}

function CartScreen() {
  const t = useTheme();
  const app = useApp();
  const [checking, setChecking] = useStateC(false);
  const lines = app.cart;
  const bill = app.computeBill();
  // Diskon Transaksi otomatis (maks. 1) — namanya tampil di bawah baris "Promo Transaksi"
  const txPromo = app.applied.map((a) => promoById(a.id)).find((p) => p && isVoucher(p));

  const isOpenBill = app.mode === 'dyn-openbill';
  const runCheck = () => {
    if (isOpenBill) {
      app.askConfirm({
        title: 'Kirim pesanan ke dapur?',
        message: 'Promo barang hanya berlaku untuk transaksi ini dan tidak bisa digabung lagi dengan transaksi berikutnya.',
        confirmLabel: 'Iya',
        onConfirm: () => app.submitOrder(),
      });
      return;
    }
    setChecking(true);
    setTimeout(() => {setChecking(false);app.go('confirm');}, 1400);
  };

  if (lines.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
        <TopBar title="Keranjang" onBack={app.back} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '30px 34px' }}>
          <EmptyState slotId="empty-cart" src="assets/empty-cart.png" title="Keranjangmu masih kosong" desc="Yuk kembali ke menu dan pilih hidangan favoritmu untuk mulai memesan." />
        </div>
      </div>);

  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Keranjang" onBack={app.back} />

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 18px 28px' }}>

        {/* 1 · Items */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: t.ink, fontSize: "16px" }}>Pesanan Kamu</span>
          <button onClick={() => app.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontWeight: 600, fontFamily: t.fontBody, padding: 0, WebkitTapHighlightColor: 'transparent', fontSize: "14px" }}>
            <Icon name="plus" size={15} stroke={2.6} /> Tambah Barang
          </button>
        </div>
        {(() => {
          // barang hadiah promo = baris biasa yang ditambah tamu sendiri (tidak menempel ke pemicunya)
          const card = (list) =>
          <div style={{ background: t.surface, borderRadius: t.radius, padding: '0 16px', border: '1px solid ' + t.line, boxShadow: t.shadow }}>
              {list.map((l, i) => <LineRow key={l.uid} line={l} editable noSep={i === list.length - 1} />)}
            </div>;

          const header = (type, n) =>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 2px 9px' }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: t.ink }}>{type === 'takeaway' ? 'Take Away' : 'Dine In'}</span>
              <span style={{ fontSize: 12, color: t.faint, fontWeight: 600 }}>&middot; {n} item</span>
            </div>;

          const di = lines.filter((l) => l.type !== 'takeaway');
          const ta = lines.filter((l) => l.type === 'takeaway');
          if (di.length && ta.length) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>{header('dinein', di.length)}{card(di)}</div>
                <div>{header('takeaway', ta.length)}{card(ta)}</div>
              </div>);

          }
          return card(lines);
        })()}

        {/* Catatan untuk pesanan — field ringkas satu baris */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: t.ink, fontSize: 16 }}>Catatan pesanan</span>
            <span style={{ fontSize: 12, color: t.faint, fontWeight: 600 }}>Opsional</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid ' + t.line, borderRadius: t.radiusSm,
            padding: '0 12px', background: t.surface2, height: 44 }}>
            <Icon name="edit" size={17} color={t.faint} style={{ flexShrink: 0 }} />
            <input
              value={app.orderNote}
              onChange={(e) => app.setOrderNote(e.target.value)}
              placeholder="cth. minta sendok lebih…"
              style={{
                flex: 1, minWidth: 0, border: 'none', background: 'transparent',
                fontFamily: t.fontBody, fontSize: 13.5, color: t.ink, outline: 'none' }} />
          </div>
        </div>

        {/* Promo otomatis (MVP): tidak ada CTA "Voucher & diskon" — Promo Produk ditandai
            di baris item, Diskon Transaksi di baris ringkasan. Figma: Case Diskon Transaksi Otomatis. */}

        {/* 3 · Ringkasan harga — promo sudah otomatis diterapkan */}
        <div style={{ marginTop: 16, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
          {isOpenBill ?
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Subtotal pesanan</span>
              <Money value={Math.max(0, bill.paidSubtotal - bill.itemDisc)} style={{ fontWeight: 800, fontSize: 20, color: t.ink }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, paddingTop: 10, borderTop: '1px solid ' + t.line, color: t.muted }}>
              <Icon name="info" size={14} color={t.faint} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, lineHeight: 1.4 }}>Pajak &amp; total dihitung sekali saat Bayar Semua.</span>
            </div>
          </> :
          <>
          {/* Subtotal sudah setelah Promo Produk — tidak ada baris diskon produk terpisah */}
          <Row label="Subtotal" value={rupiah(bill.subtotal)} />
          {bill.discount > 0 && <Row label="Promo Transaksi" value={'−' + rupiah(bill.discount)} accent />}
          {bill.discount > 0 && <PromoLine promo={txPromo} />}
          {bill.service > 0 && <Row label={'Service ' + Math.round(bill.serviceRate * 100) + '%'} value={rupiah(bill.service)} />}
          <Row label={'Pajak' + (bill.taxInclusive ? ' · termasuk' : '')} value={rupiah(bill.tax)} />
          {bill.rounding !== 0 && <Row label="Pembulatan" value={(bill.rounding > 0 ? '' : '−') + rupiah(Math.abs(bill.rounding))} />}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Total</span>
            <Money value={bill.total} style={{ fontWeight: 800, fontSize: 22, color: t.ink }} />
          </div>
          </>}
        </div>

        {/* CTA — di bawah konten, user scroll dulu */}
      </div>

      {/* sticky bottom bar — konsisten dengan layar lain (Konfirmasi, Bayar, dll) */}
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))' }}>
        <Button full onClick={runCheck}>{'Konfirmasi Pesanan'}</Button>
      </div>

      {checking && <CheckingOverlay />}
    </div>);

}

// ── Row ────────────────────────────────────────────────────
function Row({ label, value, accent }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: 14, color: t.muted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: accent ? t.primary : t.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>);

}

// ── CheckingOverlay ────────────────────────────────────────
function CheckingOverlay() {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90, background: hexA(t.bg, 0.86), backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 999, border: '4px solid ' + t.primarySoft, borderTopColor: t.primary, animation: 'om-spin .8s linear infinite' }} />
    </div>);

}

// ── Promo helpers ──────────────────────────────────────────
function promoIsLocked(app, p) {
  return p.activation === 'locked' && !(app.unlocked || []).includes(p.id);
}
function startClaim(app, p) {
  if (p.kind === 'free-item' && p.needsPick) {openFreeItemPick(app, p);return;}
  app.applyPromo(p.id);
}

// ── PromoTag — penanda tipe (mis. Voucher) ─────────────────
function PromoTag({ icon, label }) {
  const t = useTheme();
  return (
    <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, background: t.primary, color: t.onPrimary, borderRadius: 999, padding: '3px 9px', fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3 }}>
      <Icon name={icon} size={11} color={t.onPrimary} /> {label}
    </span>);
}

// ── PromoBigCard — kartu promo lengkap (hub) ───────────────
// NB: tidak ada pengecekan syarat (min. belanja dll). Semua dicek di Konfirmasi.
function PromoBigCard({ p, claim }) {
  const t = useTheme();
  const app = useApp();
  const locked = promoIsLocked(app, p);
  const on = app.applied.some((a) => a.id === p.id);
  const r = promoReward(p);
  const conds = promoConds(p);
  const anotherTxOn = p.scope === 'transaction' && !on && app.applied.some((a) => {const q = promoById(a.id);return q && q.scope === 'transaction';});
  // syarat min. belanja — promo terkunci sampai keranjang memenuhi minimum
  const sub = app.cartSubtotal();
  const belowMin = !!(p.min && sub < p.min && !on);
  const shortfall = belowMin ? p.min - sub : 0;
  const disabled = locked || anotherTxOn;
  const claimBtn = belowMin ?
  <Button size="sm" disabled onClick={() => {}}>Kurang {rupiah(shortfall)}</Button> :
  <Button size="sm" onClick={() => startClaim(app, p)}>{p.kind === 'free-item' && p.needsPick ? 'Pilih & Pakai' : anotherTxOn ? 'Ganti' : 'Pakai Promo'}</Button>;
  const chipBg = on ? t.primary : disabled ? t.surface2 : t.primarySoft;
  const chipColor = on ? t.onPrimary : disabled ? t.faint : t.primary;
  const style = app.voucherStyle || 'kupon';
  const openDetail = () => !claim && app.openSheet('voucher', { id: p.id });

  // ── Style A: Tiket sobek ──
  if (style === 'tiket') {
    return (
      <div onClick={openDetail} style={{ position: 'relative', display: 'flex', marginBottom: 12, cursor: claim ? 'default' : 'pointer', opacity: disabled && !on ? 0.5 : 1, WebkitTapHighlightColor: 'transparent' }}>
        {/* kiri — chip diskon */}
        <div style={{ flexShrink: 0, width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 6px', background: on ? t.primary : disabled ? t.surface2 : t.primary, borderRadius: t.radius + 'px 0 0 ' + t.radius + 'px', gap: 2 }}>
          {r.free ?
          <Icon name="gift" size={24} color={on ? t.onPrimary : disabled ? t.faint : t.onPrimary} /> :
          <span style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: r.value.length > 4 ? 14 : 20, lineHeight: 1, color: on ? t.onPrimary : disabled ? t.faint : t.onPrimary }}>{r.value}</span>}
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase', color: on ? hexA('#fff', 0.8) : disabled ? t.faint : hexA('#fff', 0.8) }}>Off</span>
        </div>
        {/* notch kiri */}
        <div style={{ position: 'absolute', left: 60, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: 999, background: t.bg, zIndex: 2, boxShadow: 'inset 0 0 0 1px ' + t.line }} />
        {/* kanan — detail */}
        <div style={{ flex: 1, padding: '12px 14px', background: on ? t.primarySoft : disabled ? t.surface2 : t.surface, border: '1px solid ' + (on ? t.primary : t.line), borderLeft: 'none', borderRadius: '0 ' + t.radius + 'px ' + t.radius + 'px 0', borderLeftStyle: 'dashed' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: disabled ? t.muted : t.ink, lineHeight: 1.2, flex: 1 }}>{p.title}</h4>
            {on && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 800, color: t.primary, background: hexA(t.primary, 0.15), borderRadius: 999, padding: '2px 7px', whiteSpace: 'nowrap' }}>Dipakai</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 5 }}>
            {conds.map((c, i) => <span key={i} style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>{c}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px dashed ' + t.line }}>
            {!claim ? <span style={{ fontSize: 11, color: t.faint }}>{on ? 'Sudah dipilih' : 'Tersedia'}</span> :
            on ? <><span style={{ fontSize: 11.5, fontWeight: 700, color: t.primary, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="checkCircle" size={13} />Dipakai</span><Button size="sm" variant="ghost" onClick={() => app.removePromo(p.id)}>Lepas</Button></> :
            locked ? <><span style={{ fontSize: 11.5, color: t.faint, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="lock" size={12} />Terkunci</span><Button size="sm" icon="instagram" onClick={() => app.openSheet('voucher', { id: p.id, claim: true })}>Follow dulu</Button></> :
            <>{claimBtn}</>}
          </div>
        </div>
      </div>);
  }

  // ── Style B: Minimalis — accent bar kiri, angka diskon besar ──
  if (style === 'minimal') {
    return (
      <div onClick={openDetail} style={{ position: 'relative', display: 'flex', alignItems: 'stretch', marginBottom: 10, borderRadius: t.radiusSm, overflow: 'hidden', background: on ? t.primarySoft : disabled ? t.surface2 : t.surface, border: '1px solid ' + (on ? t.primary : t.line), cursor: claim ? 'default' : 'pointer', opacity: disabled && !on ? 0.5 : 1, WebkitTapHighlightColor: 'transparent' }}>
        {/* accent bar */}
        <div style={{ width: 4, flexShrink: 0, background: on ? t.primary : disabled ? t.faint : t.primary, opacity: disabled ? 0.4 : 1 }} />
        {/* angka besar */}
        <div style={{ flexShrink: 0, width: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 4px', borderRight: '1px solid ' + t.line }}>
          {r.free ?
          <Icon name="gift" size={22} color={disabled ? t.faint : t.primary} /> :
          <span style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: r.value.length > 4 ? 13 : 19, lineHeight: 1, color: disabled ? t.faint : t.primary }}>{r.value}</span>}
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: disabled ? t.faint : t.primary, marginTop: 2 }}>{r.free ? 'Gratis' : 'Off'}</span>
        </div>
        {/* detail */}
        <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: disabled ? t.muted : t.ink, flex: 1 }}>{p.title}</span>
            {on && <span style={{ fontSize: 10, fontWeight: 800, color: t.primary, background: hexA(t.primary, 0.12), borderRadius: 999, padding: '2px 7px', flexShrink: 0 }}>Dipakai</span>}
          </div>
          {conds.map((c, i) => <span key={i} style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>{c}</span>)}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 6, paddingTop: 6, borderTop: '1px solid ' + t.line }}>
            {!claim ? <span style={{ fontSize: 11, color: t.faint, flex: 1 }}>{on ? 'Sudah dipilih' : 'Tersedia'}</span> :
            on ? <><span style={{ fontSize: 11.5, fontWeight: 700, color: t.primary, flex: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="checkCircle" size={13} />Dipakai</span><Button size="sm" variant="ghost" onClick={() => app.removePromo(p.id)}>Lepas</Button></> :
            locked ? <><span style={{ fontSize: 11.5, color: t.faint, flex: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="lock" size={12} />Terkunci</span><Button size="sm" icon="instagram" onClick={() => app.openSheet('voucher', { id: p.id, claim: true })}>Follow dulu</Button></> :
            { claimBtn }}
          </div>
        </div>
      </div>);
  }

  // ── Default: Kupon / Kartu ──
  return (
    <div onClick={() => !claim && app.openSheet('voucher', { id: p.id })} style={{ border: '1px solid ' + (on ? t.primary : t.line), borderRadius: t.radius, padding: 14, background: on ? t.primarySoft : disabled ? t.surface2 : t.surface, marginBottom: 12, cursor: claim ? 'default' : 'pointer', WebkitTapHighlightColor: 'transparent', opacity: disabled && !on ? 0.55 : 1, transition: 'opacity .15s' }}>
      <div style={{ display: 'flex', gap: 13 }}>
        {/* reward chip */}
        <div style={{ flexShrink: 0, width: 60, minHeight: 60, borderRadius: 12, background: chipBg, border: on ? 'none' : '1.5px solid ' + hexA(chipColor, 0.2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 4px', gap: 1 }}>
          {r.free ?
          <Icon name="gift" size={26} color={chipColor} /> :
          <span style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: r.value.length > 4 ? 15 : 22, lineHeight: 1, color: chipColor }}>{r.value}</span>}
          <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: chipColor, opacity: 0.85, marginTop: 1 }}>{r.free ? 'Gratis' : 'Off'}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: disabled ? t.muted : t.ink, lineHeight: 1.2, flex: 1 }}>{p.title}</h4>
            {on && <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: t.primary, background: hexA(t.primary, 0.15), borderRadius: 999, padding: '3px 8px', whiteSpace: 'nowrap' }}>Dipakai</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
            {conds.map((c, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ flexShrink: 0, width: 4, height: 4, borderRadius: 999, background: t.faint, marginTop: 6 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: t.muted, lineHeight: 1.45 }}>{c}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px dashed ' + t.line }}>
            {!claim ?
            <span style={{ fontSize: 11.5, color: t.faint }}>{locked ? 'Follow IG untuk buka' : on ? 'Sudah dipilih' : 'Tersedia'}</span> :
            locked ?
            <>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.faint, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="lock" size={13} /> Terkunci</span>
                <Button size="sm" icon="instagram" onClick={() => app.openSheet('voucher', { id: p.id, claim: true })}>Follow dulu</Button>
              </> :
            on ?
            <>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.primary, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="checkCircle" size={14} /> Dipakai</span>
                <Button size="sm" variant="ghost" onClick={() => app.removePromo(p.id)}>Lepas</Button>
              </> :
            <>
                {claimBtn}
              </>}
          </div>
        </div>
      </div>
    </div>);
}

// ── PromoRailCard — kartu ringkas untuk rail di home ───────
function PromoRailCard({ p }) {
  const t = useTheme();
  const app = useApp();
  const on = app.applied.some((a) => a.id === p.id);
  const r = promoReward(p);
  const conds = promoConds(p);
  return (
    <div onClick={() => app.openSheet('voucher', { id: p.id })} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 232, display: 'flex', gap: 11, background: on ? t.primarySoft : t.surface, border: '1px solid ' + (on ? t.primary : t.line), borderRadius: t.radius, boxShadow: t.shadow, padding: 12, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
      {/* reward chip — format ditentukan jenis hasil */}
      <div style={{ flexShrink: 0, width: 50, alignSelf: 'stretch', borderRadius: 10, background: t.primary, color: t.onPrimary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px 2px' }}>
        {r.free ?
        <Icon name="gift" size={22} color={t.onPrimary} /> :
        <span style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: r.value.length > 4 ? 13 : 20, lineHeight: 1 }}>{r.value}</span>}
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.9, marginTop: 1 }}>{r.free ? 'Gratis' : 'Off'}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: t.ink, lineHeight: 1.15, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h4>
          {p.voucher && <Icon name="tag" size={12} color={t.primary} style={{ flexShrink: 0 }} />}
        </div>
        <div style={{ marginTop: 5 }}>
          {conds.map((c, i) =>
          <div key={i} style={{ fontSize: 10.5, fontWeight: 500, color: t.muted, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</div>
          )}
        </div>
      </div>
    </div>);

}

// ── PromoClaimRow — baris voucher datar (mode klaim di keranjang) ──
// Tanpa chip warna besar: seal gelap + judul + min. belanja + tombol Pakai.
// ── VoucherPickCard — kartu voucher terpadu (dipakai QR Statis & QR Dinamis) ──
// Tap chip/badan → buka detail voucher · tombol Pakai → terapkan langsung.
function VoucherPickCard({ p, selected, eligible = true, shortfall = 0, locked = false, actionLabel = 'Pakai', onDetail, onApply, onFollow }) {
  const t = useTheme();
  const conds = promoConds(p);
  const dim = !eligible && !selected;
  const chipBg = selected ? t.primary : t.primarySoft;
  const chipColor = selected ? t.onPrimary : t.primary;

  const action = locked ?
  <button onClick={onFollow} style={{ flexShrink: 0, height: 32, padding: '0 12px', borderRadius: 999, border: '1.5px solid ' + t.lineStrong, background: t.surface, color: t.ink, fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <Icon name="instagram" size={13} color={t.ink} />Follow
    </button> :
  selected ?
  <button onClick={onApply} style={{ flexShrink: 0, height: 32, padding: '0 13px', borderRadius: 999, border: '1.5px solid ' + t.primary, background: t.primarySoft, color: t.primary, fontFamily: t.fontBody, fontSize: 12, fontWeight: 800, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <Icon name="check" size={13} color={t.primary} stroke={2.4} />Dipakai
    </button> :
  <button onClick={onApply} disabled={!eligible} style={{ flexShrink: 0, height: 32, padding: '0 16px', borderRadius: 999, border: 'none', background: eligible ? t.primary : t.surface2, color: eligible ? t.onPrimary : t.faint, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 800, cursor: eligible ? 'pointer' : 'not-allowed', boxShadow: eligible ? '0 4px 12px ' + hexA(t.primary, 0.3) : 'none', WebkitTapHighlightColor: 'transparent' }}>
      {actionLabel}
    </button>;

  return (
    <div style={{ width: '100%', display: 'flex', gap: 13, alignItems: 'center', border: '1px solid ' + (selected ? t.primary : t.line), borderRadius: t.radius, padding: 14, background: selected ? t.primarySoft : t.surface, boxShadow: t.shadow, opacity: dim ? 0.6 : 1 }}>
      {/* chip — tap → detail */}
      <button onClick={onDetail} style={{ flexShrink: 0, width: 60, alignSelf: 'stretch', minHeight: 60, border: selected ? 'none' : '1.5px solid ' + hexA(chipColor, 0.2), borderRadius: 12, background: chipBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 4px', gap: 3, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        <Icon name="tag" size={22} color={chipColor} />
        <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: chipColor, opacity: 0.85 }}>Voucher</span>
      </button>
      {/* badan — tap → detail */}
      <button onClick={onDetail} style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <h4 style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 15, fontWeight: 800, color: t.ink, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5 }}>
          {conds.map((c, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ flexShrink: 0, width: 4, height: 4, borderRadius: 999, background: t.faint, marginTop: 6 }}></span>
            <span style={{ fontSize: 12, fontWeight: 500, color: t.muted, lineHeight: 1.45 }}>{c}</span>
          </div>
          )}
        </div>
      </button>
      {action}
    </div>);
}

// ── PromoClaimRow — kartu voucher (mode klaim di keranjang, QR Statis) ──
function PromoClaimRow({ p, best }) {
  const app = useApp();
  const locked = promoIsLocked(app, p);
  const on = app.applied.some((a) => a.id === p.id);
  const anotherTxOn = !on && app.applied.some((a) => {const q = promoById(a.id);return q && q.scope === 'transaction';});
  const sub = app.cartSubtotal();
  const belowMin = !!(p.min && sub < p.min && !on);
  const shortfall = belowMin ? p.min - sub : 0;
  return (
    <VoucherPickCard
      p={p}
      selected={on}
      eligible={!belowMin}
      shortfall={shortfall}
      locked={locked}
      actionLabel={anotherTxOn ? 'Ganti' : 'Pakai'}
      onDetail={() => app.openSheet('voucher', { id: p.id })}
      onFollow={() => app.openSheet('voucher', { id: p.id, claim: true })}
      onApply={() => {if (on) {app.removePromo(p.id);return;}if (belowMin) return;startClaim(app, p);}}
    />);
}

// ── EmptyVouchers — empty state voucher (ilustrasi + ajakan) ─
function EmptyVouchers() {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 30px' }}>
      <EmptyState slotId="empty-vouchers" size={190} title="Voucher segera hadir" desc="Belum ada voucher aktif saat ini. Pantau terus ya—promo menarik lagi kami siapkan untukmu!" />
    </div>);
}

// ── PromoCatalogCard — baris katalog "Promo Hari Ini" (lihat saja) ──
// Figma: PromoCard di "Promo Hari Ini — Katalog (PAGE-04V)". Chip PROMO + nama 1 baris
// (ellipsis) + kalimat template promoSummary + chevron. Tap → Detail Voucher/Promo.
function PromoCatalogCard({ p, onOpen }) {
  const t = useTheme();
  return (
    <button onClick={onOpen} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
      <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 12, background: t.primarySoft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        <Icon name="tag" size={22} color={t.primary} />
        <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.primary }}>Promo</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
        <div style={{ fontSize: 12, color: t.muted }}>{promoSummary(p)}</div>
      </div>
      <Icon name="chevron" size={20} color={t.primary} style={{ flexShrink: 0 }} />
    </button>);
}

// ── PromoScreen — katalog "Promo Hari Ini" (Figma PAGE-04V) ──
// SEMUA promo — voucher transaksi + promo barang — hanya untuk dilihat; promo dipasang
// otomatis di keranjang. Halaman pilih voucher dari keranjang (PAGE-06V) sudah gugur.
function PromoScreen() {
  const t = useTheme();
  const app = useApp();
  const list = PROMOS;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Promo Hari Ini" onBack={app.back} />

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '14px 16px 130px' }}>
        {/* banner — voucher dipakai saat checkout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: t.primarySoft, borderRadius: t.radius, padding: '15px 16px', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 18, color: t.ink, lineHeight: 1.2 }}>Lihat sekarang, pakai nanti</div>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: t.muted, lineHeight: 1.5 }}>Pakai voucher ini saat checkout dan nikmati lebih banyak hemat!</p>
          </div>
          <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="megaphone" size={28} color={t.primary} stroke={1.8} />
          </div>
        </div>
        {list.length ?
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{list.map((p) =>
          <PromoCatalogCard key={p.id} p={p} onOpen={() => app.openSheet('voucher', { id: p.id })} />)}</div> :
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EmptyVouchers /></div>}
      </div>
    </div>);

}

// ── FreeItemSheet ──────────────────────────────────────────
function FreeItemSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const promo = promoById(params.promoId);
  const [pick, setPick] = useStateC(promo.choices[0]);
  const choices = promo.choices.map(itemById);

  return (
    <Sheet title="Pilih Item Gratis" onClose={app.closeSheet} footer={
    <Button full onClick={() => {app.closeSheet();app.go('item', { id: pick, freePromo: promo.id });}}>Pilih Varian</Button>
    }>
      <div style={{ display: 'flex', gap: 10, padding: '0 0 14px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: t.ink }}>{promo.title}</div>
          <div style={{ fontSize: 12.5, color: t.muted }}>{promo.sub}. Pilih salah satu varian:</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {choices.map((c) => {
          const on = pick === c.id;
          return (
            <button key={c.id} onClick={() => setPick(c.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 10,
              cursor: 'pointer',
              background: on ? t.primarySoft : t.surface2,
              border: '1.5px solid ' + (on ? t.primary : t.line),
              borderRadius: t.radius
            }}>
              <FoodImg label={c.name.toLowerCase()} h={56} radius={10} style={{ width: 56 }} src={c.photo} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: t.ink }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: t.muted }}>
                  <Money value={c.price} strike />
                  <Money value={0} style={{ fontWeight: 700, color: t.primary, marginLeft: 4 }} />
                </div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                border: '2px solid ' + (on ? t.primary : t.faint),
                background: on ? t.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {on && <Icon name="check" size={13} color={t.onPrimary} stroke={3} />}
                  </div>
            </button>);

        })}
      </div>
    </Sheet>);

}

Object.assign(window, { CartScreen, PromoScreen, PromoBigCard, PromoRailCard, PromoTag, FreeItemSheet, VoucherPickCard, PromoClaimRow, Row });