// screens-checkout.jsx — Confirm (locked), Payment picker, Processing, Open Bill, Settle, Success.
const { useState: useStateK, useEffect: useEffectK } = React;

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
        {line.options && line.options.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{line.options.join(' · ')}</div>}
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
          <button key={p.id} onClick={() => onChange(p.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer',
            background: on ? t.primarySoft : t.surface, border: '1.5px solid ' + (on ? t.primary : t.line),
            borderRadius: t.radiusSm, WebkitTapHighlightColor: 'transparent'
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: on ? t.primary : t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: on ? t.onPrimary : t.primary, transition: 'all .15s' }}>
              <Icon name={p.kind === 'qr' ? 'qr' : 'receipt'} size={20} color={on ? t.onPrimary : t.primary} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14.5, color: t.ink }}>{p.label}</span>

              </div>
              <div style={{ fontSize: 12, color: t.muted }}>{p.sub}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 999, border: '2px solid ' + (on ? t.primary : t.faint), background: on ? t.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

// ── Order summary — baris rincian harga (dipakai ulang 3 gaya) ──
function BreakdownRows({ subtotal, tax, rounding, itemDiscLines }) {
  const t = useTheme();
  const app = useApp();
  const bill = app.computeBill();
  const freeLines = app.cart.filter((l) => l.free);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: t.muted }}>Subtotal</span>
        <Money value={subtotal} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
      </div>
      {app.applied.map((a) => {
        const p = promoById(a.id);
        if (!p || p.kind === 'free-item') return null;
        const amt = p.kind === 'percent' ? Math.min(p.cap || Infinity, Math.round(bill.paidSubtotal * p.value)) : p.kind === 'fixed' ? p.value : 0;
        return (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.primary, fontWeight: 600, minWidth: 0 }}>
              <Icon name="tag" size={13} color={t.primary} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.primary, flexShrink: 0 }}>– {rupiah(amt)}</span>
          </div>);

      })}
      {itemDiscLines.map((d) =>
      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.primary, fontWeight: 600, minWidth: 0 }}>
            <Icon name="tag" size={13} color={t.primary} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.primary, flexShrink: 0 }}>– {rupiah(d.amount)}</span>
        </div>
      )}
      {freeLines.map((l) => {
        const it = itemById(l.itemId);
        const full = (it ? it.price : 0) * l.qty;
        return (
          <div key={l.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.primary, fontWeight: 600, minWidth: 0 }}>
              <Icon name="tag" size={14} color={t.primary} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Gratis {l.name}</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.primary, flexShrink: 0 }}>– {rupiah(full)}</span>
          </div>);

      })}
      {bill.service > 0 &&
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: t.muted }}>Service Charge ({Math.round(bill.serviceRate * 100)}%)</span>
          <Money value={bill.service} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
        </div>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: t.muted }}>Pajak ({Math.round(app.TAX_RATE * 100)}%){bill.taxInclusive ? ' · termasuk' : ''}</span>
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
  const variant = app.checkoutSummary || 'struk';
  const qtyTotal = app.cart.reduce((s, l) => s + l.qty, 0);
  const items = expanded ? app.cart : app.cart.slice(0, 1);
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
                    <Money value={l.unit * l.qty} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink, flexShrink: 0 }} />}
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
                  <div style={{ fontSize: 14, fontWeight: 800, color: t.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{rupiah(l.unit * l.qty)}</div>}
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
          <span style={{ fontSize: 22, fontWeight: 800, color: t.primary, fontVariantNumeric: 'tabular-nums' }}>{rupiah(total)}</span>
        </div>
        </div>
      </div>);

  }

  // ===== FLAT — tanpa kotak, hairline + ruang lega =====
  if (variant === 'flat') {
    return (
      <div style={{ padding: '2px 2px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Ringkasan Pesanan</div>
        <div>
          {items.map((l, i) =>
          <div key={l.uid} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: t.muted, minWidth: 22, marginTop: 1 }}>{l.qty}×</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: t.ink, flex: 1, lineHeight: 1.3 }}>{l.name}</span>
                  {l.free ?
                <FreePrice line={l} size={12.5} /> :
                <span style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{rupiah(l.unit * l.qty)}</span>}
                </div>
                {l.options && l.options.length > 0 && <div style={{ fontSize: 12, color: t.faint, marginTop: 3 }}>{l.options.join(' · ')}</div>}
                {l.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{l.notes}"</div>}
              </div>
            </div>
          )}
        </div>
        {app.cart.length > 1 &&
        <button onClick={() => setExpanded((x) => !x)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, padding: '12px 0 0', display: 'inline-flex', alignItems: 'center', gap: 5, WebkitTapHighlightColor: 'transparent' }}>
            {expanded ? 'Tampilkan lebih sedikit' : `Tampilkan ${moreCount} item lainnya`}
            <Icon name="chevron" size={14} color={t.primary} style={{ transform: `rotate(${expanded ? -90 : 90}deg)` }} />
          </button>}
        <div style={{ height: 1, background: t.line, margin: '16px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BreakdownRows subtotal={subtotal} tax={tax} rounding={rounding} itemDiscLines={itemDiscLines} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>Total</span>
          <span style={{ fontSize: 25, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{rupiah(total)}</span>
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
              <Money value={l.unit * l.qty} style={{ fontWeight: 700, fontSize: 13.5, color: t.ink, flexShrink: 0 }} />}
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

function ConfirmScreen() {
  const t = useTheme();
  const app = useApp();
  const isOpenBill = app.mode === 'dyn-openbill';
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
      const digits = phone.replace(/\D/g, '');
      if (digits.length >= 8) app.setPhone(digits);
      app.askConfirm({
        title: 'Kirim pesanan ke dapur?',
        message: 'Promo hanya berlaku untuk order ini dan pesanan tidak bisa digabung setelah dikirim.',
        confirmLabel: 'Ya, Kirim',
        cancelLabel: 'Cek lagi',
        tone: 'primary',
        onConfirm: () => app.submitOrder({ name: name.trim(), phone: digits })
      });
      return;
    }
    if (app.payment === 'cash') app.go('cashstatus');else
    app.go('processing');
  };

  const ctaLabel = isOpenBill ? 'Kirim ke Dapur' : app.payment === 'cash' ? 'Bayar di Kasir' : 'Bayar';
  const canPay = isOpenBill ? true : !!app.payment && verified;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Konfirmasi Pesanan" onBack={app.back} />

      {/* ── scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 14px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* info pesanan — meja · nomor (read-only) */}
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '11px 14px' }}>
          {ctxRows.map((r) => {
                const tableNum = app.table ? String(app.table).replace(/^Meja\s*/i, '') : null;
                // Dine-in dgn meja → tampilkan meja saja ("Dine In" jadi mubazir krn ada no. meja)
                const dineWithTable = r.type !== 'takeaway' && tableNum;
                return (
                  <span key={r.type} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: t.ink, whiteSpace: 'nowrap' }}>
                <Icon name={dineWithTable ? 'table' : r.type === 'takeaway' ? 'takeaway' : 'dineIn'} size={16} color={dineWithTable ? t.primary : t.muted} stroke={1.7} />
                {dineWithTable ? 'Meja ' + tableNum : r.label}
              </span>
            </span>);
              })}
          {isOpenBill && !verified &&
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '4px 11px', fontSize: 11.5, fontWeight: 800, letterSpacing: 0.3 }}>
                <Icon name="receipt" size={12} color={t.primary} />Open Bill
              </span>
              }
          {verified &&
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: t.muted, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'auto' }}>
              <Icon name="phone" size={13} color={t.primary} />
              <span>+62 {app.phoneHint}</span>
              <Icon name="check" size={12} color={t.primary} stroke={3} />
            </span>
              }
          </div>
        </div>

        {/* atas nama — field opsional berlabel, terpisah dari info card (read-only) */}
        {!isOpenBill && verified &&
          <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Atas Nama <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: 'none' }}>· opsional</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.surface, border: '1.5px solid ' + (name ? t.primary : t.line), borderRadius: t.radius, boxShadow: t.shadow, padding: '0 14px', transition: 'border-color .15s' }}>
            <Icon name="user" size={17} color={name ? t.primary : t.faint} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama pemesan" maxLength={28}
              style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '14px 0', fontFamily: t.fontBody, fontSize: 14.5, color: t.ink, outline: 'none' }} />
            {name &&
              <button onClick={() => setName('')} aria-label="Hapus nama" style={{ border: 'none', background: t.surface2, borderRadius: 999, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
              <Icon name="close" size={12} color={t.muted} />
            </button>}
          </div>
        </div>}

        {/* informasi pelanggan — hanya saat belum terverifikasi */}
        {!isOpenBill && !verified &&
          <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
            <div style={{ padding: '13px 16px', borderBottom: '1px solid ' + t.line }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>Informasi Pelanggan</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* nama */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.muted, marginBottom: 6 }}>Nama <span style={{ fontWeight: 400, color: t.faint }}>(opsional)</span></div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="user" size={15} color={t.faint} /></div>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Budi Santoso"
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid ' + (name ? t.primary : t.line), borderRadius: t.radiusSm, padding: '11px 12px 11px 36px', fontFamily: t.fontBody, fontSize: 14, color: t.ink, background: t.surface2, outline: 'none', transition: 'border-color .15s' }} />
                    </div>
                  </div>
                  {/* nomor wa */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.muted, marginBottom: 6 }}>Nomor WhatsApp</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="phone" size={15} color={t.faint} /></div>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 8xx xxxx xxxx" type="tel" disabled={otpSent}
                      style={{ width: '100%', boxSizing: 'border-box', border: '1px solid ' + (validPhone ? t.primary : t.line), borderRadius: t.radiusSm, padding: '11px 12px 11px 36px', fontFamily: t.fontBody, fontSize: 14, color: t.ink, background: t.surface2, outline: 'none', transition: 'border-color .15s' }} />
                      </div>
                      {!otpSent &&
                    <button onClick={sendOtp} disabled={!validPhone || sending} style={{ flexShrink: 0, padding: '0 14px', borderRadius: t.radiusSm, border: 'none', background: validPhone ? t.primary : t.surface2, color: validPhone ? t.onPrimary : t.faint, fontWeight: 700, fontSize: 13, fontFamily: t.fontBody, cursor: validPhone ? 'pointer' : 'default', transition: 'background .15s' }}>{sending ? '...' : 'Kirim OTP'}</button>
                    }
                    </div>
                  </div>
                  {/* otp */}
                  {otpSent &&
                <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: t.muted, marginBottom: 6 }}>Kode OTP <span style={{ fontWeight: 400, color: t.faint }}>· via WhatsApp</span></div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="· · · ·" maxLength={6} type="tel"
                    style={{ flex: 1, border: '1px solid ' + (otp.length >= 4 ? t.primary : t.line), borderRadius: t.radiusSm, padding: '11px 14px', fontFamily: t.fontBody, fontSize: 20, letterSpacing: 8, color: t.ink, background: t.surface2, outline: 'none', transition: 'border-color .15s' }} />
                        <button onClick={verifyOtp} disabled={otp.length < 4} style={{ flexShrink: 0, padding: '0 14px', borderRadius: t.radiusSm, border: 'none', background: otp.length >= 4 ? t.primary : t.surface2, color: otp.length >= 4 ? t.onPrimary : t.faint, fontWeight: 700, fontSize: 13, fontFamily: t.fontBody, cursor: otp.length >= 4 ? 'pointer' : 'default', transition: 'background .15s' }}>Verifikasi</button>
                      </div>
                      <button onClick={() => {setOtpSent(false);setOtp('');}} style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.faint, fontSize: 12, marginTop: 4, padding: '6px 0' }}>Kirim ulang kode</button>
                    </div>
                }
                </div>
              }
            </div>
          </div>
          }

        {/* Info pelanggan opsional — hanya Open Bill: nama + no. HP dalam satu baris */}
        {isOpenBill &&
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Data Pelanggan <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: 'none' }}>· opsional</span></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + (name ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, padding: '0 12px', transition: 'border-color .15s' }}>
                <Icon name="user" size={15} color={t.faint} />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" maxLength={28}
                style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '12px 0', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid ' + (validPhone ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, padding: '0 12px', transition: 'border-color .15s' }}>
                <Icon name="phone" size={15} color={t.faint} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nomor HP" type="tel"
                style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', padding: '12px 0', fontFamily: t.fontBody, fontSize: 14, color: t.ink, outline: 'none' }} />
              </div>
            </div>
          </div>
          }

        {/* ringkasan pesanan — 3 gaya via tweak: struk / flat / ringkas */}
        <OrderSummary subtotal={subtotal} tax={tax} total={total} rounding={rounding} itemDiscLines={itemDiscLines} expanded={expanded} setExpanded={setExpanded} />

        {/* metode pembayaran — flat, tanpa kartu pembungkus */}
        {!isOpenBill &&
          <div style={{ padding: '2px 2px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>Metode Pembayaran</div>
            <PaymentPicker value={app.payment} onChange={app.setPayment} />
          </div>
          }

        {/* Open Bill: tak ada metode bayar di sini (bayar di akhir) — info singkat biar tak kosong */}
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
      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 16px calc(16px + env(safe-area-inset-bottom))' }}>
        {app.checkoutSummary === 'sheet' ?
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: t.muted, fontWeight: 500 }}>Total Pembayaran</div>
              <Money value={total} style={{ fontSize: 20, fontWeight: 800, color: t.ink }} />
            </div>
            <button onClick={handlePay} disabled={!canPay} style={{
            flexShrink: 0, padding: '14px 24px', borderRadius: t.radius, border: 'none',
            background: canPay ? t.primary : t.surface2,
            color: canPay ? t.onPrimary : t.faint,
            fontWeight: 700, fontSize: 15, fontFamily: t.fontBody,
            cursor: canPay ? 'pointer' : 'default',
            transition: 'background .15s, color .15s',
            boxShadow: canPay ? '0 4px 14px ' + hexA(t.primary, 0.35) : 'none'
          }}>{ctaLabel}</button>
          </div> :

        <button onClick={handlePay} disabled={!canPay} style={{
          width: '100%', padding: '15px 24px', borderRadius: t.radius, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: canPay ? t.primary : t.surface2,
          color: canPay ? t.onPrimary : t.faint,
          fontWeight: 700, fontSize: 15.5, fontFamily: t.fontBody,
          cursor: canPay ? 'pointer' : 'default',
          transition: 'background .15s, color .15s',
          boxShadow: canPay ? '0 4px 14px ' + hexA(t.primary, 0.35) : 'none'
        }}>
            <span>{ctaLabel}</span>
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
  const [secs, setSecs] = useStateK(300);
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title={isQr ? 'Pembayaran QRIS' : 'Memproses'} onBack={app.back} />

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
                {/* timer masa berlaku QR — 5 menit */}
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
            <Button full onClick={checkStatus}>{checkingPay ? 'Mengecek status…' : 'Update Status Pesanan'}</Button>
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

// ── Open Bill running view ─────────────────────────────────
function BillScreen({ embedded, navbarMode }) {
  const t = useTheme();
  const app = useApp();
  const orders = app.orders;
  const grand = app.grandTotal();

  // Tab dapat dibuka kapan saja — termasuk sebelum ada order terkirim.
  if (orders.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
        <TopBar title="Order List" right={app.table &&
        <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 12px', fontSize: 13, fontWeight: 800 }}>
          <Icon name="table" size={14} color={t.primary} />Meja {String(app.table).replace(/^Meja\s*/i, '')}
        </span>} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '30px 34px 48px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: t.surface2, color: t.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
            <Icon name="receipt" size={34} />
          </div>
          <p style={{ color: t.ink, fontSize: 17, fontWeight: 700, textAlign: 'center', margin: 0 }}>Belum ada pesanan</p>
          <p style={{ color: t.muted, fontSize: 14, textAlign: 'center', margin: 0, lineHeight: 1.5, textWrap: 'pretty' }}>Lihat-lihat menu dulu, tambahkan kapan pun kamu siap.</p>
          {!embedded &&
          <button onClick={() => app.go('menu', { root: true })} style={{ marginTop: 14, border: 'none', cursor: 'pointer', background: t.primary, color: t.onPrimary, borderRadius: t.radius, padding: '12px 22px', fontFamily: t.fontBody, fontSize: 14.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 22px ' + hexA(t.primary, 0.3), WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="back" size={18} color={t.onPrimary} /> Kembali ke Menu
          </button>}
        </div>
      </div>);

  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Order List" right={app.table &&
      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '6px 12px', fontSize: 13, fontWeight: 800 }}>
          <Icon name="table" size={14} color={t.primary} />Meja {String(app.table).replace(/^Meja\s*/i, '')}
        </span>} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: navbarMode ? '4px 18px calc(110px + env(safe-area-inset-bottom))' : '4px 18px 200px' }}>

        {orders.map((o) =>
        <div key={o.id} style={{ marginBottom: 12, background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '4px 16px', boxShadow: t.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 2px' }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }}>Order #{o.num}</span>
            </div>
            {o.lines.map((l) => <ReadLine key={l.uid} line={l} />)}
            {o.applied.length > 0 &&
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 0', fontSize: 12.5, color: t.primary, fontWeight: 600 }}>
                <Icon name="tag" size={14} /> {o.applied.map((a) => promoById(a.id).title).join(', ')}
              </div>
          }
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid ' + t.line }}>
              <span style={{ fontSize: 13, color: t.muted }}>Subtotal order</span>
              <Money value={o.total} style={{ fontWeight: 700, fontSize: 14, color: t.ink }} />
            </div>
          </div>
        )}

        {!embedded &&
        <button onClick={() => app.go('menu', { root: true })} style={{ width: '100%', border: '1.5px dashed ' + t.lineStrong, background: t.surface, borderRadius: t.radius, padding: '14px 0', cursor: 'pointer', color: t.primary, fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="back" size={18} color={t.primary} /> Kembali ke Menu
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
  const grand = app.grandTotal();

  const handleSettle = () => {
    if (!app.payment) return;
    // Open Bill: no. HP opsional (sudah ditawarkan di konfirmasi) — langsung proses.
    app.go('processing', { settle: true, amount: grand });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Bayar Tagihan" sub={(app.table || 'Meja') + ' · ' + app.orders.length + ' order'} onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '4px 18px 200px' }}>
        <div style={{ background: t.surface, borderRadius: t.radius, border: '1px solid ' + t.line, padding: '4px 16px', boxShadow: t.shadow, marginBottom: 16 }}>
          {app.orders.map((o) =>
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid ' + t.line }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: t.ink }}>Order #{o.num}</div>
                <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {o.lines.map((l) =>
                <div key={l.uid} style={{ fontSize: 12, color: t.muted, lineHeight: 1.35 }}>{l.qty > 1 ? l.qty + '× ' : ''}{l.name}</div>
                )}
                </div>
              </div>
              <Money value={o.total} style={{ fontWeight: 700, fontSize: 14, color: t.ink }} />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>Total</span>
            <Money value={grand} style={{ fontWeight: 800, fontSize: 20, color: t.primary }} />
          </div>
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: t.ink }}>Metode Pembayaran</h3>
        <PaymentPicker value={app.payment} onChange={app.setPayment} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px calc(20px + env(safe-area-inset-bottom))', background: `linear-gradient(to top, ${t.bg} 70%, transparent)`, zIndex: 40 }}>
        <Button full disabled={!app.payment} onClick={handleSettle}>Bayar {rupiah(grand)}</Button>
      </div>
    </div>);

}

// ── Success ────────────────────────────────────────────────
function SuccessScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const paid = params && params.amount != null ? params.amount : 0;
  const isOpenBill = app.mode === 'dyn-openbill';
  const [tick, setTick] = useStateK(0);

  // animate the progress ring
  useEffectK(() => {
    const id = setTimeout(() => setTick(1), 100);
    return () => clearTimeout(id);
  }, []);

  const steps = ['Dipesan', 'Disiapkan', 'Diantar'];
  const activeStep = 1; // always "Disiapkan" when arriving here

  const pay = paymentById(app.payment) || PAYMENTS[0];
  const billLines = app.cart.length ? app.cart : app.orders.reduce((a, o) => a.concat(o.lines), []);
  const itemCount = billLines.reduce((s, l) => s + l.qty, 0);
  const hasBreakdown = app.cart.length > 0;
  const bill = app.computeBill();
  const totalShown = hasBreakdown ? bill.total : paid > 0 ? paid : billLines.reduce((s, l) => s + l.unit * l.qty, 0);
  const sDiscLines = app.itemDiscountLines();
  const mixedType = new Set(billLines.map((l) => l.type === 'takeaway' ? 'takeaway' : 'dinein')).size > 1;
  const [detOpen, setDetOpen] = useStateK(true);
  const [copied, setCopied] = useStateK(false);
  const [stamp] = useStateK(() => {
    const now = new Date();
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return {
      date: now.getDate() + ' ' + mo[now.getMonth()] + ' ' + now.getFullYear() + ', ' + hh + '.' + mm,
      time: hh + '.' + mm,
      txn: 'S.' + (100000000 + Math.floor(Math.random() * 899999999))
    };
  });
  const copyTxn = () => {
    try {navigator.clipboard && navigator.clipboard.writeText(stamp.txn);} catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const totalDisc = bill.discount + bill.itemDisc + bill.freeDisc;
  // Open Bill: cart sudah kosong setelah submit → computeBill() = 0. Rekonstruksi rincian
  // dari baris order (billLines) supaya Subtotal & pajak konsisten dengan total.
  const paidSub = billLines.reduce((s, l) => s + (l.free ? 0 : l.unit * l.qty), 0);
  const freeVal = billLines.reduce((s, l) => s + (l.free ? ((itemById(l.itemId) || {}).price || 0) * l.qty : 0), 0);
  const subtotalShown = hasBreakdown ? bill.subtotal : paidSub + freeVal;
  const totalDiscShown = hasBreakdown ? totalDisc : freeVal;
  const taxServiceShown = Math.max(0, totalShown - (subtotalShown - totalDiscShown));
  const firstType = billLines[0] && billLines[0].type === 'takeaway' ? 'takeaway' : 'dinein';
  const typeLabel = mixedType ? 'Campuran' : firstType === 'takeaway' ? 'Take Away' : 'Dine In';
  const pills = [app.table ? 'Meja ' + String(app.table).replace(/^Meja\s*/i, '') : typeLabel, '#' + app.orderRef, pay.label];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.surface }}>

      <div style={{ flex: 1, overflow: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>

        {/* HERO — warna primary */}
        <div style={{ position: 'relative', padding: '58px 24px 42px', textAlign: 'center', background: 'linear-gradient(157deg, ' + shade(t.primary, 28) + ' 0%, ' + t.primary + ' 50%, ' + shade(t.primary, -32) + ' 100%)', overflow: 'hidden' }}>
          <style>{`@keyframes om-ripple{0%{transform:scale(.6);opacity:.45}100%{transform:scale(1.85);opacity:0}}@keyframes om-check-draw{to{stroke-dashoffset:0}}`}</style>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 116, height: 116, borderRadius: 999, background: 'radial-gradient(circle, ' + hexA('#ffffff', 0.34) + ', transparent 68%)' }} />
            <div style={{ position: 'absolute', width: 74, height: 74, borderRadius: 999, border: '2px solid ' + hexA('#ffffff', 0.45), animation: 'om-ripple 2.2s ease-out infinite' }} />
            <div style={{ position: 'absolute', width: 74, height: 74, borderRadius: 999, border: '2px solid ' + hexA('#ffffff', 0.45), animation: 'om-ripple 2.2s ease-out 1.1s infinite' }} />
            <div style={{ position: 'absolute', width: 88, height: 88, borderRadius: 999, border: '1.5px solid ' + hexA('#ffffff', 0.38) }} />
            <div style={{ position: 'relative', width: 74, height: 74, borderRadius: 999, background: '#ffffff', boxShadow: '0 10px 26px ' + hexA('#05312b', 0.34), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'om-pop .5s cubic-bezier(.2,1.3,.4,1)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7" stroke="#1FAE5A" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'om-check-draw .55s .28s cubic-bezier(.2,.85,.3,1) forwards' }} />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 16, fontFamily: t.fontDisplay, fontWeight: 800, fontSize: 22, color: '#ffffff', letterSpacing: '0.01em' }}>{isOpenBill ? 'Tagihan lunas' : 'Pembayaran berhasil'}</div>
          <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 46, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', marginTop: 10, fontVariantNumeric: 'tabular-nums' }}>{rupiah(totalShown)}</div>
        </div>

        {/* SHEET putih */}
        <div style={{ position: 'relative', marginTop: -20, background: t.surface, borderRadius: '22px 22px 0 0', padding: '22px 22px 10px', minHeight: 140 }}>

          {/* pesananmu */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>Pesananmu</span>
            <span style={{ fontSize: 12.5, color: t.muted, fontWeight: 600 }}>{typeLabel}{app.table ? ' · Meja ' + String(app.table).replace(/^Meja\s*/i, '') : ''}</span>
          </div>

          {billLines.map((l, i) =>
          <div key={l.uid} style={{ padding: '9px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 11 }}>
              <span style={{ minWidth: 22, fontSize: 13, fontWeight: 800, color: t.muted, fontVariantNumeric: 'tabular-nums' }}>{l.qty}&times;</span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: t.ink, fontWeight: 600 }}>{l.name}</span>
              {l.free ?
              <FreePrice line={l} size={13.5} /> :
              <Money value={l.unit * l.qty} style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, flexShrink: 0 }} />}
            </div>
            {l.options && l.options.length > 0 &&
            <OptLines options={l.options} size={12} style={{ paddingLeft: 33 }} />}
          </div>
          )}

          {/* rincian ringkas */}
          <div style={{ borderTop: '1px solid ' + t.line, marginTop: 14, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 1 }}>Rincian Pembayaran</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.muted }}>Subtotal</span>
              <Money value={subtotalShown} style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }} />
            </div>
            {totalDiscShown > 0 &&
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.muted }}>Diskon promo</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: t.primary, fontVariantNumeric: 'tabular-nums' }}>− {rupiah(totalDiscShown)}</span>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.muted }}>Pajak & layanan</span>
              <span style={{ fontSize: 13.5, fontWeight: taxServiceShown > 0 ? 700 : 600, color: taxServiceShown > 0 ? t.ink : t.muted }}>{taxServiceShown > 0 ? rupiah(taxServiceShown) : 'Termasuk'}</span>
            </div>
          </div>

          {/* meta transaksi */}
          <div style={{ borderTop: '1px solid ' + t.line, marginTop: 14, paddingTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 4 }}>Detail Transaksi</div>
            {[
            ['Metode', <span style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{pay.label}</span>],
            ['Tanggal', <span style={{ fontSize: 13, fontWeight: 700, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{stamp.date}</span>],
            ['ID Transaksi',
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{stamp.txn}</span>
                  <button onClick={copyTxn} aria-label="Salin ID" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', padding: 0, color: copied ? t.primary : t.faint, WebkitTapHighlightColor: 'transparent' }}>
                    <Icon name={copied ? 'check' : 'copy'} size={15} stroke={2.2} />
                  </button>
                </span>]].
            map(([label, val], i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 0' }}>
                <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>{label}</span>
                {val}
              </div>
            )}
          </div>

          {/* bagikan struk — buka HALAMAN PENUH pilih channel (WhatsApp / Email) */}
          <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px dashed ' + t.line }}>
            <Button full variant="ghost" icon="share" onClick={() => app.shareStyle === 'page' ? app.go('share', { total: totalShown, txn: stamp.txn, date: stamp.date, table: app.table, ref: app.orderRef, payLabel: pay.label, typeLabel }) : app.openSheet('shareReceipt', { total: totalShown, txn: stamp.txn, date: stamp.date, table: app.table, payLabel: pay.label, typeLabel })}>Bagikan struk</Button>
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, background: t.surface, borderTop: '1px solid ' + t.line, padding: '12px 18px calc(18px + env(safe-area-inset-bottom))', boxShadow: '0 -6px 20px ' + hexA(t.ink, 0.05) }}>
        <Button full onClick={app.reset}>Kembali ke Menu</Button>
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
      (waKnown && !editWa ?
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
        </div>) :

      <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: 'block', marginBottom: 7 }}>Alamat email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" type="email" autoFocus style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid ' + (emailValid ? t.primary : t.line), borderRadius: t.radius, padding: '0 16px', height: 54, background: t.surface2, outline: 'none', fontFamily: t.fontBody, fontSize: 16, color: t.ink, transition: 'border-color .15s' }} />
          <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Struk PDF dikirim ke alamat email ini.</p>
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

Object.assign(window, { ConfirmScreen, ProcessingScreen, BillScreen, SettleScreen, SuccessScreen, ShareReceiptSheet, ShareReceiptScreen, PaymentPicker, ReadLine });