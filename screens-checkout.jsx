// screens-checkout.jsx — Confirm (locked), Payment picker, Processing, Open Bill, Settle, Success.
const { useState: useStateK, useEffect: useEffectK } = React;

// Masa berlaku kode QRIS: 10 menit. Untuk QA bisa dipersingkat lewat URL, mis. ?qrisDetik=10
const QRIS_SECONDS = Number(new URLSearchParams(window.location.search).get('qrisDetik')) || 600;

function ReadLine({ line }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid ' + t.line, alignItems: 'flex-start' }}>
      <div style={{ minWidth: 26, height: 26, borderRadius: 8, background: t.surface2, color: t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5, marginTop: 1 }}>{line.qty}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontWeight: 650, fontSize: 14, color: t.ink, flex: 1 }}>{line.name}</span>
          {line.free ? <Money value={0} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }} /> : <Money value={line.unit * line.qty} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }} />}
        </div>
        {line.options && line.options.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>{line.options.map((o, i) => <span key={i}>{o}</span>)}</div>}
        {line.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{line.notes}"</div>}
      </div>
    </div>);

}

function PaymentPicker({ value, onChange }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {PAYMENTS.map((p) => {
        const on = value === p.id;
        return (
            // Figma PaymentOption: terpilih = bg primarySoft + border primary, kotak ikon primary + ikon putih
            <button key={p.id} onClick={() => onChange(p.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, height: 62, boxSizing: 'border-box', padding: '12px 14px', cursor: 'pointer',
              background: on ? t.primarySoft : t.surface, border: '1.5px solid ' + (on ? t.primary : t.line),
              borderRadius: t.radiusSm, WebkitTapHighlightColor: 'transparent', transition: 'background-color .15s, border-color .15s'
            }}>
              <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 9, background: on ? t.primary : t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color .15s' }}>
                <Icon name={p.kind === 'qr' ? 'qr' : 'store'} size={20} color={on ? t.onPrimary : t.primary} />
              </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14.5, color: t.ink }}>{p.label}</span>
              </div>
              <div style={{ fontSize: 12, color: t.muted }}>{p.sub}</div>
            </div>
            <div style={{ width: 20, height: 20, flexShrink: 0, boxSizing: 'border-box', borderRadius: 999, border: '2px solid ' + (on ? t.primary : t.faint), background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {on && <Icon name="check" size={12} color={t.onPrimary} stroke={3} />}
            </div>
          </button>);

      })}
    </div>);

}

// ── Recipient info card (inline phone + OTP) ─────────────
function RecipientCard() {
  const t = useTheme();
  const app = useApp();
  const [name, setName] = useStateK('');
  const [phone, setPhone] = useStateK(app.phone || '');
  const [otpSent, setOtpSent] = useStateK(false);
  const [otp, setOtp] = useStateK('');
  const [verified, setVerified] = useStateK(!!app.phone);
  const [sending, setSending] = useStateK(false);

  const validPhone = phone.replace(/\D/g, '').length >= 8;

  const sendOtp = () => {
    if (!validPhone) return;
    setSending(true);
    setTimeout(() => {setSending(false);setOtpSent(true);}, 900);
  };

  const verifyOtp = () => {
    // prototype: any 4+ digit code works
    if (otp.length < 4) return;
    const raw = phone.replace(/\D/g, '');
    app.setPhone(raw);
    setVerified(true);
  };

  if (verified) {
    return (
      <div style={{ marginTop: 16, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>Informasi Penerima</div>
            {name && <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{name}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
              <Icon name="phone" size={13} color={t.primary} />
              <span style={{ fontSize: 13, color: t.ink }}>+62 {app.phoneHint}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(23,153,165,0.1)', borderRadius: 999, padding: '4px 10px' }}>
            <Icon name="check" size={13} color={t.primary} stroke={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.primary }}>Terverifikasi</span>
          </div>
        </div>
        <button onClick={() => {setVerified(false);setOtpSent(false);setOtp('');app.setPhone('');}}
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.faint, fontSize: 12, marginTop: 8, padding: 0 }}>Ganti nomor</button>
      </div>);

  }

  return (
    <div style={{ marginTop: 16, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px', boxShadow: t.shadow }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: t.ink, marginBottom: 12 }}>Informasi Penerima</div>

      {/* name */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 5 }}>Nama <span style={{ fontWeight: 400, color: t.faint }}>(opsional)</span></label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Budi Santoso"
        style={{ width: '100%', border: '1.5px solid ' + (name ? t.primary : t.line), borderRadius: t.radiusSm, padding: '10px 12px', fontFamily: t.fontBody, fontSize: 14, color: t.ink, background: t.surface2, transition: 'border-color .15s' }} />
      </div>

      {/* phone */}
      <div style={{ marginBottom: otpSent ? 10 : 0 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 5 }}>Nomor WhatsApp</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid ' + t.line, borderRadius: t.radiusSm, padding: '0 10px', background: t.surface2, flexShrink: 0 }}>
            <span style={{ fontSize: 14, color: t.muted, fontWeight: 600 }}>+62</span>
          </div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="8xx xxxx xxxx" type="tel" disabled={otpSent}
          style={{ flex: 1, border: '1.5px solid ' + (validPhone ? t.primary : t.line), borderRadius: t.radiusSm, padding: '10px 12px', fontFamily: t.fontBody, fontSize: 14, color: t.ink, background: otpSent ? t.surface2 : t.surface, transition: 'border-color .15s' }} />
          {!otpSent &&
          <button onClick={sendOtp} disabled={!validPhone || sending}
          style={{ flexShrink: 0, padding: '0 14px', borderRadius: t.radiusSm, border: 'none', cursor: validPhone ? 'pointer' : 'default', background: validPhone ? t.primary : t.surface2, color: validPhone ? t.onPrimary : t.faint, fontWeight: 700, fontSize: 13, fontFamily: t.fontBody, height: 44, transition: 'background .15s' }}>
              {sending ? '...' : 'Kirim OTP'}
            </button>
          }
        </div>
      </div>

      {/* OTP */}
      {otpSent &&
      <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 5 }}>Kode OTP <span style={{ fontWeight: 400, color: t.faint }}>dikirim ke WhatsApp</span></label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="_ _ _ _" maxLength={6} type="tel"
          style={{ flex: 1, border: '1.5px solid ' + (otp.length >= 4 ? t.primary : t.line), borderRadius: t.radiusSm, padding: '10px 12px', fontFamily: t.fontBody, fontSize: 16, letterSpacing: 6, color: t.ink, background: t.surface, transition: 'border-color .15s' }} />
            <button onClick={verifyOtp} disabled={otp.length < 4}
          style={{ flexShrink: 0, padding: '0 14px', borderRadius: t.radiusSm, border: 'none', cursor: otp.length >= 4 ? 'pointer' : 'default', background: otp.length >= 4 ? t.primary : t.surface2, color: otp.length >= 4 ? t.onPrimary : t.faint, fontWeight: 700, fontSize: 13, fontFamily: t.fontBody, height: 44, transition: 'background .15s' }}>Verifikasi</button>
          </div>
          <button onClick={() => {setOtpSent(false);setOtp('');}}
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.faint, fontSize: 12, marginTop: 8, padding: 0 }}>Kirim ulang kode</button>
        </div>
      }
    </div>);

}

// ── Nama penerima — tombol "tambah" yang jadi input saat ditap (bukan field kosong) ──
function NameInline({ name, setName, t }) {
  const [editing, setEditing] = useStateK(false);
  if (editing) {
    return (
      <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setEditing(false)}
      onKeyDown={(e) => {if (e.key === 'Enter') e.target.blur();}} placeholder="Nama" maxLength={28}
      style={{ flex: 1, minWidth: 0, border: 'none', borderBottom: '1.5px solid ' + t.primary, background: 'transparent', padding: '2px 0', fontFamily: t.fontBody, fontSize: 14, fontWeight: 700, color: t.ink, outline: 'none' }} />);

  }
  if (!name) {
    return (
      <button onClick={() => setEditing(true)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: t.primary, fontSize: 13.5, fontWeight: 600, fontFamily: t.fontBody, display: 'inline-flex', alignItems: 'center', gap: 5, WebkitTapHighlightColor: 'transparent' }}>
        <Icon name="plus" size={13} color={t.primary} stroke={2.4} />Tambah nama <span style={{ fontWeight: 400, color: t.faint }}>(opsional)</span>
      </button>);

  }
  return (
    <button onClick={() => setEditing(true)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: t.ink, fontSize: 14, fontWeight: 700, fontFamily: t.fontBody, display: 'inline-flex', alignItems: 'center', gap: 6, WebkitTapHighlightColor: 'transparent' }}>
      {name}<Icon name="edit" size={12.5} color={t.faint} />
    </button>);

}

// ── Confirm ───────────────────────────────────────────────
// ── Harga item gratis — harga penuh dicoret + Rp 0 ──
function FreePrice({ line, size = 13 }) {
  const t = useTheme();
  const it = itemById(line.itemId);
  const full = (it ? it.price : 0) * line.qty;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
      {full > 0 && <s style={{ fontSize: size - 1.5, color: t.faint, fontWeight: 600 }}>{rupiah(full)}</s>}
      <span style={{ fontSize: size, fontWeight: 700, color: t.primary }}>Rp 0</span>
    </span>);

}

// ── PromoMark — penanda Promo Produk di baris item (Konfirmasi & Pembayaran berhasil) ──
// Bentuk sama dengan PromoLine di Keranjang (ikon tag 12 + nama promo, teal, 1 baris + elipsis),
// tapi hanya informasi — tidak bisa diketuk. Figma 4444:79902 & 4440:834.
function PromoMark({ promo }) {
  const t = useTheme();
  if (!promo) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
      <Icon name="tag" size={12} color={t.primary} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: t.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{promo.title}</span>
    </div>);
}

// ── Order summary — baris rincian harga (dipakai ulang 3 gaya) ──
function BreakdownRows({ subtotal, tax, rounding, itemDiscLines }) {
  const t = useTheme();
  const app = useApp();
  const bill = app.computeBill();
  // MVP: subtotal sudah setelah Promo Produk (item gratis, beli-N, harga coret) — penandanya
  // di baris item. Di ringkasan hanya Diskon Transaksi otomatis (maks. 1) beserta namanya.
  const txPromo = app.applied.map((a) => promoById(a.id)).find((p) => p && isVoucher(p));
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: t.muted }}>Subtotal</span>
        <Money value={subtotal} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
      </div>
      {/* Figma 5270:2693: baris "Promo Transaksi" + nama promo menempel di bawahnya (tidak bisa diketuk) */}
      {txPromo && bill.discount > 0 &&
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, color: t.muted }}>Promo Transaksi</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.primary, flexShrink: 0 }}>{'−' + rupiah(bill.discount)}</span>
          </div>
          <PromoMark promo={txPromo} />
        </div>}
      {bill.service > 0 &&
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: t.muted }}>Service Charge ({Math.round(bill.serviceRate * 100)}%)</span>
          <Money value={bill.service} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
        </div>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: t.muted }}>Pajak{bill.taxInclusive ? ' · termasuk' : ''}</span>
        <Money value={bill.tax} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
      </div>
      {bill.rounding !== 0 &&
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: t.muted }}>Pembulatan</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{(bill.rounding > 0 ? '' : '– ') + rupiah(Math.abs(bill.rounding))}</span>
        </div>}
    </>);

}

