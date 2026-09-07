// CheckoutScreen.jsx — Meja/telp, Atas Nama, Ringkasan Pesanan, Metode Pembayaran.
// Meniru layar Konfirmasi Pesanan asli. onPay(loading) receives a `loading` tick so the
// caller can drive the Button's spinner state before navigating.
function CheckoutScreen({ lines, onBack, onPay, loading }) {
  const [method, setMethod] = React.useState('qris');
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const discount = lines.reduce((s, l) => s + (l.oldTotal || 0), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal - discount + tax;
  const methods = [
  { id: 'qris', label: 'QRIS', sub: 'Semua e-wallet & m-banking', icon: 'qr' },
  { id: 'cash', label: 'Bayar Langsung', sub: 'Tunai atau kartu di kasir', icon: 'receipt' }];

  const main = lines[0];
  const ctaLabel = method === 'cash' ? 'Bayar di Kasir' : 'Bayar';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <TopBar title="Konfirmasi Pesanan" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
      <div style={{ flex: 1, overflow: 'auto', padding: '2px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', padding: '12px 14px', boxShadow: 'var(--shadow-card)', marginBottom: 16, fontSize: 12.5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--color-primary)', fontWeight: 700 }}><Icon name="dineIn" size={13} color="var(--color-primary)" /> Meja 5</span>
          <div style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--color-muted)', fontWeight: 600 }}>+62 813 8001 2025 <Icon name="check" size={12} color="var(--color-primary)" stroke={2.6} /></span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-faint)', marginBottom: 8 }}>Atas Nama <span style={{ fontWeight: 600, letterSpacing: 0 }}>&middot; Opsional</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--color-surface)', border: '1.5px solid var(--color-line)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '12px 15px', marginBottom: 18 }}>
          <Icon name="user" size={16} color="var(--color-faint)" />
          <span style={{ fontSize: 13, color: 'var(--color-faint)' }}>Nama pemesan</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-faint)' }}>Ringkasan Pesanan</span>
          <span style={{ fontSize: 11, color: 'var(--color-faint)', fontWeight: 600 }}>{lines.length} item</span>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 12, padding: 14, borderBottom: '1px solid var(--color-line)' }}>
            <FoodImg label={main.name.toLowerCase()} h={44} radius={10} style={{ width: 44 }} src={main.photo} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{main.name} <span style={{ color: 'var(--color-faint)', fontWeight: 600 }}>1 pcs</span></div>
              <div style={{ fontSize: 10.5, color: 'var(--color-faint)', margin: '2px 0 6px' }}>{main.sub}</div>
              <Money value={main.total} style={{ fontSize: 13 }} />
            </div>
          </div>
          {lines.length > 1 && <div style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)' }}>Lihat semua &middot; {lines.length - 1} item lainnya</div>}
          <div style={{ padding: '0 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, color: 'var(--color-muted)' }}><span>Subtotal</span><Money value={subtotal} style={{ fontSize: 12, fontWeight: 600 }} /></div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="checkCircle" size={11} color="var(--color-primary)" /> Diskon</span><span>{'\u2212' + rupiah(discount)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 12px', fontSize: 12, color: 'var(--color-muted)' }}><span>Pajak (10%)</span><Money value={tax} style={{ fontSize: 12, fontWeight: 600 }} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px', borderTop: '1px solid var(--color-line)' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-ink)' }}>Total</span>
            <Money value={total} style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-primary)' }} />
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-faint)', marginBottom: 10 }}>Metode Pembayaran</div>
        {methods.map((m) => {
          const on = method === m.id;
          return (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--color-line)'), background: on ? 'var(--color-primary-soft)' : 'var(--color-surface)', marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: on ? 'rgba(23,153,165,0.15)' : 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.icon} size={17} color={on ? 'var(--color-primary)' : 'var(--color-muted)'} stroke={1.7} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: on ? 'var(--color-primary)' : 'var(--color-ink)' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-faint)', marginTop: 1 }}>{m.sub}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 999, border: '2px solid ' + (on ? 'var(--color-primary)' : 'var(--color-muted)'), background: on ? 'var(--color-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <Icon name="check" size={10} color="var(--color-on-primary)" stroke={3} />}
              </div>
            </div>);
        })}
      </div>
      <div style={{ flexShrink: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', padding: '12px 18px 16px' }}>
        <Button full loading={loading} onClick={() => onPay(method)}>{ctaLabel}</Button>
      </div>
    </div>);
}
