// screens-cashstatus.jsx — "Status Pesanan" untuk pembayaran Bayar di Kasir (tunai).
// Status berpindah otomatis: Menunggu Pembayaran → Pembayaran Diterima → Pesanan Diproses.
const { useState: useStateCS, useEffect: useEffectCS, useRef: useRefCS } = React;

const ID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function fmtDateID(d) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}.${mm}`;
}

// ── Jam pasir CSS beranimasi ───────────────────────────────
function Hourglass({ color, sand }) {
  return (
    <div style={{ display: 'inline-block' }}>
      <style>{`
        @keyframes om-hg-flip {
          0%, 34% { transform: rotate(0deg); }
          50%, 84% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes om-hg-stream {
          0%, 30% { opacity: 0; }
          40%, 78% { opacity: 1; }
          88%, 100% { opacity: 0; }
        }
        @keyframes om-hg-top {
          0%, 30% { transform: scaleY(1); }
          80%, 100% { transform: scaleY(0.12); }
        }
        @keyframes om-hg-bot {
          0%, 30% { transform: scaleY(0.12); }
          80%, 100% { transform: scaleY(1); }
        }
        .om-hg { animation: om-hg-flip 3s cubic-bezier(.7,0,.3,1) infinite; transform-origin: 50% 50%; }
        .om-hg-stream { animation: om-hg-stream 3s linear infinite; }
        .om-hg-top { transform-origin: 50% 0%;  animation: om-hg-top 3s ease-in infinite; }
        .om-hg-bot { transform-origin: 50% 100%; animation: om-hg-bot 3s ease-out infinite; }
      `}</style>
      <svg className="om-hg" width="64" height="80" viewBox="0 0 48 60" aria-hidden="true">
        {/* pelat atas & bawah */}
        <path d="M9 4h30M9 56h30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* badan kaca */}
        <path d="M12 5 L36 5 L26 28 Q24 30 24 30 Q24 30 22 28 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 55 L36 55 L26 32 Q24 30 24 30 Q24 30 22 32 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {/* pasir atas (menyusut) */}
        <g className="om-hg-top">
          <path d="M14.5 9 L33.5 9 L25.5 27.5 Q24 29 24 29 Q24 29 22.5 27.5 Z" fill={sand} />
        </g>
        {/* aliran pasir */}
        <line className="om-hg-stream" x1="24" y1="30" x2="24" y2="44" stroke={sand} strokeWidth="2" strokeLinecap="round" />
        {/* timbunan pasir bawah (tumbuh) */}
        <g className="om-hg-bot">
          <path d="M14.5 51 L33.5 51 L25.5 32.5 Q24 31 24 31 Q24 31 22.5 32.5 Z" fill={sand} />
        </g>
      </svg>
    </div>);

}

function CashStatusScreen({ params }) {
  const t = useTheme();
  const app = useApp();

  // 0 = menunggu, 1 = diterima, 2 = diproses
  const [phase, setPhase] = useStateCS(0);
  const [ref] = useStateCS(() => 'REF-' + String(app.orderRef).padStart(6, '0'));
  const [placedAt] = useStateCS(() => new Date());
  const [checking, setChecking] = useStateCS(false);
  const [checkMsg, setCheckMsg] = useStateCS(null);
  // Simulasi: kasir mengonfirmasi pembayaran tunai setelah beberapa detik.
  const paidRef = useRefCS(false);
  useEffectCS(() => {
    const a = setTimeout(() => { paidRef.current = true; }, 4500);
    return () => clearTimeout(a);
  }, []);
  // Setelah pembayaran diterima → otomatis lanjut "Diproses".
  useEffectCS(() => {
    if (phase !== 1) return;
    const b = setTimeout(() => setPhase(2), 2600);
    return () => clearTimeout(b);
  }, [phase]);
  // Cek status — manual, seperti QRIS. Hanya lanjut bila kasir sudah konfirmasi.
  const checkStatus = () => {
    if (checking || phase >= 1) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (paidRef.current) {
        setCheckMsg(null);
        setPhase(1);
        // Navigate to success screen after brief confirmation
        setTimeout(() => {
          app.go('success', { root: true, payMethod: 'Bayar di Kasir' });
        }, 800);
      }
      else setCheckMsg({ ok: false, text: 'Pembayaran belum diterima kasir. Selesaikan pembayaran, lalu cek lagi.' });
    }, 1100);
  };

  const isOpenBill = app.mode === 'dyn-openbill';
  const lines = app.cart.length ? app.cart : app.orders.reduce((a, o) => a.concat(o.lines), []);
  const cartTypes = [...new Set(lines.map((l) => l.type === 'takeaway' ? 'takeaway' : 'dinein'))];
  const mixedType = cartTypes.length > 1;
  const isDine = (cartTypes[0] || (app.orderType === 'dinein' ? 'dinein' : 'takeaway')) !== 'takeaway';
  const typeLabel = mixedType ? 'Campuran' : isDine ? 'Dine In' : 'Take Away';
  const qtyTotal = lines.reduce((s, l) => s + l.qty, 0);
  const diCount = lines.filter((l) => (l.type === 'takeaway' ? 'takeaway' : 'dinein') === 'dinein').reduce((s, l) => s + l.qty, 0);
  const taCount = qtyTotal - diCount;
  const typeRows = mixedType ?
  [{ type: 'dinein', label: 'Dine In', n: diCount, table: true },
   { type: 'takeaway', label: 'Take Away', n: taCount, table: false }] :
  [{ type: isDine ? 'dinein' : 'takeaway', label: isDine ? 'Dine In' : 'Take Away', n: qtyTotal, table: isDine }];
  const bill = app.computeBill();
  const freeLines = lines.filter((l) => l.free);
  // Open Bill: rincian dihitung dari settleBill (PPN sekali untuk seluruh tagihan)
  const obDiscount = (params && params.discount) || 0;
  const sb = isOpenBill ? app.settleBill(obDiscount) : null;
  const discount = isOpenBill ? obDiscount : bill.discount;
  const subtotal = isOpenBill ? sb.subtotal : bill.subtotal;
  const itemDisc = isOpenBill ? sb.itemDisc : bill.itemDisc;
  const service = isOpenBill ? sb.service : bill.service;
  const serviceRate = isOpenBill ? sb.serviceRate : bill.serviceRate;
  const tax = isOpenBill ? sb.tax : bill.tax;
  const rounding = isOpenBill ? sb.rounding : bill.rounding;
  const total = isOpenBill ? (params && params.amount != null ? params.amount : sb.total) : bill.total;

  const PHASES = [
    {
      title: 'Menunggu Pembayaran',
      sub: 'Terima kasih atas pesananmu. Silakan selesaikan pembayaran di kasir agar pesanan segera diproses.',
      tint: t.accent,
      tintSoft: t.accentSoft,
    },
    {
      title: 'Pembayaran Diterima',
      sub: 'Pembayaran sudah dikonfirmasi kasir. Pesananmu akan segera disiapkan.',
      tint: t.primary,
      tintSoft: t.primarySoft,
    },
    {
      title: 'Pesanan Diproses',
      sub: 'Dapur sedang menyiapkan pesananmu. Mohon tunggu sebentar, ya.',
      tint: t.primary,
      tintSoft: t.primarySoft,
    },
  ];
  const ph = PHASES[phase];

  const cardStyle = { background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow };
  const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Status Pesanan" onBack={app.back} />

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 18px 120px' }}>

        {/* ── HERO: ikon status + judul ── */}
        <div style={{ textAlign: 'center', paddingTop: 18 }}>
          <div style={{
            width: 104, height: 104, borderRadius: 999, margin: '0 auto',
            background: ph.tintSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .4s ease',
          }}>
            {phase === 0
              ? <Hourglass color={t.accent} sand={t.accent} />
              : <div style={{
                  width: 72, height: 72, borderRadius: 999, background: t.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'om-pop .5s cubic-bezier(.2,1.3,.4,1)',
                }} key={phase}>
                  <Icon name={phase === 1 ? 'check' : 'fire'} size={36} color={t.onPrimary} stroke={2.6} />
                </div>}
          </div>

          <h1 style={{ margin: '18px 0 6px', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 26, color: t.ink, lineHeight: 1.15 }}>
            {ph.title}
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 280, color: t.muted, fontSize: 13.5, lineHeight: 1.55, textWrap: 'pretty' }}>
            {ph.sub}
          </p>
        </div>

        {/* ── KODE REF — elemen utama untuk kasir ── */}
        <div style={{
          marginTop: 22, borderRadius: t.radius, padding: '16px 18px', textAlign: 'center',
          background: t.primarySoft, border: '1.5px dashed ' + hexA(t.primary, 0.45),
        }}>
          <div style={{ ...labelStyle, color: hexA(t.primary, 0.85) }}>Tunjukkan kode ini ke kasir</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: t.primary, letterSpacing: 2, fontVariantNumeric: 'tabular-nums', lineHeight: 1.25, marginTop: 4 }}>
            {ref}
          </div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{fmtDateID(placedAt)}</div>
        </div>

        {/* ── Info pelanggan + tipe pesanan ── */}
        <div style={{ ...cardStyle, marginTop: 14, padding: '13px 16px' }}>
          {/* tipe pesanan — adaptif: 1 baris kalau seragam, 2 baris kalau campur (meja hanya utk dine-in) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {typeRows.map((r) =>
            <div key={r.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 700, color: t.ink, minWidth: 0 }}>
                  <Icon name={r.type === 'takeaway' ? 'takeaway' : 'dineIn'} size={16} color={t.muted} stroke={1.8} style={{ flexShrink: 0 }} />
                  {r.label}
                  {mixedType && <span style={{ fontSize: 12, color: t.faint, fontWeight: 600 }}>&middot; {r.n} item</span>}
                </span>
                {r.table && app.table &&
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: t.primarySoft, color: t.primary, borderRadius: 999, padding: '5px 11px', fontSize: 12.5, fontWeight: 800, flexShrink: 0 }}>
                  <Icon name="table" size={13} color={t.primary} /> {String(app.table).replace(/^Meja\s*/i, 'Meja ')}
                </span>}
              </div>
            )}
          </div>

          {/* catatan — hanya bila ada */}
          {app.orderNote &&
          <div style={{ marginTop: 11, paddingTop: 12, borderTop: '1px solid ' + t.line, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <Icon name="edit" size={14} color={t.faint} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12.5, color: t.muted, lineHeight: 1.45 }}>{app.orderNote}</span>
          </div>}
        </div>

        {/* ── Ringkasan pesanan ── */}
        <div style={{ ...cardStyle, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid ' + t.line }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>Pesanan ({qtyTotal})</span>
          </div>
          <div style={{ padding: '0 16px' }}>
            {lines.map((l, i) => (
              <div key={l.uid} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid ' + t.line }}>
                <span style={{ minWidth: 24, height: 24, borderRadius: 7, background: l.free ? t.primarySoft : t.surface2, color: l.free ? t.primary : t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, marginTop: 1, flexShrink: 0 }}>{l.qty}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>{l.name}</span>
                    {l.free
                      ? <span style={{ fontSize: 12.5, fontWeight: 800, color: t.primary, flexShrink: 0 }}>Gratis</span>
                      : <Money value={l.unit * l.qty} style={{ fontSize: 13, fontWeight: 700, color: t.ink, flexShrink: 0 }} />}
                  </div>
                  {l.options && l.options.length > 0 && <div style={{ fontSize: 12, color: t.muted, marginTop: 3 }}>{l.options.join(' · ')}</div>}
                  {l.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{l.notes}"</div>}
                  {mixedType &&
                  <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: t.muted }}>
                    <Icon name={l.type === 'takeaway' ? 'takeaway' : 'dineIn'} size={12} color={t.muted} stroke={1.8} />
                    {l.type === 'takeaway' ? 'Take Away' : 'Dine In'}
                  </div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid ' + t.line, background: t.surface2 }}>
            <span style={{ fontSize: 13, color: t.muted }}>Subtotal</span>
            <Money value={subtotal} style={{ fontSize: 13, fontWeight: 700, color: t.ink }} />
          </div>
        </div>

        {/* ── Rincian pembayaran ── */}
        <div style={{ ...cardStyle, marginTop: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: t.muted }}>Subtotal</span>
            <Money value={subtotal} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.primary, fontWeight: 600 }}>Diskon</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>– {rupiah(discount)}</span>
            </div>
          )}
          {!isOpenBill && freeLines.map((l) => {
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
          {isOpenBill && itemDisc > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.primary, fontWeight: 600 }}>Diskon produk</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>– {rupiah(itemDisc)}</span>
            </div>
          )}
          {service > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.muted }}>Service Charge ({Math.round(serviceRate * 100)}%)</span>
              <Money value={service} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: t.muted }}>Pajak ({Math.round(app.TAX_RATE * 100)}%){bill.taxInclusive ? ' · termasuk' : ''}</span>
            <Money value={tax} style={{ fontSize: 13, fontWeight: 600, color: t.ink }} />
          </div>
          {rounding !== 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: t.muted }}>Pembulatan</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{(rounding > 0 ? '+ ' : '– ') + rupiah(Math.abs(rounding))}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2, paddingTop: 10, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>Total Pesanan</span>
            <Money value={total} style={{ fontSize: 18, fontWeight: 800, color: t.primary }} />
          </div>
        </div>

      </div>

      {/* ── bottom bar — fase 0: cek status (seperti QRIS) · fase 2: selesai ── */}
      {(phase === 0 || phase >= 2) && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px calc(20px + env(safe-area-inset-bottom))', background: `linear-gradient(to top, ${t.bg} 70%, transparent)`, zIndex: 10, animation: 'om-fade .4s ease' }}>
          {phase === 0 ? (
            <>
              {checkMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '9px 12px', borderRadius: t.radiusSm, background: 'rgba(226,104,14,0.1)' }}>
                  <Icon name="info" size={15} color="#E2680E" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#E2680E', lineHeight: 1.4 }}>{checkMsg.text}</span>
                </div>
              )}
              <Button full loading={checking} onClick={checkStatus}>Cek Status Pembayaran</Button>
            </>
          ) : (
            <Button full onClick={app.reset}>Selesai</Button>
          )}
        </div>
      )}
    </div>);

}

Object.assign(window, { CashStatusScreen });