// disclosure rincian harga (gaya "ringkas") — total ada di bar bawah
function RincianDisclosure({ subtotal, tax, rounding, itemDiscLines }) {
  const t = useTheme();
  const [open, setOpen] = useStateK(false);
  return (
    <div style={{ borderTop: '1px solid ' + t.line }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: t.ink }}>Rincian harga</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: t.muted, fontWeight: 600 }}>
          {open ? 'Sembunyikan' : 'Lihat'}
          <Icon name="chevron" size={14} color={t.muted} style={{ transform: `rotate(${open ? -90 : 90}deg)`, transition: 'transform .2s' }} />
        </span>
      </button>
      {open &&
      <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <BreakdownRows subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
        </div>}
    </div>);

}

function OrderSummary({ subtotal, tax, total, rounding, itemDiscLines, expanded, setExpanded }) {
  const t = useTheme();
  const app = useApp();
  const variant = app.checkoutSummary || 'flat';
  const qtyTotal = app.cart.reduce((s, l) => s + l.qty, 0);
  // Figma 4444:79902: daftar tertutup menampilkan item ber-Promo Produk sebagai item pertama.
  // Urutan yang sama dipakai saat dibuka, jadi item pertama tidak melompat.
  const ordered = [...app.cart.filter((l) => app.linePrice(l).promo), ...app.cart.filter((l) => !app.linePrice(l).promo)];
  const items = expanded ? ordered : ordered.slice(0, 1);
  const moreCount = app.cart.length - 1;
  const mixedType = new Set(app.cart.map((l) => l.type === 'takeaway' ? 'takeaway' : 'dinein')).size > 1;
  const typeTag = (l) => mixedType ?
  <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: t.muted }}>
      <Icon name={l.type === 'takeaway' ? 'takeaway' : 'dineIn'} size={12} color={t.muted} stroke={1.8} />
      {l.type === 'takeaway' ? 'Take Away' : 'Dine In'}
    </div> : null;

  // ===== DUA KARTU — Pesananmu + Rincian pembayaran (terpisah) =====
  if (variant === 'dua') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Pesanan — judul jadi label di luar; kartu = isi item */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Pesanan</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: t.faint }}>{qtyTotal} item</span>
          </div>
          <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
            <div style={{ padding: '6px 16px' }}>
              {items.map((l, i) =>
              <div key={l.uid} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
                  <div style={{ ...{ minWidth: 24, height: 24, borderRadius: 7, background: l.free ? t.primarySoft : t.surface2, color: t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, marginTop: 1, flexShrink: 0 }, background: "rgba(233, 238, 238, 0.1)" }}>{l.qty}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: t.ink, flex: 1, lineHeight: 1.3 }}>{l.name}</span>
                      {l.free ?
                    <FreePrice line={l} size={13.5} /> :
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
                      {app.linePrice(l).orig !== app.linePrice(l).final && <Money value={app.linePrice(l).orig} strike style={{ fontSize: 12, fontWeight: 600, color: t.faint }} />}
                      <Money value={app.linePrice(l).final} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }} />
                    </span>}
                    </div>
                    {l.options && l.options.length > 0 && <OptLines options={l.options} size={12} style={{ marginTop: 2 }} />}
                    {l.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{l.notes}"</div>}
                    {typeTag(l)}
                  </div>
                </div>
              )}
              {app.cart.length > 1 &&
              <button onClick={() => setExpanded((x) => !x)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, WebkitTapHighlightColor: 'transparent' }}>
                  {expanded ? 'Tampilkan lebih sedikit' : `Tampilkan ${moreCount} item lainnya`}
                  <Icon name="chevron" size={14} color={t.primary} style={{ transform: `rotate(${expanded ? -90 : 90}deg)` }} />
                </button>}
            </div>
          </div>
        </div>

        {/* Rincian pembayaran — judul jadi label di luar; kartu = isi rincian + total */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Rincian Pembayaran</div>
          <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '14px 16px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <BreakdownRows subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
            </div>
            <div style={{ borderTop: '1px solid ' + t.line, marginTop: 13 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 13 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{rupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>);

  }

  // ===== STRUK — satu aliran seperti struk kertas =====
  if (variant === 'struk') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Ringkasan Pesanan</span>
          <span style={{ fontSize: 11.5, color: t.faint, fontWeight: 600 }}>{qtyTotal} item</span>
        </div>
        <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, padding: '18px 18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: mixedType ? 16 : 12 }}>
          {(() => {
              const strukLine = (l) =>
              <div key={l.uid} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <FoodImg label={l.name.toLowerCase()} h={60} radius={10} style={{ width: 60, flexShrink: 0 }} src={itemById(l.itemId)?.photo} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, flex: 1, minWidth: 0, lineHeight: 1.25 }}>{l.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.muted, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{l.qty} pcs</span>
                </div>
                {l.options && l.options.length > 0 && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>{l.options.map((o, i) => <span key={i}>{o}</span>)}</div>}
                {l.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{l.notes}"</div>}
                {l.free ?
                  <div style={{ marginTop: 6 }}><FreePrice line={l} size={13.5} /></div> :
                  <div style={{ fontSize: 14, fontWeight: 800, color: t.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{rupiah(app.linePrice(l).final)}</div>}
              </div>
            </div>;
              if (!mixedType) return items.map(strukLine);
              // pesanan campur — pisahkan Dine In & Take Away dengan subjudul jelas
              return [['dinein', 'Dine In', 'dineIn'], ['takeaway', 'Take Away', 'takeaway']].map(([tp, label, icon]) => {
                const grp = items.filter((l) => (l.type === 'takeaway' ? 'takeaway' : 'dinein') === tp);
                if (!grp.length) return null;
                return (
                  <div key={tp} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name={icon} size={14} color={t.primary} stroke={1.9} />
                    <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: t.muted }}>{label}</span>
                    <span style={{ fontSize: 11, color: t.faint, fontWeight: 600 }}>· {grp.reduce((s, l) => s + l.qty, 0)} item</span>
                  </div>
                  {grp.map(strukLine)}
                </div>);
              });
            })()}
        </div>
        {app.cart.length > 1 &&
          <button onClick={() => setExpanded((x) => !x)} style={{ display: 'block', margin: '10px auto 0', border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
            {expanded ? 'Sembunyikan item' : `Lihat semua · ${moreCount} item lainnya`}
          </button>}
        <div style={{ borderTop: '1px dashed ' + t.lineStrong, margin: '16px -18px 14px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BreakdownRows subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
        </div>
        <div style={{ borderTop: '1px dashed ' + t.lineStrong, margin: '14px -18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{rupiah(total)}</span>
        </div>
        </div>
      </div>);

  }

  // ===== FIGMA / FLAT — OrderSummaryFlat (radius 18, shadow, no border) =====
  if (variant === 'flat') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 2, paddingRight: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Ringkasan Pesanan</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: t.faint }}>{qtyTotal} item</span>
        </div>
        <div style={{ background: t.surface, borderRadius: 18, boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.06)', padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((l) => {
              const price = app.linePrice(l);
              return (
              <div key={l.uid} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 11, marginBottom: 11 }}>
                <FoodImg label={l.name.toLowerCase()} h={60} radius={12} style={{ width: 60, flexShrink: 0 }} src={itemById(l.itemId)?.photo} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: t.ink, flex: 1, lineHeight: 1.3 }}>{l.name}</span>
                    <span style={{ fontSize: 12.5, color: t.faint, flexShrink: 0, whiteSpace: 'nowrap' }}>{l.qty} pcs</span>
                  </div>
                  {/* Figma "Case: Penanda Promo Produk (Konfirmasi)" (4444:79902): penanda tepat di bawah nama item */}
                  <PromoMark promo={price.promo} />
                  {isPaketLine(l) ? <PaketDetail line={l} gap={6} /> : l.options && l.options.length > 0 && <div style={{ fontSize: 12, color: t.faint }}>{l.options.join(' · ')}</div>}
                  {l.notes && <div style={{ fontSize: 12, color: t.faint, fontStyle: 'italic' }}>"{l.notes}"</div>}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    {price.orig !== price.final && <Money value={price.orig} strike style={{ fontSize: 12, fontWeight: 600, color: t.faint }} />}
                    {/* barang gratis (Rp0) teal — sama dengan Keranjang & Pembayaran berhasil */}
                    <Money value={price.final} style={{ fontSize: 13.5, fontWeight: 700, color: price.final === 0 ? t.primary : t.ink }} />
                  </div>
                </div>
              </div>);
            })}
            {app.cart.length > 1 &&
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <button onClick={() => setExpanded((x) => !x)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
                {expanded ? 'Sembunyikan item' : `Lihat semua · ${moreCount} item lainnya`}
              </button>
            </div>}
          </div>
          
          <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <BreakdownRows subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
          </div>
          
          <div style={{ height: 18 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: t.ink }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{rupiah(total)}</span>
          </div>
        </div>
      </div>);

  }

  // ===== RINGKAS — item + disclosure; total hanya di bar bawah =====
  return (
    <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid ' + t.line }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>Ringkasan Pesanan</span>
        <span style={{ fontSize: 12.5, color: t.muted, fontWeight: 600 }}>{qtyTotal} item</span>
      </div>
      <div style={{ padding: '0 16px' }}>
        {items.map((l, i) =>
        <div key={l.uid} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
            <div style={{ minWidth: 24, height: 24, borderRadius: 7, background: l.free ? t.primarySoft : t.surface2, color: l.free ? t.primary : t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, marginTop: 1, flexShrink: 0 }}>{l.qty}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: t.ink, flex: 1, lineHeight: 1.3 }}>{l.name}</span>
                {l.free ?
              <FreePrice line={l} size={13.5} /> :
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
                {app.linePrice(l).orig !== app.linePrice(l).final && <Money value={app.linePrice(l).orig} strike style={{ fontSize: 12, fontWeight: 600, color: t.faint }} />}
                <Money value={app.linePrice(l).final} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }} />
              </span>}
              </div>
              {l.options && l.options.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 3 }}>{l.options.join(' · ')}</div>}
              {l.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{l.notes}"</div>}
            </div>
          </div>
        )}
      </div>
      {app.cart.length > 1 &&
      <button onClick={() => setExpanded((x) => !x)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 16px', border: 'none', borderTop: '1px solid ' + t.line, background: 'transparent', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, WebkitTapHighlightColor: 'transparent' }}>
          {expanded ? 'Tampilkan lebih sedikit' : `Tampilkan ${moreCount} item lainnya`}
          <Icon name="chevron" size={15} color={t.primary} style={{ transform: `rotate(${expanded ? -90 : 90}deg)`, transition: 'transform .2s' }} />
        </button>}
      <RincianDisclosure subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
    </div>);

}

