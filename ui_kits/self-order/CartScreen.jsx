// CartScreen.jsx — Pesanan Kamu (item, badge qty), Catatan pesanan, Voucher & diskon,
// dan ringkasan bill (Subtotal / Potongan harga / PPN / Total). Meniru layar Keranjang asli.
function CartLine({ l, last, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--color-line)', position: 'relative', borderLeft: l.free ? '3px solid var(--color-primary)' : 'none', paddingLeft: l.free ? 9 : 0, marginLeft: l.free ? -12 : 0 }}>
      <FoodImg label={l.name.toLowerCase()} h={48} radius={10} style={{ width: 48 }} src={l.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-ink)' }}>{l.name}</div>
        <div style={{ fontSize: 11, color: 'var(--color-faint)', marginTop: 2 }}>{l.sub}</div>
        <div style={{ marginTop: 6 }}>
          {l.free ?
          <span><Money value={l.oldTotal} strike style={{ fontSize: 11.5 }} /> <Money value={0} style={{ fontSize: 13 }} /></span> :
          <Money value={l.total} style={{ fontSize: 13 }} />}
        </div>
      </div>
      {!l.free && <div style={{ position: 'absolute', top: 14, right: 0, width: 20, height: 20, borderRadius: 999, background: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{l.qty}</div>}
      {l.free && <button onClick={onRemove} style={{ position: 'absolute', top: 14, right: 0, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}><Icon name="minus" size={15} color="var(--color-faint)" /></button>}
    </div>);
}

function CartScreen({ lines, onBack, onConfirm, onOpenVoucher }) {
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const discount = lines.reduce((s, l) => s + (l.oldTotal || 0), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal - discount + tax;

  if (!lines.length) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        <TopBar title="Keranjang" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <EmptyState title="Keranjangmu masih kosong" desc="Yuk kembali ke menu dan pilih hidangan favoritmu untuk mulai memesan.">
            <Button style={{ marginTop: 16 }} onClick={onBack}>Lihat Menu</Button>
          </EmptyState>
        </div>
      </div>);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <TopBar title="Keranjang" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 16 }}>Pesanan Kamu</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontWeight: 700, fontSize: 13 }}><Icon name="plus" size={13} stroke={2.6} color="var(--color-primary)" /> Tambah Barang</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '0 16px', border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-card)' }}>
          {lines.map((l, i) => <CartLine key={l.id} l={l} last={i === lines.length - 1} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '18px 0 8px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 13.5 }}>Catatan pesanan</span>
          <span style={{ fontSize: 11, color: 'var(--color-faint)' }}>Opsional</span>
        </div>
        <div style={{ height: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 12.5, color: 'var(--color-faint)', marginBottom: 14 }}>cth. minta sendok lebih...</div>
        <div onClick={onOpenVoucher} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', padding: 14, cursor: 'pointer' }}>
          <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="coupon" size={16} color="var(--color-primary)" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-ink)' }}>Voucher &amp; diskon</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>Punya kode promo? Pakai di sini</div>
          </div>
          <Icon name="chevron" size={14} color="var(--color-faint)" />
        </div>
        <div style={{ marginTop: 14, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)', padding: '14px 16px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: 'var(--color-muted)' }}><span>Subtotal</span><Money value={subtotal} style={{ fontSize: 13, fontWeight: 600 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: 'var(--color-muted)' }}><span>Potongan harga</span><span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{'\u2212' + rupiah(discount)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: 'var(--color-muted)' }}><span>PPN 10%</span><Money value={tax} style={{ fontSize: 13, fontWeight: 600 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--color-line)' }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-ink)' }}>Total</span>
            <Money value={total} style={{ fontWeight: 800, fontSize: 20 }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', padding: '12px 18px 16px' }}>
        <Button full onClick={onConfirm}>Konfirmasi Pesanan</Button>
      </div>
    </div>);
}
