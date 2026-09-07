// CashStatusScreen.jsx — ikon jam pasir, "Menunggu Pembayaran", kode REF untuk kasir,
// Dine In/Meja, dan ringkasan pesanan. Meniru layar Status Pesanan (Bayar Langsung) asli.
function CashStatusScreen({ code, total, onBack, onCheck, loading }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <TopBar title="Status Pesanan" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 18px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 18px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="clock" size={32} color="var(--color-accent)" stroke={1.7} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-ink)', marginBottom: 8 }}>Menunggu Pembayaran</div>
          <div style={{ fontSize: 12.5, color: 'var(--color-muted)', lineHeight: 1.5, maxWidth: 260 }}>Terima kasih atas pesananmu. Silakan selesaikan pembayaran di kasir agar pesanan segera diproses.</div>
        </div>
        <div style={{ background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', padding: '14px 18px', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-primary)' }}>Tunjukkan Kode Ini ke Kasir</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: 'var(--color-primary)', letterSpacing: 1, margin: '4px 0' }}>{code}</div>
          <div style={{ fontSize: 10.5, color: 'var(--color-muted)' }}>9 Jul 2026, 15.01</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 14, background: 'var(--color-surface)' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="dineIn" size={13} color="var(--color-primary)" /> Dine In</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="table" size={12} color="var(--color-primary)" /> Meja 5</span>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 10 }}>Pesanan (1)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--color-line)' }}>
            <span style={{ color: 'var(--color-ink)' }}><span style={{ fontWeight: 700 }}>1</span> Nasi Ayam Bakar Madu<div style={{ fontSize: 10.5, color: 'var(--color-faint)' }}>Sedang</div></span>
            <Money value={45000} style={{ fontSize: 12.5 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--color-muted)' }}>
            <span>Total</span><Money value={total} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-ink)' }} />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', padding: '12px 18px 16px' }}>
        <Button full loading={loading} onClick={onCheck}>Cek Status Pembayaran</Button>
      </div>
    </div>);
}