// ── Member lookup (demo) — nomor cocok → member POS ──────────
const MEMBERS = { '81234567890': { name: 'Budi Santoso', points: 1240 } };
function lookupMember(digits) { return MEMBERS[digits] || null; }
const initials = (nm) => nm.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// ── MemberLoginBlock — login opsional (Default/Expanded/Member/NonMember) ──
function MemberLoginBlock() {
  const t = useTheme();
  const app = useApp();
  const initMember = app.phone ? lookupMember(app.phone.replace(/\D/g, '')) : null;
  const [state, setState] = useStateK(initMember ? 'member' : 'default');
  const [phone, setPhone] = useStateK(app.phone || '');
  const [member, setMember] = useStateK(initMember);
  const digits = phone.replace(/\D/g, '');
  const valid = digits.length >= 8;

  const submit = () => {
    if (!valid) return;
    const m = lookupMember(digits);
    app.setPhone(digits);
    if (m) { setMember(m); setState('member'); } else setState('nonmember');
  };
  const logout = () => { app.setPhone(''); setMember(null); setPhone(''); setState('default'); };
  const slim = (app.memberBlock === 'card' || app.memberBlock === 'footer');

  if (state === 'member' && member) {
    if (slim) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="checkCircle" size={16} color={t.primary} stroke={2} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, color: t.ink }}>{member.name.split(' ')[0]} <span style={{ fontWeight: 600, color: t.primary }}>· {member.points.toLocaleString('id-ID')} poin</span></span>
        <button onClick={logout} style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer', color: t.faint, fontFamily: t.fontBody, fontSize: 12, fontWeight: 600 }}>Keluar</button>
      </div>);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.primarySoft, borderRadius: t.radius, padding: '11px 13px' }}>
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{initials(member.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>Halo, {member.name.split(' ')[0]}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.primary, marginTop: 2 }}>Member · {member.points.toLocaleString('id-ID')} poin</div>
        </div>
        <button onClick={logout} style={{ flexShrink: 0, border: 'none', background: 'none', padding: 4, cursor: 'pointer', color: t.faint, fontFamily: t.fontBody, fontSize: 12, fontWeight: 600 }}>Keluar</button>
      </div>);
  }

  const open = state === 'expanded' || state === 'nonmember';
  const nonMember = state === 'nonmember';
  const v = app.memberBlock || 'dashed';
  const forceOpen = v === 'field';
  const openNow = open || forceOpen;
  const cardWrap = v === 'dashed' || v === 'solid' || v === 'banner';

  const wrap = {
    dashed: { background: t.primarySoft, border: '1px dashed ' + hexA(t.primary, 0.4), borderRadius: t.radius, padding: '11px 13px' },
    solid: { background: t.primarySoft, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '11px 13px' },
    banner: { background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '11px 13px' }
  }[v] || {};

  const titleColor = v === 'banner' ? t.ink : t.primary;
  const tap = () => !openNow && setState('expanded');

  const fieldRow = (mt) =>
  <div style={{ marginTop: mt, display: 'flex', gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 44, border: '1.5px solid ' + (valid ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, overflow: 'hidden' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, padding: '0 10px 0 13px' }}>+62</span>
        <span style={{ width: 1, alignSelf: 'stretch', margin: '10px 0', background: t.line }} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="812 3456 7890" type="tel" onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '0 12px', fontFamily: t.fontBody, fontSize: 14, fontVariantNumeric: 'tabular-nums', color: t.ink, outline: 'none' }} />
      </div>
      <button onClick={submit} disabled={!valid} style={{ flexShrink: 0, height: 44, padding: '0 20px', borderRadius: t.radiusSm, background: 'transparent', border: '1.5px solid ' + (valid ? t.primary : t.line), color: valid ? t.primary : t.faint, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, cursor: valid ? 'pointer' : 'default' }}>Masuk</button>
    </div>;

  const noteRow =
  <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      <Icon name="info" size={13} color={t.faint} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>Nomor disimpan buat struk. Belum terdaftar sebagai member.</span>
    </div>;

  const chev = <Icon name="chevron" size={17} color={t.primary} style={{ transform: openNow ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform .2s' }} />;

  // ── header per varian ──
  let header;
  if (v === 'benefit') {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.primary, borderRadius: t.radius, padding: '13px 15px', cursor: openNow ? 'default' : 'pointer' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.onPrimary, lineHeight: 1.2 }}>Dapat poin tiap pesan</div>
          <div style={{ fontSize: 11.5, color: hexA(t.onPrimary, 0.8), marginTop: 2 }}>Masuk pakai No. HP · opsional</div>
        </div>
        {!openNow && <span style={{ flexShrink: 0, background: t.onPrimary, color: t.primary, borderRadius: 999, padding: '8px 16px', fontSize: 13, fontWeight: 800 }}>Masuk</span>}
      </div>;
  } else if (v === 'pill') {
    header =
    <button onClick={tap} disabled={openNow} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: t.primarySoft, border: 'none', borderRadius: 999, padding: '13px 16px', cursor: openNow ? 'default' : 'pointer', fontFamily: t.fontBody }}>
        <Icon name="gift" size={17} color={t.primary} stroke={2} />
        <span style={{ fontSize: 13.5, fontWeight: 700, color: t.primary }}>Masuk & kumpulin poin</span>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: t.muted }}>· opsional</span>
      </button>;
  } else if (v === 'ticket') {
    header =
    <div onClick={tap} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '13px 15px 13px 20px', overflow: 'hidden', cursor: openNow ? 'default' : 'pointer' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundImage: `repeating-linear-gradient(180deg, ${t.primary} 0 7px, transparent 7px 13px)` }} />
        <Icon name="gift" size={20} color={t.primary} stroke={2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Member</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, marginTop: 1 }}>Masuk buat kumpulin poin</div>
        </div>
        {!openNow && <span style={{ flexShrink: 0, color: t.primary, fontSize: 13, fontWeight: 700 }}>Masuk ›</span>}
      </div>;
  } else if (v === 'field') {
    header =
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name="gift" size={15} color={t.primary} stroke={2} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>Kumpulin poin <span style={{ fontWeight: 500, color: t.faint }}>· opsional, pakai No. HP</span></span>
      </div>;
  } else if (v === 'card') {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: openNow ? 'default' : 'pointer' }}>
        <Icon name="gift" size={15} color={t.primary} stroke={2} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, color: t.primary }}>Kumpulin poin <span style={{ fontWeight: 500, color: t.faint }}>· opsional, pakai No. HP</span></span>
        {chev}
      </div>;
  } else if (v === 'footer') {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: openNow ? 'default' : 'pointer' }}>
        <Icon name="gift" size={16} color={t.primary} stroke={2} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, color: t.ink }}>Masuk buat kumpulin poin</span>
        <span style={{ flexShrink: 0, color: t.primary, fontSize: 12.5, fontWeight: 700 }}>Masuk ›</span>
      </div>;
  } else if (v === 'inline') {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px', cursor: openNow ? 'default' : 'pointer' }}>
        <Icon name="gift" size={16} color={t.primary} stroke={2} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: t.primary }}>Masuk buat kumpulin poin <span style={{ fontWeight: 500, color: t.faint }}>· opsional</span></span>
        {chev}
      </div>;
  } else if (v === 'banner') {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: openNow ? 'default' : 'pointer' }}>
        <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="gift" size={17} color={t.primary} stroke={2} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.25 }}>Member? Masuk buat kumpulin poin</div>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Opsional · pakai No. HP</div>
        </div>
        <Icon name="chevron" size={17} color={t.faint} style={{ transform: openNow ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform .2s' }} />
      </div>;
  } else {
    header =
    <div onClick={tap} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: openNow ? 'default' : 'pointer' }}>
        <Icon name="gift" size={19} color={t.primary} stroke={2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: titleColor, lineHeight: 1.25 }}>Member? Masuk buat kumpulin poin</div>
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Opsional · pakai No. HP</div>
        </div>
        {chev}
      </div>;
  }

  if (openNow) {
    return (
      <div>
        {fieldRow(0)}
        {nonMember && noteRow}
      </div>);
  }
  if (cardWrap) return <div style={wrap}>{header}</div>;
  return <div>{header}</div>;
}

