// menu-sidebar.jsx — Kiosk-style menu: vertical category rail (left) + scrollable
// item list (right). Default menu shell; classic scroll layout kept as a tweak.
// Reuses shared bits from screens-menu.jsx (PromoToday, MenuCardList/Grid, CartDock).
const { useState: useStateSB, useEffect: useEffectSB, useRef: useRefSB, useMemo: useMemoSB } = React;

const RAIL_W = 104;

// Kartu menu khusus panel sidebar (kolom ~252px) — lebih ringkas dari MenuCardList:
// foto 76px, nama maks 2 baris, harga + tombol tambah. Tanpa deskripsi panjang.
function SidebarMenuCard({ item, qty, onOpen }) {
  const t = useTheme();
  const out = item.stock === 0;
  const triggerPromo = PROMOS.find((p) => p.scope === 'item' && p.requireItem === item.id);
  return (
    <div onClick={out ? undefined : onOpen} style={{ display: 'flex', gap: 11, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: 9, boxShadow: t.shadow, cursor: out ? 'default' : 'pointer', opacity: out ? 0.6 : 1 }}>
      <FoodImg label={item.name.toLowerCase()} h={76} radius={t.radiusSm} style={{ width: 76, flexShrink: 0 }} src={item.photo} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {triggerPromo &&
        <div style={{ fontSize: 10.5, fontWeight: 600, color: '#E2680E', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{triggerPromo.tagline || triggerPromo.title}</div>}
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h3>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 7, gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0, flexWrap: 'wrap' }}>
            <Money value={item.price} style={{ fontWeight: 800, fontSize: 14, color: t.ink }} />
            {item.oldPrice && <Money value={item.oldPrice} strike style={{ fontWeight: 600, fontSize: 11, color: t.faint }} />}
          </div>
          {out ? <StockNote item={item} /> : qty > 0 ?
          <div style={{ flexShrink: 0, minWidth: 30, height: 30, padding: '0 9px', borderRadius: 9, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13.5 }}>{qty}</div> :
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 9, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={17} stroke={2.6} color={t.onPrimary} /></div>}
        </div>
      </div>
    </div>);

}

function MenuSidebarScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const [cat, setCat] = useStateSB('promo');
  const [showLogout, setShowLogout] = useStateSB(false);
  const [view, setView] = useStateSB(params && params.tab === 'bill' ? 'bill' : 'menu'); // 'menu' | 'bill' — tab rail (Open Bill)
  // Panel utama sempit (~284px) → selalu pakai list rows agar pas & terbaca,
  // tak peduli tweak Grid/List (grid 2-kolom terlalu sesak di lebar ini).
  const grid = false;
  const scrollRef = useRefSB(null);
  const sectionRefs = useRefSB({});

  // kategori = Promo Hari Ini (paling atas) + kategori menu yang ada itemnya
  const cats = useMemoSB(() => {
    const withItems = CATEGORIES.filter((c) => MENU.some((m) => m.cat === c.id));
    return [{ id: 'promo', label: 'Promo Hari Ini' }, ...withItems];
  }, []);

  // scrollspy — sinkronkan kategori aktif di rail saat panel kanan di-scroll
  useEffectSB(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const top = container.getBoundingClientRect().top;
      let active = 'promo';
      for (const c of cats) {
        const el = sectionRefs.current[c.id];
        if (!el) continue;
        if (el.getBoundingClientRect().top - top <= 120) active = c.id;
      }
      setCat(active);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [cats, view]);

  const goTo = (id) => {
    const el = sectionRefs.current[id];
    const c = scrollRef.current;
    if (!el || !c) return;
    setCat(id);
    // Lompat instan, lalu koreksi beberapa kali (gambar promo bisa load telat &
    // menggeser konten). Berhenti mengoreksi jika user menggulir manual.
    let last = -1;
    const jump = () => {
      if (last >= 0 && Math.abs(c.scrollTop - last) > 4) return; // user sudah scroll → stop
      const tgt = Math.max(0, el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 8);
      c.scrollTop = tgt;
      last = c.scrollTop;
    };
    jump();
    [80, 220, 480, 900].forEach((d) => setTimeout(jump, d));
  };

  const qtyInCart = (id) => app.cart.filter((l) => l.itemId === id && !l.free).reduce((s, l) => s + l.qty, 0);
  const cardRow = (items) =>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((m) => <SidebarMenuCard key={m.id} item={m} qty={qtyInCart(m.id)} onOpen={() => app.openItem(m.id)} />)}
    </div>;

  const activeLabel = (cats.find((c) => c.id === cat) || cats[0]).label;

  return (
    <div style={{ height: '100%', display: 'flex', background: t.bg, position: 'relative' }}>

      {/* ── RAIL kiri ── */}
      <aside style={{ width: RAIL_W, flexShrink: 0, background: t.surface, borderRight: '1px solid ' + t.line, display: 'flex', flexDirection: 'column' }}>

        {/* brand + lokasi + meja */}
        <div style={{ padding: '48px 10px 12px', borderBottom: '1px solid ' + t.line, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 40, height: 40, margin: '0 auto 6px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 19, lineHeight: 1 }}>{BRAND.name.trim().charAt(0).toUpperCase()}</div>
            <image-slot id="brand-logo" className="brand-logo" shape="circle" placeholder="Logo" style={{ position: 'absolute', inset: 0, display: 'block', width: 40, height: 40, borderRadius: 999 }}></image-slot>
          </div>
          <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 18, color: t.ink, lineHeight: 1.05 }}>{BRAND.name}</div>
        </div>

        {/* tipe pesanan dipindah ke panel home (kanan) */}

        {/* tab rail — Menu / Tagihan (Open Bill), selalu ada */}
        {app.mode === 'dyn-openbill' &&
        <div style={{ padding: '8px 8px 6px', display: 'flex', flexDirection: 'column', gap: 4, borderBottom: '1px solid ' + t.line, marginBottom: 4 }}>
          {[['menu', 'Menu', 'home'], ['bill', 'Tagihan', 'receipt']].map(([id, label, icon]) => {
            const on = view === id;
            return (
              <button key={id} onClick={() => setView(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: on ? t.primary : 'transparent', color: on ? t.onPrimary : t.ink, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: on ? 800 : 600, WebkitTapHighlightColor: 'transparent', transition: 'background .15s, color .15s' }}>
                <Icon name={icon} size={15} color={on ? t.onPrimary : t.muted} stroke={1.9} />{label}
              </button>);

          })}
        </div>}

        {/* daftar kategori — hanya saat tab Menu */}
        {view === 'menu' &&
        <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '6px 0 92px' }}>
          {cats.map((c) => {
            const on = c.id === cat;
            return (
              <button key={c.id} onClick={() => goTo(c.id)} style={{ position: 'relative', display: 'block', width: '100%', textAlign: 'left', border: 'none', background: on ? t.primarySoft : 'transparent', cursor: 'pointer', padding: '8px 10px 8px 14px', fontFamily: t.fontBody, fontSize: 12, fontWeight: on ? 800 : 600, color: on ? t.primary : t.ink, lineHeight: 1.2, WebkitTapHighlightColor: 'transparent', transition: 'background .15s, color .15s' }}>
                {on && <span style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: '0 3px 3px 0', background: t.primary }} />}
                {c.label}
              </button>);

          })}
        </div>}

        {/* akun dipindah ke header rail */}
      </aside>

      {/* ── MAIN kanan ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {app.mode === 'dyn-openbill' && view === 'bill' ?
        <BillScreen embedded /> :
        <>
        {/* header — brand + cari, lalu lokasi + tipe pesanan */}
        <div style={{ paddingTop: 46, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, background: t.bg, borderBottom: '1px solid ' + t.line, zIndex: 5, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* baris 1 — cari (brand POS ada di rail kiri) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => app.go('search')} aria-label="Cari menu" style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 14px', borderRadius: 999, border: 'none', background: t.surface2, cursor: 'pointer', fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
              <Icon name="search" size={17} color={t.faint} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: t.faint, fontWeight: 500 }}>Cari menu…</span>
            </button>
          </div>
          {/* baris 2 — lokasi + tipe pesanan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {app.table &&
              <span style={{ flexShrink: 0, background: t.primarySoft, color: t.primary, borderRadius: 6, padding: '4px 8px', fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase' }}>Meja {String(app.table).replace(/^Meja\s*/i, '')}</span>}
              {/* lokasi dihapus */}
            </div>
            <div style={{ flexShrink: 0, display: 'inline-flex', padding: 3, background: t.surface2, borderRadius: 999, border: '1px solid ' + t.line }}>
              {[['dinein', 'Dine In'], ['takeaway', 'Take Away']].map(([id, label]) => {
                const on = app.orderType === id;
                return (
                  <button key={id} onClick={() => app.setOrderType(id)} style={{ padding: '6px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? t.primary : 'transparent', color: on ? t.onPrimary : t.muted, fontFamily: t.fontBody, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent', transition: 'background .15s, color .15s' }}>{label}</button>);

              })}
            </div>
          </div>
        </div>

        {/* scroll konten */}
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>

          {/* banner foto restoran */}
          <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
            <image-slot id="menu-banner" shape="rect" placeholder="Drop foto restoran" style={{ display: 'block', width: '100%', height: '100%' }}></image-slot>
          </div>

          {/* tipe pesanan dipindah ke header */}

          {/* tagihan berjalan dipindah ke rail */}

          {/* PROMO HARI INI */}
          <div ref={(el) => {sectionRefs.current['promo'] = el;}}>
            <PromoToday />
          </div>

          {/* SECTION per kategori */}
          <div style={{ padding: grid ? '4px 14px 130px' : '4px 16px 130px' }}>
            {cats.filter((c) => c.id !== 'promo').map((c) => {
              const items = MENU.filter((m) => m.cat === c.id);
              if (items.length === 0) return null;
              return (
                <div key={c.id} ref={(el) => {sectionRefs.current[c.id] = el;}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 12px' }}>
                    <h2 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 19, color: t.ink, lineHeight: 1, flexShrink: 0, whiteSpace: 'nowrap' }}>{c.label}</h2>
                    <div style={{ flex: 1, height: 1, background: t.line }} />
                  </div>
                  {cardRow(items)}
                </div>);

            })}
          </div>
        </div>
        </>}
      </main>

      {/* cart dock — hanya tab Menu */}
      {view === 'menu' && <CartDock />}

      {/* konfirmasi keluar akun */}
      {showLogout &&
      <div onClick={() => setShowLogout(false)} style={{ position: 'absolute', inset: 0, zIndex: 95, background: hexA('#0a1413', 0.5), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: t.surface, borderRadius: t.radiusLg, padding: '24px 22px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="phone" size={22} color={t.primary} />
            </div>
            <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink, lineHeight: 1.15 }}>Keluar dari akun?</h3>
            <p style={{ margin: '8px 0 20px', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Kamu perlu masuk lagi pakai WhatsApp untuk melihat keranjang dan menyelesaikan pesanan.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" size="md" full onClick={() => setShowLogout(false)}>Batal</Button>
              <Button size="md" full onClick={() => {setShowLogout(false);app.logout();}}>Keluar</Button>
            </div>
          </div>
        </div>}
    </div>);

}

