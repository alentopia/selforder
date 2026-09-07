// QrisScreen.jsx — kotak QR palsu, timer masa berlaku, total bayar, Cara Bayar.
function QrFaux({ color, bg, size = 172 }) {
  const n = 21;
  const cells = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    const on = finder ?
    (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4) ? 1 : 0) :
    (rnd() > 0.55 ? 1 : 0);
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={color} />);
  }
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + n + ' ' + n} style={{ display: 'block', background: bg }} shapeRendering="crispEdges">
      {cells}
    </svg>);
}

function QrisScreen({ total, onBack, onDone, loading }) {
  const steps = ['Buka aplikasi e-wallet atau m-banking', 'Pilih menu "Scan QR" atau "Bayar"', 'Arahkan kamera ke QR di atas', 'Konfirmasi jumlah dan bayar'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <TopBar title="Pembayaran QRIS" onBack={onBack} backIcon={<Icon name="back" size={20} />} />
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 24px' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-card)', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <QrFaux color="var(--color-ink)" bg="var(--color-surface)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 12.5, color: 'var(--color-muted)' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--color-primary)' }} /> Menunggu pembayaran...</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-ink)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={13} color="var(--color-ink)" /> Berlaku 04:54</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="download" size={13} color="var(--color-primary)" /> Download QR</div>
        </div>
        <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Pembayaran</div>
          <Money value={total} style={{ fontSize: 24, fontWeight: 800, color: '#fff' }} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 10 }}>Cara Bayar</div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', padding: '12px 18px 16px' }}>
        <Button full loading={loading} onClick={onDone}>Update Status Pesanan</Button>
      </div>
    </div>);
}
