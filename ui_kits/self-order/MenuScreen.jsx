// MenuScreen.jsx — hero foto + kartu resto (logo, meja, Pesanan/Dine In, voucher chips),
// lalu Promo Hari Ini + Best Seller (scroll horizontal). Meniru layar Menu asli persis.
const BRAND_NAME = 'POS';

function MenuOfferCard({ item, onOpen }) {
  return (
    <div onClick={onOpen} style={{ width: 232, flexShrink: 0, display: 'flex', gap: 11, alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 14, padding: 10, boxShadow: 'var(--shadow-card)', cursor: 'pointer' }}>
      <FoodImg label={item.name.toLowerCase()} h={54} radius={10} style={{ width: 54 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: '#E2680E', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Beli 1, gratis Ayam Goreng</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <Money value={item.price} style={{ fontSize: 13 }} />
      </div>
    </div>);
}

function MenuRailCard({ item, qty, onAdd, onOpen }) {
  return (
    <div style={{ width: 150, flexShrink: 0 }}>
      <div style={{ position: 'relative' }} onClick={onOpen}>
        <FoodImg label={item.name.toLowerCase()} h={150} radius={12} src={item.photo} style={{ width: 150, cursor: 'pointer' }} />
        {item.tag && <div style={{ position: 'absolute', top: 8, left: 8 }}><Pill tone="primary" style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>{item.tag}</Pill></div>}
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }} style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 999, background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(23,153,165,0.4)' }}>
          {qty > 0 ? <span style={{ fontSize: 12, fontWeight: 800 }}>{qty}</span> : <Icon name="plus" size={15} stroke={2.4} />}
        </button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.25, marginTop: 8, minHeight: 32 }}>{item.name}</div>
      <Money value={item.price} style={{ fontSize: 13, marginTop: 2 }} />
    </div>);
}

function MenuScreen({ items, cart, onAdd, onOpenItem, cartCount, cartTotal, onGoCart }) {
  const bestSeller = items.filter((m) => m.cat === 'signature');
  const promoItems = items.filter((m) => m.promo);
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--color-bg)' }}>
      <div style={{ position: 'relative', height: 140 }}>
        <img src={items[0].hero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35))' }} />
      </div>
      <div style={{ background: 'var(--color-surface)', borderRadius: '18px 18px 0 0', marginTop: -14, position: 'relative', padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 999, background: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{BRAND_NAME[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-ink)', fontSize: 17 }}>{BRAND_NAME}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, color: 'var(--color-muted)', fontSize: 11.5 }}><Icon name="pin" size={11} color="var(--color-muted)" /> Jakarta Barat</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--color-faint)', textTransform: 'uppercase' }}>Meja</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}><Icon name="dineIn" size={12} color="var(--color-primary)" /> 5</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-muted)' }}>Pesanan</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 700, color: 'var(--color-ink)' }}><Icon name="dineIn" size={13} color="var(--color-primary)" /> Dine In <Icon name="chevron" size={11} color="var(--color-muted)" style={{ transform: 'rotate(90deg)' }} /></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-primary-soft)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
          <Icon name="bolt" size={13} color="var(--color-primary)" />
          <span style={{ fontSize: 11.5, color: 'var(--color-ink)', fontWeight: 600, flex: 1 }}>Pesanan berikutnya lebih cepat</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)' }}>Masuk</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-line)', borderRadius: 10, padding: '8px 10px' }}>
            <Icon name="coupon" size={14} color="var(--color-primary)" />
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--color-ink)' }}>20% off<div style={{ fontSize: 9, color: 'var(--color-faint)', fontWeight: 500 }}>Min. Rp100.000</div></div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-line)', borderRadius: 10, padding: '8px 10px' }}>
            <Icon name="coupon" size={14} color="var(--color-primary)" />
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--color-ink)' }}>Rp15.000 off<div style={{ fontSize: 9, color: 'var(--color-faint)', fontWeight: 500 }}>Min. Rp75.000</div></div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 16px 90px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)', marginBottom: 12 }}>Promo Hari Ini</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 26 }}>
          {promoItems.map((item) => <MenuOfferCard key={item.id} item={item} onOpen={() => onOpenItem(item)} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)', marginBottom: 12 }}>Best Seller</div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          {bestSeller.map((item) => <MenuRailCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={() => onAdd(item)} onOpen={() => onOpenItem(item)} />)}
        </div>
      </div>
      {cartCount > 0 &&
      <button onClick={onGoCart} style={{ position: 'absolute', left: 16, right: 16, bottom: 16, height: 54, border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', cursor: 'pointer', boxShadow: 'var(--shadow-button)' }}>
          <span style={{ position: 'relative' }}>
            <Icon name="cart" size={18} color="var(--color-on-primary)" />
            <span style={{ position: 'absolute', top: -8, right: -8, background: '#fff', color: 'var(--color-primary)', borderRadius: 999, fontSize: 10, fontWeight: 800, minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{cartCount}</span>
          </span>
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>Lihat Keranjang</span>
          <span style={{ flex: 1 }} />
          <Money value={cartTotal} style={{ color: 'var(--color-on-primary)', fontWeight: 800, fontSize: 15 }} />
        </button>
      }
    </div>);
}