function ConfirmScreen() {
  const t = useTheme();
  const app = useApp();
  const isOpenBill = app.mode === 'dyn-openbill';
  const mb = app.memberBlock || 'dashed';
  const mbInBody = mb !== 'card' && mb !== 'footer';
  const bill = app.computeBill();
  const subtotal = bill.subtotal;
  const discount = bill.discount;
  const itemDiscLines = app.itemDiscountLines();
  const itemDisc = bill.itemDisc;
  const net = bill.net;
  const tax = bill.tax;
  const rawTotal = bill.taxInclusive ? bill.net + bill.service : bill.net + bill.service + bill.tax;
  const total = bill.total;
  const rounding = bill.rounding;
  const isDine = app.orderType === 'dinein';
  // tipe pesanan bisa campur per item — ringkas jadi label konteks
  const cartTypes = [...new Set(app.cart.map((l) => l.type === 'takeaway' ? 'takeaway' : 'dinein'))];
  const mixedType = cartTypes.length > 1;
  const ctxType = mixedType ? 'mix' : cartTypes[0] || (isDine ? 'dinein' : 'takeaway');
  const ctxTypeLabel = mixedType ? 'Campuran' : ctxType === 'takeaway' ? 'Take Away' : 'Dine In';
  const ctxTypeIcon = ctxType === 'takeaway' ? 'takeaway' : 'dineIn';
  // baris konteks per-tipe: campur → satu label gabungan, meja ikut dine-in
  const ctxRows = mixedType ?
  [{ type: 'dinein', label: 'Campuran', table: true }] :
  [{ type: ctxType === 'takeaway' ? 'takeaway' : 'dinein', label: ctxTypeLabel, table: ctxType !== 'takeaway' }];

  // customer info state
  const [name, setName] = useStateK('');
  const [phone, setPhone] = useStateK(app.phone || '');
  const [otpSent, setOtpSent] = useStateK(false);
  const [otp, setOtp] = useStateK('');
  const [verified, setVerified] = useStateK(!!app.phone);
  const [sending, setSending] = useStateK(false);
  const [expanded, setExpanded] = useStateK(false);
  const [custOpen, setCustOpen] = useStateK(false);
  const [payLoading, setPayLoading] = useStateK(false);
  const validPhone = phone.replace(/\D/g, '').length >= 8;

  const sendOtp = () => {
    if (!validPhone) return;
    setSending(true);
    setTimeout(() => {setSending(false);setOtpSent(true);}, 900);
  };
  const verifyOtp = () => {
    if (otp.length < 4) return;
    app.setPhone(phone.replace(/\D/g, ''));
    setVerified(true);
  };

  const handlePay = () => {
    if (isOpenBill) {
      const digits = (app.phone || '').replace(/\D/g, '');
      app.askConfirm({
        title: 'Kirim pesanan ke dapur?',
        message: 'Promo hanya berlaku untuk order ini dan pesanan tidak bisa digabung setelah dikirim.',
        confirmLabel: 'Ya, Kirim',
        cancelLabel: 'Cek lagi',
        tone: 'primary',
        onConfirm: () => app.submitOrder({ name: '', phone: digits })
      });
      return;
    }
    setPayLoading(true);
    setTimeout(() => {
      if (app.payment === 'cash') app.go('cashstatus');else
      app.go('processing');
    }, 700);
  };

  const tableNumOuter = app.table ? String(app.table).replace(/^Meja\s*/i, '') : null;
  const ctaLabel = isOpenBill ? 'Kirim ke Dapur' : app.payment === 'cash' ? 'Bayar di Kasir' : 'Bayar';
  const canPay = isOpenBill ? true : !!app.payment;
  const payDisabled = !canPay || payLoading;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Konfirmasi Pesanan" onBack={app.back} />

      {/* ── scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 14px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── Data Pelanggan (Phone Input Only) - Figma Style ── */}
        {!isOpenBill &&
          <div style={{ padding: '0 2px', marginBottom: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8 }}>DATA PELANGGAN · OPSIONAL</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '0 12px', height: 44 }}>
              <Icon name="phone" size={17} color={t.ink} stroke={2.2} />
              <div style={{ fontSize: 14, fontWeight: 400, color: t.ink }}>+62</div>
              <div style={{ width: 1, height: 18, background: t.line }} />
              <input value={phone} onChange={(e) => { setPhone(e.target.value); app.setPhone(e.target.value.replace(/\D/g, '')); }} placeholder="813 8001 2025" type="tel"
                style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
            </div>
          </div>
        }

        {/* ── Ringkasan Pesanan ── */}
        {isOpenBill ?
          <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
            <div style={{ padding: '6px 16px' }}>
              {app.cart.map((l, i) =>
              <div key={l.uid} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
                <span style={{ minWidth: 22, fontSize: 13, fontWeight: 800, color: t.muted, fontVariantNumeric: 'tabular-nums' }}>{l.qty}&times;</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{l.name}</span>
                  {l.options && l.options.length > 0 && <OptLines options={l.options} size={12} style={{ marginTop: 2 }} />}
                </div>
                {l.free ?
                <FreePrice line={l} size={13.5} /> :
                <Money value={app.linePrice(l).final} style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, flexShrink: 0 }} />}
              </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 16px', borderTop: '1px solid ' + t.line, background: t.surface2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>Subtotal pesanan</span>
              <Money value={app.cartNet()} style={{ fontSize: 16, fontWeight: 800, color: t.ink }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderTop: '1px solid ' + t.line, color: t.muted }}>
              <Icon name="info" size={14} color={t.faint} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, lineHeight: 1.4 }}>Pajak &amp; total dihitung sekali saat Bayar Semua.</span>
            </div>
          </div> :
          <OrderSummary subtotal={subtotal} tax={tax} total={total} rounding={rounding} itemDiscLines={itemDiscLines} expanded={expanded} setExpanded={setExpanded} />
        }

        {/* ── Metode Pembayaran ── */}
        {!isOpenBill &&
          <div style={{ padding: '2px 2px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Metode Pembayaran</div>
            <PaymentPicker value={app.payment} onChange={app.setPayment} />
          </div>
        }

        {/* ── Open Bill info ── */}
        {isOpenBill &&
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: t.primarySoft, borderRadius: t.radius, padding: '14px 16px' }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="receipt" size={18} color={t.primary} stroke={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>Pesanan langsung ke dapur</div>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: t.muted, lineHeight: 1.5 }}>Pesananmu digabung jadi satu tagihan — bayar belakangan saat sudah selesai makan.</p>
            </div>
          </div>
        }

        </div>
      </div>

      {/* ── sticky bottom bar ── */}
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(16px + env(safe-area-inset-bottom))' }}>
        {mb === 'footer' && !isOpenBill &&
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid ' + t.line }}><MemberLoginBlock /></div>}
        {app.checkoutSummary === 'sheet' ?
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>{isOpenBill ? 'Subtotal pesanan' : 'Total Pembayaran'}</div>
              <Money value={isOpenBill ? app.cartNet() : total} style={{ fontSize: 20, fontWeight: 800, color: t.ink }} />
            </div>
            <button onClick={handlePay} disabled={payDisabled} style={{
            flexShrink: 0, height: 54, padding: '0 24px', borderRadius: 18, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: canPay ? (payLoading ? hexA(t.primary, 0.45) : t.primary) : t.surface2,
            color: canPay ? t.onPrimary : t.faint,
            fontWeight: 700, fontSize: 16.5, fontFamily: t.fontBody,
            cursor: payDisabled ? 'default' : 'pointer',
            transition: 'background .15s, color .15s',
            boxShadow: canPay && !payLoading ? '0 4px 14px ' + hexA(t.primary, 0.35) : 'none'
          }}>
              {payLoading && <span style={{ width: 15, height: 15, borderRadius: 999, border: '2px solid ' + hexA(t.onPrimary, 0.35), borderTopColor: t.onPrimary, animation: 'om-spin .7s linear infinite', flexShrink: 0 }} />}
              {payLoading ? 'Memproses…' : ctaLabel}
            </button>
          </div> :

        <button onClick={handlePay} disabled={payDisabled} style={{
          width: '100%', height: 54, padding: '0 24px', borderRadius: 18, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: canPay ? (payLoading ? hexA(t.primary, 0.45) : t.primary) : t.surface2,
          color: canPay ? t.onPrimary : t.faint,
          fontWeight: 700, fontSize: 16.5, fontFamily: t.fontBody,
          cursor: payDisabled ? 'default' : 'pointer',
          transition: 'background .15s, color .15s',
          boxShadow: canPay && !payLoading ? '0 4px 14px ' + hexA(t.primary, 0.35) : 'none'
        }}>
            {payLoading && <span style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid ' + hexA(t.onPrimary, 0.35), borderTopColor: t.onPrimary, animation: 'om-spin .7s linear infinite', flexShrink: 0 }} />}
            <span>{payLoading ? 'Memproses…' : ctaLabel}</span>
          </button>
        }
      </div>
    </div>);

}

// ── Processing / QRIS ──────────────────────────────────────
function ProcessingScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const pay = paymentById(app.payment) || PAYMENTS[0];
  const amount = params && params.amount != null ? params.amount : app.orderTotal();
  const isQr = pay.kind === 'qr';
  const [secs, setSecs] = useStateK(QRIS_SECONDS);
  const target = params && params.settle || app.mode === 'dyn-openbill' ? 'paid' : 'success';
  const finish = () => app.go(target, { root: true, amount });

  // QRIS: pembayaran tidak auto-selesai. User cek status; hanya lanjut bila sudah dibayar.
  const [paid, setPaid] = useStateK(false);
  const [checkingPay, setCheckingPay] = useStateK(false);
  const [checkMsg, setCheckMsg] = useStateK(null);
  const qrRef = React.useRef(null);

  const checkStatus = () => {
    if (checkingPay) return;
    setCheckingPay(true);
    setTimeout(() => {setCheckingPay(false);finish();}, 900);
  };
  const markPaid = () => {setPaid(true);finish();};
  const downloadQr = () => {
    const svg = qrRef.current && qrRef.current.querySelector('svg');
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const S = 688;
      const c = document.createElement('canvas');
      c.width = S;c.height = S;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';ctx.fillRect(0, 0, S, S);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, S, S);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'QRIS-' + (app.orderRef || 'pesanan') + '.png';
      document.body.appendChild(a);a.click();a.remove();
    };
    img.src = src;
  };

  useEffectK(() => {
    if (!isQr) {const id = setTimeout(finish, 2000);return () => clearTimeout(id);}
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  // Timer tetap berjalan di balik modal back; kalau habis, modal kedaluwarsa yang tampil.
  useEffectK(() => {if (isQr && secs === 0 && !paid) app.closeConfirm();}, [secs]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title={isQr ? 'Pembayaran QRIS' : 'Memproses'} onBack={isQr ? () => askLeavePayment(app, 'Kode QRIS ini') : undefined} />

      {isQr ?
      <>
          <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 20px 120px' }}>

            {/* QR card */}
            <div style={{ background: t.surface, borderRadius: t.radiusLg, border: '1px solid ' + t.line, boxShadow: t.shadow, overflow: 'hidden' }}>

              {/* QR code area */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div ref={qrRef} onClick={() => !paid && markPaid()} style={{ border: '3px solid ' + t.ink, borderRadius: 8, padding: 8, background: '#fff', cursor: paid ? 'default' : 'pointer' }}>
                  <QrPlaceholder color="#000" bg="#fff" size={172} />
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {paid ?
                <>
                      <Icon name="checkCircle" size={16} color={t.primary} />
                      <span style={{ fontSize: 13, color: t.primary, fontWeight: 700 }}>Pembayaran diterima</span>
                    </> :

                <>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22c55e', display: 'inline-block', animation: 'om-pulse 1.2s ease-in-out infinite' }} />
                      <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>Menunggu pembayaran…</span>
                    </>}
                </div>
                {/* timer masa berlaku QR — 10 menit */}
                {!paid &&
              <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: secs <= 30 ? 'rgba(226,104,14,0.12)' : t.surface2, borderRadius: 999, padding: '5px 13px' }}>
                  <Icon name="clock" size={14} color={secs <= 30 ? '#E2680E' : t.muted} />
                  <span style={{ fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: secs <= 30 ? '#E2680E' : t.ink }}>
                    {secs > 0 ? 'Berlaku ' + String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0') : 'QR kedaluwarsa'}
                  </span>
                </div>
              }
                {/* download QR — tepat di bawah QR */}
                <button onClick={downloadQr} style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1px solid ' + t.line, background: t.surface, borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, color: t.primary, WebkitTapHighlightColor: 'transparent' }}>
                  <Icon name="download" size={16} color={t.primary} /> Download QR
                </button>
                {/* nomor referensi pesanan — sama dengan kode di Status Kasir & struk (Figma 1223:1655) */}
                <div style={{ marginTop: 14, fontSize: 12, color: t.muted, textAlign: 'center' }}>{app.refCode}</div>
              </div>

              {/* accepted apps */}
            </div>

            {/* amount banner — di bawah QR, di atas cara bayar */}
            <div style={{ marginTop: 16, background: t.primary, borderRadius: t.radius, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Total Pembayaran</div>
              <Money value={amount} style={{ fontSize: 26, fontWeight: 800, color: '#fff' }} />
            </div>

            {/* steps */}
            <div style={{ marginTop: 16, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, marginBottom: 12 }}>Cara Bayar</div>
              {[
            'Buka aplikasi e-wallet atau m-banking',
            'Pilih menu "Scan QR" atau "Bayar"',
            'Arahkan kamera ke QR di atas',
            'Konfirmasi jumlah dan bayar'].
            map((s, i) =>
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 10 : 0, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: t.primary }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, color: t.muted, lineHeight: 1.5 }}>{s}</span>
                </div>
            )}
            </div>
          </div>

          <div style={{ padding: '12px 18px calc(20px + env(safe-area-inset-bottom))', background: t.surface, borderTop: '1px solid ' + t.line }}>
            {checkMsg &&
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '9px 12px', borderRadius: t.radiusSm, background: checkMsg.ok ? t.primarySoft : 'rgba(226,104,14,0.1)' }}>
                <Icon name={checkMsg.ok ? 'checkCircle' : 'info'} size={15} color={checkMsg.ok ? t.primary : '#E2680E'} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: checkMsg.ok ? t.primary : '#E2680E', lineHeight: 1.4 }}>{checkMsg.text}</span>
              </div>
          }
            <Button full loading={checkingPay} onClick={checkStatus}>Update Status Pesanan</Button>
          </div>
        </> :

      <>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 999, border: '4px solid ' + t.primarySoft, borderTopColor: t.primary, animation: 'om-spin .8s linear infinite' }} />
            <h2 style={{ margin: '24px 0 6px', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 24, color: t.ink }}>Memproses {pay.label}</h2>
            <p style={{ color: t.muted, fontSize: 14 }}>Menghubungkan ke {pay.label}… {rupiah(amount)}</p>
          </div>
          <div style={{ padding: '12px 18px calc(20px + env(safe-area-inset-bottom))' }}>
            <Button full variant="soft" onClick={finish}>Lewati simulasi</Button>
          </div>
        </>
      }
      {/* Figma "Case: QRIS Kedaluwarsa" (860:572): timer habis & belum dibayar → modal.
          Modal "Yakin mau kembali?" yang sedang terbuka ditutup dulu (efek di atas). */}
      {isQr && secs === 0 && !paid && <QrisExpiredDialog onBack={app.back} />}
    </div>);


}