// ── Halaman Akun / Profil ──────────────────────────────────
function ProfileScreen() {
  const t = useTheme();
  const app = useApp();
  const doLogout = () => app.askConfirm({
    title: 'Keluar dari akun?',
    message: 'Kamu perlu masuk lagi pakai WhatsApp untuk melihat keranjang dan menyelesaikan pesanan.',
    confirmLabel: 'Keluar',
    onConfirm: () => {app.logout();app.go('menu', { root: true });}
  });
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar title="Akun" onBack={app.back} />
      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 18px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '18px 16px' }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="user" size={28} color={t.onPrimary} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, color: t.ink, lineHeight: 1.15 }}>+62 {app.phoneHint}</div>
            <div style={{ fontSize: 12.5, color: t.muted, marginTop: 3 }}>Terverifikasi via WhatsApp</div>
          </div>
        </div>

        {app.table &&
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '13px 16px' }}>
          <Icon name="table" size={17} color={t.primary} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13.5, color: t.ink, fontWeight: 700 }}>Meja {String(app.table).replace(/^Meja\s*/i, '')}</span>
          <span style={{ fontSize: 12.5, color: t.muted, fontWeight: 600 }}>{app.mode === 'dyn-openbill' ? 'Open Bill' : 'Pesan & bayar'}</span>
        </div>}

        <button onClick={doLogout} style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', border: '1px solid ' + t.line, background: t.surface, borderRadius: t.radius, cursor: 'pointer', color: '#BE4137', fontWeight: 800, fontSize: 14.5, fontFamily: t.fontBody, WebkitTapHighlightColor: 'transparent' }}>
          Keluar dari akun
        </button>
      </div>
    </div>);

}

Object.assign(window, { MenuSidebarScreen, ProfileScreen });
