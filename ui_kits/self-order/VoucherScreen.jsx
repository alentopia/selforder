// VoucherScreen.jsx — daftar kartu voucher (chip tag + judul + syarat + tombol Pakai).
function VoucherCard({ v, onPakai }) {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 12, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ width: 60, height: 60, borderRadius: 12, border: '1.5px solid rgba(23,153,165,0.2)', background: 'var(--color-primary-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
        <Icon name="tag" size={20} color="var(--color-primary)" />
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Voucher</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-ink)', marginBottom: 4 }}>{v.title}</div>
        {v.conds.map((c, i) => <div key={i} style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>&middot; {c}</div>)}
      </div>
      <Button size="sm" onClick={onPakai}>Pakai</Button>
    </div>);
}

const VOUCHERS = [
{ title: 'Diskon 20%', conds: ['Min. belanja Rp100.000', 'Maks. potongan Rp30.000'] },
{ title: 'Potongan Rp15.000', conds: ['Min. belanja Rp75.000'] }];

function VoucherScreen({ onBack, onPakai }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <TopBar title="Voucher" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 24px' }}>
        {VOUCHERS.map((v) => <VoucherCard key={v.title} v={v} onPakai={() => onPakai(v)} />)}
      </div>
    </div>);
}