function QrPlaceholder({ color, bg, size = 180 }) {
  const n = 21;
  const cells = [];
  let seed = 7;
  const rnd = () => {seed = seed * 1103515245 + 12345 & 0x7fffffff;return seed / 0x7fffffff;};
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
    const on = finder ?
    x === 0 || x === 6 || y === 0 || y === 6 || x >= 2 && x <= 4 && y >= 2 && y <= 4 ? 1 : 0 :
    rnd() > 0.55 ? 1 : 0;
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={color} />);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} style={{ display: 'block', background: bg }} shapeRendering="crispEdges">
      {cells}
    </svg>);

}

// Figma "Case: Tombol Back di Layar Bayar" (5539:2802): back di Pembayaran QRIS & Status Pesanan
// (Bayar di Kasir) tidak langsung pindah layar — ConfirmDialog dulu. Lanjut Bayar / ketuk di luar
// kartu menutup modal. Ya, Kembali membatalkan kode lama (Bayar lagi → kode baru) lalu kembali ke
// Konfirmasi Pesanan; di Open Bill ke Ringkasan Pembayaran (layar sebelumnya di stack).
const askLeavePayment = (app, codeLabel) => app.askConfirm({
  title: 'Yakin mau kembali?',
  message: codeLabel + ' akan dibatalkan. Pesananmu tetap tersimpan, jadi kamu bisa pilih metode bayar lagi.',
  cancelLabel: 'Lanjut Bayar', confirmLabel: 'Ya, Kembali',
  onConfirm: () => {app.renewRef();app.back();}
});

// ── QrisExpiredDialog — Figma ExpiredDialog (4798:2701) ──
// Tidak bisa ditutup dengan ketuk di luar kartu; satu aksi: kembali ke Konfirmasi Pesanan
// (pesanan, nomor WA & metode QRIS tetap). Bayar lagi → kode QRIS & timer 10 menit baru.
function QrisExpiredDialog({ onBack }) {
  const t = useTheme();
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="om-qris-expired-title" style={{ position: 'absolute', inset: 0, zIndex: 110, background: 'rgba(10,20,19,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 28px', animation: 'om-fade .2s ease' }}>
      <div style={{ width: '100%', background: t.surface, borderRadius: t.radiusLg, padding: '26px 22px 22px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrisExpiredArt />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 id="om-qris-expired-title" style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 20, lineHeight: '25px', color: t.ink }}>Kode QRIS kedaluwarsa</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: t.muted }}>Kode QRIS hanya berlaku 10 menit. Pesananmu tetap tersimpan. Kembali ke konfirmasi untuk membuat kode baru.</p>
          </div>
        </div>
        <Button full onClick={onBack}>Kembali ke konfirmasi pesanan</Button>
      </div>
    </div>);
}

// ── QrisExpiredArt — Figma illustration/qris-expired (176×176) ──
// Keluarga illustration/warning-receipt: lingkaran krem, kartu QR, lencana jam merah, 2 kilau.
// Animasi loop 4,17 dtk dari timeline Figma (CSS om-qx-* di Self Order.html).
function QrisExpiredArt() {
  const C = '#C9BBA0';
  const finders = [[9, 9], [40, 9], [9, 40]];
  const modules = [[29, 10], [29, 18], [10, 29], [18, 29], [29, 29], [37, 29], [49, 29], [29, 40], [41, 41], [49, 49], [37, 49], [29, 49]];
  const img = (src, style, cls) => <img alt="" src={src} className={'om-qx ' + cls} style={{ position: 'absolute', display: 'block', ...style }} />;
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: 176, height: 176, flexShrink: 0 }}>
      {img('assets/qris-expired/bg.svg', { left: 16.29, top: 25.56, width: 78.857, height: 78.857 }, 'om-qx-bg')}
      {/* kartu QR 64×64 di (50,70); stroke 1.5 di tengah garis, jadi kanvas SVG diberi ruang 1px */}
      <svg className="om-qx om-qx-qr" width="66" height="66" viewBox="-1 -1 66 66" style={{ position: 'absolute', left: 49, top: 69, display: 'block' }}>
        <rect x="0" y="0" width="64" height="64" rx="10" fill="#FFFFFF" stroke="#E4D7BE" strokeWidth="1.5" />
        {finders.map(([x, y]) =>
        <g key={x + '-' + y}>
            <rect x={x} y={y} width="15" height="15" rx="4" fill={C} />
            <rect x={x + 3} y={y + 3} width="9" height="9" rx="2.2" fill="#FFFFFF" />
            <rect x={x + 5} y={y + 5} width="5" height="5" rx="1.4" fill={C} />
          </g>
        )}
        {modules.map(([x, y]) => <rect key={x + '-' + y} x={x} y={y} width="5" height="5" rx="1.3" fill={C} />)}
      </svg>
      {img('assets/qris-expired/clock-badge.svg', { left: '60.39%', top: '24.59%', width: 53.4286, height: 53.4286 }, 'om-qx-badge')}
      {img('assets/qris-expired/sparkle-teal.svg', { left: '19.14%', top: '29.05%', width: 16.3429, height: 16.3429 }, 'om-qx-spark1')}
      {img('assets/qris-expired/sparkle-gold.svg', { left: '83.07%', top: '79.05%', width: 11.3143, height: 11.3143 }, 'om-qx-spark2')}
    </div>);
}

// ── Open Bill running view ─────────────────────────────────
// ── OrderCard — kartu order ringkas (item bergambar + tipe) ──
function OrderCard({ o }) {
  const t = useTheme();
  const trig = o.lines.find((l) => !l.free) || o.lines[0] || {};
  const type = trig.type === 'takeaway' ? 'Take Away' : 'Dine In';
  const itemCount = o.lines.reduce((s, l) => s + (l.qty || 1), 0);
  return (
    <div style={{ marginBottom: 12, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, boxShadow: t.shadow, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '13px 16px 2px' }}>
        <span style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: t.ink }}>Order #{o.num}</span>
          <span style={{ fontSize: 11.5, color: t.faint, fontWeight: 600 }}>{itemCount} item</span>
        </span>
        <Money value={o.subtotal != null ? o.subtotal : o.total} style={{ flexShrink: 0, fontWeight: 800, fontSize: 15, color: t.ink }} />
      </div>
      <div style={{ padding: '0 16px' }}>
        {o.lines.map((l, i) => {
          const it = itemById(l.itemId) || {};
          return (
            <div key={l.uid} style={{ display: 'flex', gap: 11, alignItems: 'center', padding: '9px 0', borderTop: i > 0 ? '1px solid ' + t.line : 'none' }}>
              <FoodImg label={l.name.toLowerCase()} h={40} radius={9} style={{ width: 40, flexShrink: 0 }} src={it.photo} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                {l.options && l.options.length > 0 &&
                <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {l.options.map((o, oi) => <div key={oi} style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o}</div>)}
                </div>}
              </div>
              <span style={{ flexShrink: 0, fontSize: 12.5, fontWeight: 700, color: t.muted }}>×{l.qty}</span>
              <span style={{ flexShrink: 0, fontSize: 12.5, fontWeight: 700, color: l.free ? t.primary : t.ink, minWidth: 62, textAlign: 'right' }}>{l.free ? rupiah(0) : rupiah(l.unit * l.qty)}</span>
            </div>);
        })}
      </div>
    </div>);
}

function BillScreen({ embedded, navbarMode }) {
  const t = useTheme();
  const app = useApp();
  const orders = app.orders;
  const grand = app.grandTotal();

  // Tab dapat dibuka kapan saja — termasuk sebelum ada order terkirim.
  if (orders.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
        <TopBar title="Pesanan Saya" right={app.table &&
        <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 12px', fontSize: 13, fontWeight: 800 }}>
          <Icon name="table" size={14} color={t.primary} />Meja {String(app.table).replace(/^Meja\s*/i, '')}
        </span>} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '30px 34px 48px' }}>
          <EmptyState slotId="empty-bill" src="assets/empty-order.svg" size={240} title="Belum ada pesanan" desc="Pesanan yang kamu kirim ke dapur akan tampil di sini.">
          {!embedded &&
          <button onClick={() => app.go('menu', { root: true })} style={{ marginTop: 14, border: 'none', cursor: 'pointer', background: t.primary, color: t.onPrimary, borderRadius: t.radius, padding: '12px 22px', fontFamily: t.fontBody, fontSize: 14.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 22px ' + hexA(t.primary, 0.3), WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="back" size={18} color={t.onPrimary} /> Kembali ke Menu
          </button>}
          </EmptyState>
        </div>
      </div>);

  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Pesanan Saya" right={app.table &&
      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 12px', fontSize: 13, fontWeight: 800 }}>
          <Icon name="table" size={14} color={t.primary} />Meja {String(app.table).replace(/^Meja\s*/i, '')}
        </span>} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: navbarMode ? '4px 18px calc(110px + env(safe-area-inset-bottom))' : '4px 18px 200px' }}>

        {orders.map((o) => <OrderCard key={o.id} o={o} />)}

        {!embedded &&
        <button onClick={() => app.go('menu', { root: true, tab: 'menu' })} style={{ width: '100%', border: '1.5px dashed ' + t.lineStrong, background: t.surface, borderRadius: t.radius, padding: '14px 0', cursor: 'pointer', color: t.primary, fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="back" size={18} color={t.primary} stroke={2} /> Kembali ke Menu
        </button>}



      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: navbarMode ? 'calc(70px + env(safe-area-inset-bottom))' : 0, padding: navbarMode ? '14px 18px 16px' : '14px 18px calc(16px + env(safe-area-inset-bottom))', background: t.surface, borderTop: '1px solid ' + t.line, zIndex: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: t.muted }}>Total tagihan ({orders.length} order)</span>
          <Money value={grand} style={{ fontWeight: 800, fontSize: 22, color: t.ink }} />
        </div>
        <Button full onClick={() => app.go('settle')}>Bayar Semua</Button>
      </div>
    </div>);

}

