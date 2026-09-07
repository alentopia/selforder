// SuccessScreen.jsx — hero teal (ikon check + total), lalu struk (Pesananmu, Rincian
// Pembayaran, Detail Transaksi) + Bagikan struk. Meniru layar Pembayaran Berhasil asli.
function SuccessScreen({ lines, method, onRestart }) {
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const main = lines[0];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <div style={{ flexShrink: 0, background: 'var(--color-primary)', padding: '50px 20px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon name="checkCircle" size={30} color="#fff" stroke={2} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>Pembayaran berhasil</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, marginTop: 4 }}>{rupiah(total)}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-faint)', marginBottom: 10 }}>
          <span>Pesananmu</span><span>Dine In &middot; Meja 5</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-ink)', marginBottom: 16 }}>
          <span><span style={{ fontWeight: 700 }}>1&times;</span> {main.name}<div style={{ fontSize: 11, color: 'var(--color-faint)' }}>{main.sub}</div></span>
          <Money value={main.total} style={{ fontSize: 13, fontWeight: 700 }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-faint)', marginBottom: 10 }}>Rincian Pembayaran</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 6 }}><span>Subtotal</span><Money value={subtotal} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-ink)' }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 16 }}><span>Pajak &amp; layanan</span><Money value={tax} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-ink)' }} /></div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-faint)', marginBottom: 10 }}>Detail Transaksi</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 6 }}><span>Metode</span><span style={{ color: 'var(--color-ink)', fontWeight: 700 }}>{method === 'cash' ? 'Bayar di Kasir' : 'QRIS'}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 14 }}><span>Tanggal</span><span style={{ color: 'var(--color-ink)', fontWeight: 700 }}>9 Jul 2026, 14.57</span></div>
        <Button variant="ghost" full onClick={() => {}} icon={<Icon name="share" size={15} color="var(--color-ink)" />}>Bagikan struk</Button>
      </div>
      <div style={{ flexShrink: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', padding: '12px 18px 16px' }}>
        <Button full onClick={onRestart}>Kembali ke Menu</Button>
      </div>
    </div>);
}