// ── Settle (open bill final payment) ───────────────────────
function SettleScreen() {
  const t = useTheme();
  const app = useApp();
  const [voucherId, setVoucherId] = useStateK(null);
  const [voucherOpen, setVoucherOpen] = useStateK(false);
  const grandSub = app.ordersSubtotal();               // subtotal item (kotor, semua order)
  const grossNet = app.ordersNet();                    // net pra-pajak (subtotal − diskon produk)
  const itemDiscTotal = Math.max(0, grandSub - grossNet);
  const vp = voucherId ? promoById(voucherId) : null;
  const vEligible = vp && (!vp.min || grandSub >= vp.min);
  const discount = !vEligible ? 0 : vp.kind === 'percent' ? Math.min(vp.cap || Infinity, Math.round(grossNet * vp.value)) : vp.kind === 'fixed' ? vp.value : 0;
  // PAJAK & service dihitung SEKALI dari (net − diskon transaksi)
  const settle = app.settleBill(discount);
  const payTotal = settle.total;

  const [settlePhone, setSettlePhone] = useStateK('');
  const [settleName, setSettleName] = useStateK('');
  const rawPhone = [...settlePhone].filter((c) => c >= '0' && c <= '9').join('');
  const phoneDigits = rawPhone[0] === '0' ? rawPhone.slice(1) : rawPhone;
  const phoneValid = phoneDigits.length >= 9;

  const handleSettle = () => {
    if (!app.payment) return;
    if (app.payment === 'cash') { app.go('cashstatus', { settle: true, amount: payTotal, discount }); return; }
    app.go('processing', { settle: true, amount: payTotal });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Ringkasan Pembayaran" onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '4px 18px 24px' }}>
        {/* Data Pelanggan — opsional, untuk struk */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Data Pelanggan <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: 'none' }}>· opsional</span></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + (settleName ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, padding: '0 12px', transition: 'border-color .15s' }}>
              <Icon name="user" size={15} color={t.faint} />
              <input value={settleName} onChange={(e) => setSettleName(e.target.value)} placeholder="Nama" maxLength={28}
              style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '12px 0', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + (phoneValid ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, padding: '0 12px', transition: 'border-color .15s' }}>
              <Icon name="phone" size={15} color={t.faint} />
              <input value={settlePhone} onChange={(e) => setSettlePhone(e.target.value)} placeholder="Nomor HP" type="tel"
              style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '12px 0', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
            </div>
          </div>
        </div>
        {/* Voucher & diskon — disamakan dengan QR Statis (kartu di keranjang) */}
        <div style={{ borderTop: '1px solid ' + t.line, margin: '4px 0 16px' }}></div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Voucher &amp; Diskon</div>
        <div style={{ marginBottom: 16 }}>
          {!vp ?
          <button onClick={() => setVoucherOpen(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px',
            background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow,
            cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 32, height: 32, borderRadius: t.radiusSm, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="tag" size={16} color={t.primary} stroke={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>Voucher &amp; diskon</div>
              <div style={{ fontSize: 11.5, color: t.muted, fontWeight: 500, marginTop: 1 }}>Punya kode promo? Pakai di sini</div>
            </div>
            <Icon name="chevron" size={16} color={t.faint} style={{ flexShrink: 0 }} />
          </button> :
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
            background: t.surface, border: '1px solid ' + hexA(t.primary, 0.45), borderRadius: t.radius, boxShadow: t.shadow,
            textAlign: 'left' }}>
            <div style={{ width: 36, height: 36, borderRadius: t.radiusSm, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="tag" size={18} color={t.primary} stroke={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14.5, fontWeight: 700, color: t.ink }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vp.title}</span>
              </div>
              <div style={{ fontSize: 12, color: discount > 0 ? t.primary : t.muted, fontWeight: discount > 0 ? 700 : 500, marginTop: 1 }}>{discount > 0 ? 'Kamu hemat ' + rupiah(discount) : 'Promo aktif'}</div>
            </div>
            <button onClick={() => setVoucherOpen(true)} style={{
              flexShrink: 0, padding: '8px 15px', border: '1.5px solid ' + t.primary, background: t.surface,
              borderRadius: 999, color: t.primary, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 800,
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>Ubah</button>
          </div>}
        </div>

        {/* Kartu Tagihan — daftar order (bergambar) → garis → Total (hero) */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Rincian Tagihan</div>
        <div style={{ background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, boxShadow: t.shadow, marginBottom: 16, overflow: 'hidden' }}>

          {/* daftar order */}
          <div style={{ padding: '2px 16px 0' }}>
            {app.orders.map((o, oi) => {
              const first = itemById((o.lines[0] || {}).itemId) || {};
              return (
              <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: oi < app.orders.length - 1 ? '1px solid ' + t.line : 'none' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <FoodImg label={((o.lines[0] || {}).name || '').toLowerCase()} h={44} radius={t.radiusSm} src={first.photo} style={{ width: 44 }} />
                  {o.lines.length > 1 &&
                  <span style={{ position: 'absolute', right: -5, bottom: -5, minWidth: 19, height: 19, padding: '0 4px', borderRadius: 999, background: t.primary, color: t.onPrimary, border: '2px solid ' + t.surface, fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+{o.lines.length - 1}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }}>Order #{o.num}</span>
                    <Money value={o.subtotal != null ? o.subtotal : o.total} style={{ fontWeight: 700, fontSize: 14, color: t.ink, flexShrink: 0 }} />
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {o.lines.map((l) => <div key={l.uid} style={{ fontSize: 12, color: t.muted, lineHeight: 1.4 }}>{(l.qty > 1 ? l.qty + '× ' : '') + l.name}</div>)}
                  </div>
                </div>
              </div>);
            })}
          </div>

          {/* subtotal + diskon + PAJAK (dihitung sekali untuk seluruh tagihan) */}
          <div style={{ padding: '11px 16px 12px', borderTop: '1px solid ' + t.line }}>
            <Row label="Subtotal" value={rupiah(grandSub)} />
            {itemDiscTotal > 0 && <Row label="Diskon produk" value={'−' + rupiah(itemDiscTotal)} accent />}
            {discount > 0 && <Row label="Promo Transaksi" value={'−' + rupiah(discount)} accent />}
            {settle.service > 0 && <Row label={'Service ' + Math.round(settle.serviceRate * 100) + '%'} value={rupiah(settle.service)} />}
            <Row label={'Pajak' + (settle.taxInclusive ? ' · termasuk' : '')} value={rupiah(settle.tax)} />
            {settle.rounding !== 0 && <Row label="Pembulatan" value={(settle.rounding > 0 ? '' : '−') + rupiah(Math.abs(settle.rounding))} />}
          </div>

          {/* Total — hero */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderTop: '1px solid ' + t.line, background: hexA(t.primary, 0.05) }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Total</span>
            <Money value={payTotal} style={{ fontWeight: 800, fontSize: 26, color: t.primary }} />
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Metode Pembayaran</div>
        <PaymentPicker value={app.payment} onChange={app.setPayment} />
      </div>
      <div style={{ flexShrink: 0, padding: '14px 18px calc(16px + env(safe-area-inset-bottom))', background: t.surface, borderTop: '1px solid ' + t.line, zIndex: 40 }}>
        <Button full disabled={!app.payment} onClick={handleSettle}>Bayar {rupiah(payTotal)}</Button>
      </div>

      {voucherOpen &&
      <div style={{ position: 'absolute', inset: 0, zIndex: 80, background: t.bg, display: 'flex', flexDirection: 'column', animation: 'om-screen .3s cubic-bezier(.2,.8,.3,1)' }}>
        <TopBar title="Pilih Voucher" onBack={() => setVoucherOpen(false)} />
        <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '14px 18px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROMOS.filter(isVoucher).map((p) => {
              const eligible = !p.min || grandSub >= p.min;
              const on = voucherId === p.id;
              const shortfall = p.min && grandSub < p.min ? p.min - grandSub : 0;
              return (
                <VoucherPickCard key={p.id}
                  p={p}
                  selected={on}
                  eligible={eligible}
                  shortfall={shortfall}
                  actionLabel="Pakai"
                  onDetail={() => app.openSheet('voucher', { id: p.id })}
                  onApply={() => { if (on) { setVoucherId(null); return; } if (!eligible) return; setVoucherId(p.id); setVoucherOpen(false); }}
                />);
            })}
          </div>
        </div>
      </div>}
    </div>);

}

// ── Success ────────────────────────────────────────────────
// ── OrderItemRow — baris item di Pembayaran berhasil / struk (Figma OrderItemRow) ──
function OrderItemRow({ line, border }) {
  const t = useTheme();
  const app = useApp();
  const price = app.linePrice(line);
  return (
    <div>
      {border && <div style={{ height: 1, background: t.line }} />}
      <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '12px 0' }}>
        <div style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 7, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: t.muted }}>{line.qty}</div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: t.ink }}>{line.name}</span>
            <span style={{ flexShrink: 0, display: 'flex', gap: 5, whiteSpace: 'nowrap' }}>
              {price.orig !== price.final && <Money value={price.orig} strike style={{ fontSize: 12, fontWeight: 600, color: t.faint }} />}
              {/* barang gratis (Rp0) teal — Figma "Penanda Promo Produk (Selesai)" (4440:834) */}
              <Money value={price.final} style={{ fontSize: 13, fontWeight: 700, color: price.final === 0 ? t.primary : t.ink }} />
            </span>
          </div>
          <PromoMark promo={price.promo} />
          {/* modifier satu per baris, sama dengan LineOptions di Keranjang (screens-cart.jsx) */}
          {isPaketLine(line) ? <PaketDetail line={line} /> :
          line.options && line.options.length > 0 && <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.25 }}>{line.options.map((o, i) => <div key={i}>{o}</div>)}</div>}
          {line.notes && <div style={{ fontSize: 12, color: t.faint }}>{line.notes}</div>}
        </div>
      </div>
    </div>);
}

// ── SuccessScreen — "Pembayaran berhasil" (Figma 543:740) ──────
// Tujuan setelah pembayaran terkonfirmasi: QRIS (Update Status Pesanan) maupun
// Bayar di Kasir (Cek Status Pembayaran setelah kasir menandai lunas).
function SuccessScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const bill = app.computeBill();
  const lines = app.cart;
  const total = params && params.amount != null ? params.amount : bill.total;
  const pay = paymentById(app.payment) || PAYMENTS[0];
  const txPromo = app.applied.map((a) => promoById(a.id)).find((p) => p && isVoucher(p));
  const types = [...new Set(lines.map((l) => l.type === 'takeaway' ? 'takeaway' : 'dinein'))];
  const typeLabel = types.length > 1 ? 'Campuran' : types[0] === 'takeaway' ? 'Take Away' : 'Dine In';
  const [paidAt] = useStateK(() => new Date());
  const dateText = paidAt.getDate() + ' ' + paidAt.toLocaleString('id-ID', { month: 'short' }) + ' ' + paidAt.getFullYear() + ', ' +
  String(paidAt.getHours()).padStart(2, '0') + '.' + String(paidAt.getMinutes()).padStart(2, '0');
  const txId = 'S.' + String(app.orderRef * 48291 % 1000000000).padStart(9, '0');
  const [copied, setCopied] = useStateK(false);
  const [scrolled, setScrolled] = useStateK(false);
  const copyId = () => {
    try {navigator.clipboard && navigator.clipboard.writeText(txId);} catch (_) {}
    setCopied(true);setTimeout(() => setCopied(false), 1500);
  };
  const label = { fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint };
  const sumRow = (l, v, accent) =>
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <span style={{ flex: 1, fontSize: 13, color: accent ? t.primary : t.muted }}>{l}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: accent ? t.primary : t.ink, whiteSpace: 'nowrap' }}>{v}</span>
    </div>;
  const metaRow = (l, v, extra) =>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', fontSize: 13 }}>
      <span style={{ flex: 1, color: t.muted }}>{l}</span>
      <span style={{ fontWeight: 700, color: t.ink, whiteSpace: 'nowrap' }}>{v}</span>
      {extra}
    </div>;

  // "Download struk" → struk sederhana di tab baru
  const downloadReceipt = () => {
    const row = (a, b) => '<tr><td>' + a + '</td><td style="text-align:right">' + b + '</td></tr>';
    const items = lines.map((l) => {const pr = app.linePrice(l);return row(l.qty + '× ' + l.name + (l.options && l.options.length ? '<br><small>' + l.options.join(' · ') + '</small>' : ''), (pr.orig !== pr.final ? '<s style="color:#8a9a99">' + rupiah(pr.orig) + '</s> ' : '') + rupiah(pr.final));}).join('');
    const html = '<!doctype html><meta charset="utf-8"><title>Struk ' + txId + '</title><style>body{font:14px/1.45 Inter,system-ui,sans-serif;max-width:360px;margin:24px auto;padding:0 16px;color:#13201f}h1{font-size:18px;margin:0 0 4px}td{padding:4px 0;vertical-align:top}small{color:#5c6b6a}table{width:100%;border-collapse:collapse}hr{border:0;border-top:1px dashed #ccc;margin:12px 0}</style>' +
    '<h1>' + BRAND.name + '</h1><div>' + BRAND.location + ' · ' + typeLabel + (app.table ? ' · ' + app.table : '') + '</div><div>' + dateText + ' · ' + txId + '</div><hr><table>' + items + '</table><hr><table>' +
    row('Subtotal', rupiah(bill.subtotal)) + (bill.discount > 0 ? row('Promo Transaksi' + (txPromo ? ' (' + txPromo.title + ')' : ''), '−' + rupiah(bill.discount)) : '') +
    (bill.service > 0 ? row('Service', rupiah(bill.service)) : '') + row('Pajak', rupiah(bill.tax)) +
    (bill.rounding ? row('Pembulatan', rupiah(bill.rounding)) : '') + '<tr><td><b>Total</b></td><td style="text-align:right"><b>' + rupiah(total) + '</b></td></tr></table><hr><div>Metode: ' + pay.label + '</div><p style="color:#5c6b6a">Powered by Accurate POS</p>';
    window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })), '_blank');
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: t.surface }}>
      {/* latar status bar — muncul begitu layar digulir, supaya hero tidak lewat di bawah jam & notch */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 50, zIndex: 5, pointerEvents: 'none', background: t.primary, opacity: scrolled ? 1 : 0, transition: 'opacity .2s ease' }} />
      <div onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)} style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* hero — gradasi dari warna utama merchant */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '58px 24px 52px', marginBottom: -20, background: 'linear-gradient(139.2deg, ' + shade(t.primary, 28) + ' 0%, ' + t.primary + ' 45.455%, ' + shade(t.primary, -28) + ' 90.909%)' }}>
          {/* animasi sekali saat layar tampil: lingkaran muncul → centang tergambar → ring menyusul (CSS om-success-*) */}
          <div style={{ position: 'relative', width: 116, height: 116, flexShrink: 0 }}>
            <div className="om-success-ring" style={{ position: 'absolute', left: 14, top: 14, width: 88, height: 88, boxSizing: 'border-box', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.38)' }} />
            <div className="om-success-ring outer" style={{ position: 'absolute', left: 6, top: 6, width: 104, height: 104, boxSizing: 'border-box', borderRadius: 999, border: '2px solid rgba(255,255,255,0.25)' }} />
            {/* riak berulang: seukuran lingkaran, di belakangnya, lalu membesar keluar (CSS om-success-ripple).
                Alpha 0,22 = kontras riak ≈ 0,55× ring statis, sama dengan rasio di video referensi. */}
            <div className="om-success-ripple" aria-hidden="true" style={{ position: 'absolute', left: 21, top: 21, width: 74, height: 74, boxSizing: 'border-box', borderRadius: 999, border: '2px solid rgba(255,255,255,0.22)', pointerEvents: 'none' }} />
            <div className="om-success-circle" style={{ position: 'absolute', left: 21, top: 21, width: 74, height: 74, borderRadius: 999, background: '#fff', boxShadow: '0 10px 26px rgba(5,48,43,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* geometri = aset Figma "check" (543:747); di-inline supaya garisnya bisa digambar */}
              <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ display: 'block' }}>
                <path className="om-success-check" pathLength="1" d="M8.33333 20.8333L15.8333 28.3333L31.6667 11.6667" stroke="#1FAE5A" strokeWidth={5.66667} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: 22, color: '#fff' }}>Pembayaran berhasil</div>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 46, letterSpacing: -0.92, color: '#fff', lineHeight: 1.3 }}>{rupiah(total)}</div>
        </div>

        <div style={{ position: 'relative', background: t.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '22px 22px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', paddingBottom: 10 }}>
            <span style={{ flex: 1, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>Pesananmu</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.muted, whiteSpace: 'nowrap' }}>{typeLabel}{app.table ? ' · ' + app.table : ''}</span>
          </div>
          {lines.map((l, i) => <div key={l.uid} style={{ marginTop: i ? 8 : 0 }}><OrderItemRow line={l} border={i > 0} /></div>)}

          <div style={{ marginTop: 14, borderTop: '1px solid ' + t.line, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
            <span style={label}>Rincian Pembayaran</span>
            {sumRow('Subtotal', rupiah(bill.subtotal))}
            {/* Figma 5255:911: baris "Promo Transaksi" + nama promo menempel di bawahnya */}
            {bill.discount > 0 &&
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ flex: 1, fontSize: 13, color: t.muted }}>Promo Transaksi</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: t.primary, whiteSpace: 'nowrap' }}>{'−' + rupiah(bill.discount)}</span>
                </div>
                <PromoMark promo={txPromo} />
              </div>}
            {bill.service > 0 && sumRow('Service (' + Math.round(bill.serviceRate * 100) + '%)', rupiah(bill.service))}
            {sumRow('Pajak' + (bill.taxInclusive ? ' · termasuk' : ''), rupiah(bill.tax))}
            {bill.rounding !== 0 && sumRow('Pembulatan', (bill.rounding > 0 ? '' : '– ') + rupiah(Math.abs(bill.rounding)))}
          </div>

          <div style={{ marginTop: 14, borderTop: '1px solid ' + t.line, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={label}>Detail Transaksi</span>
            {metaRow('Metode', pay.kind === 'qr' ? 'QRIS' : 'Bayar di Kasir')}
            {metaRow('Tanggal', dateText)}
            {metaRow('ID Transaksi', txId,
            <button onClick={copyId} aria-label="Salin ID transaksi" style={{ flexShrink: 0, border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', WebkitTapHighlightColor: 'transparent' }}>
                <Icon name={copied ? 'check' : 'copy'} size={15} color={copied ? t.primary : t.faint} />
              </button>)}
          </div>

          <div style={{ marginTop: 8, borderTop: '1px dashed ' + t.line, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button full variant="ghost" icon="download" onClick={downloadReceipt}>Download struk</Button>
            <div style={{ fontSize: 11.5, color: t.faint, textAlign: 'center' }}>Dibuka di tab baru</div>
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 18px calc(12px + env(safe-area-inset-bottom))', background: t.surface, borderTop: '1px solid ' + t.line }}>
        <Button full onClick={() => app.startSession(app.mode || 'static', app.table)}>Kembali ke Menu</Button>
      </div>
    </div>);

}

// ── Bagikan struk — sheet pilih channel (WhatsApp / Email), overlay in-app ──
function ShareReceiptSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const [chan, setChan] = useStateK('whatsapp');
  const [wa, setWa] = useStateK(app.phone || '');
  const waKnown = !!app.phone;
  const [editWa, setEditWa] = useStateK(!waKnown);
  const [email, setEmail] = useStateK('');
  const [sent, setSent] = useStateK(false);

  const onlyNums = [...wa].filter((c) => c >= '0' && c <= '9').join('');
  const waDigits = onlyNums[0] === '0' ? onlyNums.slice(1) : onlyNums;
  const waValid = waDigits.length >= 9;
  const at = email.indexOf('@');
  const dot = email.lastIndexOf('.');
  const emailValid = at > 0 && dot > at + 1 && dot < email.trim().length - 1;
  const valid = chan === 'whatsapp' ? waValid : emailValid;
  const dest = chan === 'whatsapp' ? '+62 ' + waDigits : email.trim();
  const send = () => {if (!valid) return;setSent(true);setTimeout(() => app.closeSheet(), 1600);};

  if (sent) {
    return (
      <Sheet onClose={app.closeSheet}>
        <div style={{ textAlign: 'center', padding: '20px 10px 34px' }}>
          <div style={{ width: 66, height: 66, borderRadius: 999, background: t.primarySoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'om-pop .5s cubic-bezier(.2,1.3,.4,1)' }}>
            <Icon name="check" size={34} color={t.primary} stroke={3} />
          </div>
          <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink }}>Struk terkirim</h3>
          <p style={{ margin: '9px 24px 0', fontSize: 13.5, color: t.muted, lineHeight: 1.55 }}>Salinan struk dikirim ke {chan === 'whatsapp' ? 'WhatsApp' : 'email'} <b style={{ color: t.ink }}>{dest}</b>.</p>
        </div>
      </Sheet>);
  }

  const seg = (id, label, icon, accent) => {
    const on = chan === id;
    return (
      <button key={id} onClick={() => setChan(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: t.radiusSm, border: 'none', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 14, fontWeight: 700, background: on ? t.surface : 'transparent', color: on ? t.ink : t.muted, boxShadow: on ? '0 1px 5px ' + hexA(t.ink, 0.14) : 'none', transition: 'all .18s', WebkitTapHighlightColor: 'transparent' }}>
        <Icon name={icon} size={17} color={on ? accent : t.muted} />{label}
      </button>);
  };

  return (
    <Sheet title="Bagikan struk" onClose={app.closeSheet}
    footer={<Button full icon="share" disabled={!valid} onClick={send}>Kirim struk</Button>}>
      <p style={{ margin: '0 0 16px', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Kirim salinan struk pembayaran ke WhatsApp atau email kamu.</p>
      <div style={{ display: 'flex', gap: 4, padding: 4, background: t.surface2, borderRadius: t.radius, marginBottom: 18 }}>
        {seg('whatsapp', 'WhatsApp', 'whatsapp', '#25D366')}
        {seg('email', 'Email', 'mail', t.primary)}
      </div>
      {chan === 'whatsapp' ?
      waKnown && !editWa ?
      <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Kirim ke nomor</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px solid ' + t.primary, borderRadius: t.radius, padding: '0 14px', height: 56, background: t.primarySoft }}>
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 999, background: t.surface, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="whatsapp" size={17} color="#25D366" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.ink, letterSpacing: 0.3 }}>{dest}</div>
              <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Nomor akun kamu</div>
            </div>
            <button onClick={() => setEditWa(true)} style={{ flexShrink: 0, border: 'none', background: 'none', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 4, WebkitTapHighlightColor: 'transparent' }}>Ganti</button>
          </div>
          <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim sebagai pesan WhatsApp.</p>
        </div> :
      <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Nomor WhatsApp</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid ' + (waValid ? t.primary : t.line), borderRadius: t.radius, padding: '0 14px', height: 54, background: t.surface2, transition: 'border-color .15s' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>+62</span>
            <div style={{ width: 1, height: 22, background: t.line }} />
            <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="8xx xxxx xxxx" type="tel" autoFocus style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontFamily: t.fontBody, fontSize: 16, color: t.ink, letterSpacing: 0.3 }} />
          </div>
          <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim sebagai pesan WhatsApp ke nomor ini.</p>
        </div> :

      <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Alamat email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" type="email" autoFocus style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid ' + (emailValid ? t.primary : t.line), borderRadius: t.radius, padding: '0 16px', height: 54, background: t.surface2, outline: 'none', fontFamily: t.fontBody, fontSize: 16, color: t.ink, transition: 'border-color .15s' }} />
          <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim ke alamat email ini.</p>
        </div>}
    </Sheet>);
}

// ── Bagikan Struk — HALAMAN PENUH (adaptif: WA dikenal vs email baru) ──
function ShareReceiptScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const p = params || {};
  const waKnown = !!app.phone;
  const [chan, setChan] = useStateK('whatsapp');
  const [wa, setWa] = useStateK(app.phone || '');
  const [editWa, setEditWa] = useStateK(!waKnown);
  const [email, setEmail] = useStateK('');
  const [sent, setSent] = useStateK(false);

  const onlyNums = [...wa].filter((c) => c >= '0' && c <= '9').join('');
  const waDigits = onlyNums[0] === '0' ? onlyNums.slice(1) : onlyNums;
  const waValid = waDigits.length >= 9;
  const at = email.indexOf('@');
  const dot = email.lastIndexOf('.');
  const emailValid = at > 0 && dot > at + 1 && dot < email.trim().length - 1;
  const valid = chan === 'whatsapp' ? waValid : emailValid;
  const fmtWa = (d) => '+62 ' + d.replace(/(\d{3})(\d{0,4})(\d*)/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' '));
  const dest = chan === 'whatsapp' ? fmtWa(waDigits) : email.trim();
  const send = () => {if (!valid) return;setSent(true);setTimeout(() => app.back(), 1500);};

  if (sent) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: t.surface, padding: '0 34px', textAlign: 'center' }}>
        <style>{`@keyframes om-pop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}`}</style>
        <div style={{ width: 86, height: 86, borderRadius: 999, background: t.primarySoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'om-pop .5s cubic-bezier(.2,1.3,.4,1)' }}>
          <Icon name="check" size={46} color={t.primary} stroke={3} />
        </div>
        <h2 style={{ margin: '22px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 28, color: t.ink }}>Struk terkirim</h2>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: t.muted, lineHeight: 1.55 }}>Salinan struk dikirim ke {chan === 'whatsapp' ? 'WhatsApp' : 'email'} <b style={{ color: t.ink }}>{dest}</b>.</p>
      </div>);
  }

  const metaRow = (label, value) =>
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
    <span style={{ fontSize: 12.5, color: t.muted }}>{label}</span>
    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink, textAlign: 'right' }}>{value}</span>
  </div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Bagikan Struk" onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 18px 24px' }}>

        {/* preview mini struk */}
        <div style={{ background: t.surface, borderRadius: t.radius, boxShadow: t.shadow, border: '1px solid ' + t.line, padding: '16px 18px', marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>Struk Pembayaran</div>
          <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 30, color: t.ink, lineHeight: 1, marginTop: 7, fontVariantNumeric: 'tabular-nums' }}>{rupiah(p.total || app.orderTotal())}</div>
          <div style={{ borderTop: '1px dashed ' + t.line, margin: '14px 0 12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {metaRow('Tanggal', p.date || '—')}
            {metaRow('ID Transaksi', p.txn || '—')}
            {metaRow(p.table ? 'Meja' : 'Tipe', p.table ? String(p.table).replace(/^Meja\s*/i, '') : p.typeLabel || 'Dine In')}
            {metaRow('Metode', p.payLabel || '—')}
          </div>
        </div>

        {/* pilih channel — segmented compact */}
        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink, marginBottom: 9 }}>Kirim ke mana?</div>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: t.surface2, borderRadius: t.radius, marginBottom: 20 }}>
          {[['whatsapp', 'WhatsApp', 'whatsapp', '#25D366'], ['email', 'Email', 'mail', t.primary]].map(([id, label, icon, accent]) => {
            const on = chan === id;
            return (
              <button key={id} onClick={() => setChan(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: t.radiusSm, border: 'none', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 14, fontWeight: 700, background: on ? t.surface : 'transparent', color: on ? t.ink : t.muted, boxShadow: on ? '0 1px 6px ' + hexA(t.ink, 0.16) : 'none', transition: 'all .18s', WebkitTapHighlightColor: 'transparent' }}>
                <Icon name={icon} size={18} color={on ? accent : t.muted} />{label}
              </button>);
          })}
        </div>

        {/* input adaptif */}
        {chan === 'whatsapp' ?
        waKnown && !editWa ?
        <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Kirim ke nomor</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px solid ' + t.primary, borderRadius: t.radius, padding: '0 14px', height: 56, background: t.primarySoft }}>
              <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: t.surface, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="whatsapp" size={18} color={t.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: t.ink, letterSpacing: 0.3 }}>{fmtWa(waDigits)}</div>
                <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Nomor akun kamu</div>
              </div>
              <button onClick={() => setEditWa(true)} style={{ flexShrink: 0, border: 'none', background: 'none', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 4, WebkitTapHighlightColor: 'transparent' }}>Ganti</button>
            </div>
            <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim sebagai pesan WhatsApp.</p>
          </div> :
        <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Nomor WhatsApp</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid ' + (waValid ? t.primary : t.line), borderRadius: t.radius, padding: '0 14px', height: 56, background: t.surface2, transition: 'border-color .15s' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>+62</span>
              <div style={{ width: 1, height: 22, background: t.line }} />
              <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="8xx xxxx xxxx" type="tel" autoFocus={!waKnown} style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontFamily: t.fontBody, fontSize: 16, color: t.ink, letterSpacing: 0.3 }} />
            </div>
            <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim sebagai pesan WhatsApp ke nomor ini.</p>
          </div> :

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Alamat email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" type="email" autoFocus style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid ' + (emailValid ? t.primary : t.line), borderRadius: t.radius, padding: '0 16px', height: 56, background: t.surface2, outline: 'none', fontFamily: t.fontBody, fontSize: 16, color: t.ink, transition: 'border-color .15s' }} />
          <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk dikirim ke alamat email ini.</p>
        </div>}
      </div>

      {/* footer */}
      <div style={{ flexShrink: 0, padding: '14px 18px calc(14px + env(safe-area-inset-bottom))', borderTop: '1px solid ' + t.line, background: t.surface }}>
        <Button full icon="share" disabled={!valid} onClick={send}>Kirim struk</Button>
      </div>
    </div>);
}

// ── BillRiwayat — section riwayat di dalam Order List tab (Open Bill) ────
function BillRiwayat({ orders }) {
  const t = useTheme();
  if (!orders || orders.length === 0) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: t.line }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <Icon name="clock" size={13} color={t.muted} />Riwayat Pesanan
        </span>
        <div style={{ flex: 1, height: 1, background: t.line }} />
      </div>
      {[...orders].reverse().map((order) => (
        <div key={order.id} style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, marginBottom: 10, overflow: 'hidden', boxShadow: t.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid ' + t.line }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.ink }}>Pesanan #{order.num}</div>
              <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{order.time}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Money value={order.subtotal != null ? order.subtotal : order.total} style={{ fontSize: 14, fontWeight: 800, color: t.ink }} />
              <div style={{ fontSize: 11, color: t.primary, fontWeight: 700, marginTop: 2 }}>Terkirim ✓</div>
            </div>
          </div>
          <div style={{ padding: '6px 16px 10px' }}>
            {order.lines.map((l, i) => (
              <div key={l.uid || i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: i < order.lines.length - 1 ? '1px solid ' + t.line : 'none', alignItems: 'flex-start' }}>
                <span style={{ minWidth: 20, height: 20, borderRadius: 6, background: l.free ? t.primarySoft : t.surface2, color: l.free ? t.primary : t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{l.qty}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>{l.name}</span>
                  {l.options && l.options.length > 0 && <span style={{ fontSize: 11, color: t.muted, display: 'block' }}>{l.options.join(' · ')}</span>}
                </div>
                {!l.free
                  ? <Money value={l.unit * l.qty} style={{ fontSize: 12.5, fontWeight: 600, color: t.muted, flexShrink: 0 }} />
                  : <span style={{ fontSize: 11.5, fontWeight: 700, color: t.primary, flexShrink: 0 }}>Gratis</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { ConfirmScreen, ProcessingScreen, BillScreen, BillRiwayat, SettleScreen, SuccessScreen, ShareReceiptSheet, ShareReceiptScreen, PaymentPicker, ReadLine, PromoMark });