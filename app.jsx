// app.jsx — store, navigation, scaling stage, tweaks, mount.
const { useState: useS, useRef: useR, useMemo: useM, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "visualStyle": "porcelain",
  "primaryColor": "#1799A5",
  "fonts": "elegan",
  "menuLayout": "grid",
  "menuShell": "klasik",
  "menuHeader": "kartu",
  "billStrip": "on",
  "billStripLayout": "navbar",
  "voucherStyle": "kupon",
  "offerSeeAll": "icon",
  "authMethod": "whatsapp",
  "pickerStyle": "kartu",
  "itemDetail": "sekarang",
  "rounding": "off",
  "taxMode": "exclude",
  "serviceCharge": "off",
  "checkoutSummary": "flat",
  "shareStyle": "overlay",
  "memberBlock": "dashed"
} /*EDITMODE-END*/;

// ── Scaling stage: fit the 402×874 device into any viewport ──
function Stage({ children }) {
  const [scale, setScale] = useS(1);
  useE(() => {
    const fit = () => {
      const pad = 32;
      const s = Math.min((window.innerWidth - pad) / 402, (window.innerHeight - pad) / 874, 1);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: 402, height: 874, transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}>
        {children}
      </div>
    </div>);

}

function App() {
  // Exported variants can preset defaults via window.__TWEAK_OVERRIDES
  // (e.g. the "Klasik" standalone build) without forking app.jsx.
  const [twStored, setTweak] = useTweaks(Object.assign({}, TWEAK_DEFAULTS, window.__TWEAK_OVERRIDES || {}));
  // MVP: semua pengaturan dikunci ke TWEAK_DEFAULTS (menu Klasik, tanpa pembulatan, dst.) —
  // hanya "Warna utama" yang masih bisa diubah lewat Tweaks. Nilai lama di localStorage diabaikan.
  const tw = { ...TWEAK_DEFAULTS, primaryColor: twStored.primaryColor || TWEAK_DEFAULTS.primaryColor };
  const theme = useM(() => makeTheme({ style: tw.visualStyle, primary: tw.primaryColor, fonts: tw.fonts }), [tw.visualStyle, tw.primaryColor, tw.fonts]);

  // ── store state ──
  const [stack, setStack] = useS([{ name: 'entry', params: {} }]);
  const [sheet, setSheet] = useS(null);
  const [mode, setMode] = useS(null);
  const [table, setTable] = useS(null);
  const [phone, setPhoneNum] = useS('');
  const [loggedIn, setLoggedIn] = useS(false);
  const [cart, setCart] = useS([]);
  const [applied, setApplied] = useS([]);
  const [unlocked, setUnlocked] = useS([]);
  const [orders, setOrders] = useS([]);
  const [confirm, setConfirm] = useS(null);
  const [payment, setPay] = useS(null);
  const [statusWhite, setStatusWhite] = useS(false);
  const [orderType, setOrderType] = useS('dinein');
  const [orderNote, setOrderNote] = useS('');
  const [orderRef, setOrderRef] = useS(() => 1000 + Math.floor(Math.random() * 9000));
  const uid = useR(1);
  const orderNum = useR(1);
  const autoPromoRef = useR(null); // id promo transaksi yang kita terapkan otomatis (bukan pilihan manual)

  const current = stack[stack.length - 1];

  // ── nav ──
  const go = (name, params = {}) => {
    setSheet(null);
    if (params.root) setStack([{ name, params }]);else
    if (params.replace) setStack((s) => [...s.slice(0, -1), { name, params }]);else
    setStack((s) => [...s, { name, params }]);
  };
  const back = () => {setSheet(null);setStack((s) => s.length > 1 ? s.slice(0, -1) : s);};
  const openSheet = (name, params = {}) => setSheet({ name, params });
  const closeSheet = () => setSheet(null);

  // Ketuk item: kalau sudah ada di keranjang -> picker sheet; kalau belum -> detail menu
  const openItem = (id) => {
    const inCart = cart.some((l) => l.itemId === id && !l.free);
    if (inCart) openSheet('itemPicker', { id });else
    go('item', { id });
  };

  const reset = () => {
    setCart([]);setApplied([]);setOrders([]);setPay(null);
    setUnlocked([]);
    setMode(null);setTable(null);setPhoneNum('');setLoggedIn(false);setOrderType('dinein');setOrderNote('');
    setOrderRef(1000 + Math.floor(Math.random() * 9000));
    orderNum.current = 1;
    setStack([{ name: 'entry', params: {} }]);
  };

  // All modes go straight to menu — phone/OTP collected at payment time
  const startSession = (m, t) => {
    setCart([]);setApplied([]);setOrders([]);setPay(null);setPhoneNum('');setLoggedIn(false);setOrderNote('');
    setUnlocked([]);
    setOrderType('dinein');
    setMode(m);setTable(t || null);
    setOrderRef(1000 + Math.floor(Math.random() * 9000));
    orderNum.current = 1;
    setStack([{ name: 'menu', params: {} }]);
  };

  // ── cart ──
  const addToCart = ({ itemId, name, unit, qty, options, contents, slots, notes }) => {
    setCart((c) => {
      const key = (l) => l.itemId + '|' + (l.options || []).join(',') + '|' + (l.notes || '');
      const cand = { itemId, options, notes };
      const idx = c.findIndex((l) => !l.free && key(l) === key(cand) && l.unit === unit);
      if (idx >= 0) {const n = [...c];n[idx] = { ...n[idx], qty: n[idx].qty + qty };return n;}
      return [...c, { uid: uid.current++, itemId, name, unit, qty, options, contents: contents || [], slots: slots || null, notes, free: false, type: orderType }];
    });
  };
  const setLineQty = (u, v) => setCart((c) => v < 1 ? c.filter((l) => l.uid !== u) : c.map((l) => l.uid === u ? { ...l, qty: v } : l));
  // tipe per baris (dine-in / takeaway)
  const setLineType = (u, type) => setCart((c) => c.map((l) => l.uid === u ? { ...l, type } : l));
  // set tipe untuk SEMUA baris + jadikan default (dipakai toggle global)
  const applyOrderTypeAll = (type) => {setOrderType(type);setCart((c) => c.map((l) => ({ ...l, type })));};
  // barang hadiah promo TIDAK ikut dibuang saat pemicunya dihapus — ia barang yang ditambah
  // tamu sendiri, jadi tetap di keranjang dan kembali ke harga normal.
  const removeLine = (u) => setCart((c) => c.filter((l) => l.uid !== u));

  const cartSubtotal = () => cart.filter((l) => !l.free).reduce((s, l) => s + l.unit * l.qty, 0);
  // Subtotal SETELAH Promo Produk: item gratis Rp0, harga coret sudah di harga menu,
  // diskon beli-N dipotong. Ini dasar syarat min. belanja & Diskon Transaksi.
  const productSubtotal = () => Math.max(0, cartSubtotal() - itemDiscount());
  const promoDiscount = () => {
    const sub = productSubtotal();
    return applied.reduce((sum, a) => {
      const p = promoById(a.id);
      return p && isVoucher(p) ? sum + txPromoAmount(p, sub) : sum;
    }, 0);
  };

  const TAX_RATE = 0.10;

  // diskon item otomatis (mis. beli 2 diskon 40%) — dihitung dari isi keranjang, tak perlu di-apply
  const itemDiscountLines = () => {
    const bulk = PROMOS.
    filter((p) => p.scope === 'item' && p.kind === 'bulk').
    map((p) => {
      const minQ = p.minQty || 2;
      const lines = cart.filter((l) => !l.free && l.itemId === p.requireItem);
      const qty = lines.reduce((s, l) => s + l.qty, 0);
      if (qty < minQ) return null;
      const base = lines.reduce((s, l) => s + l.unit * l.qty, 0);
      const amount = Math.round(base * p.value);
      return amount > 0 ? { id: p.id, title: p.title, item: (itemById(p.requireItem) || {}).name, pct: Math.round(p.value * 100), amount } : null;
    }).
    filter(Boolean);
    // item gratis (free-item): barang hadiah TIDAK disisipkan sistem — tamu menambahkannya
    // sendiri dari menu. Kalau barangnya ada di keranjang & syarat terpenuhi, 1 pcs jadi gratis
    // (Diskon 100%, maks. 1 barang — lihat promoSummary). Yang digratiskan harga menunya saja;
    // modifier berbayar tetap ditagih. Dua pilihan hadiah ada → yang termahal (seri: yang duluan).
    // Syarat min. belanja dihitung dari subtotal setelah Promo Produk lain & tanpa porsi yang
    // digratiskan → promo berpemicu barang dihitung dulu, baru yang bersyarat min. belanja.
    let base = cartSubtotal() - bulk.reduce((s, x) => s + x.amount, 0);
    const free = PROMOS.
    filter((p) => p.kind === 'free-item').
    sort((a, b) => (a.min ? 1 : 0) - (b.min ? 1 : 0)).
    map((p) => {
      const ids = p.needsPick ? p.choices || [] : [p.fixedItem];
      const priceOf = (l) => (itemById(l.itemId) || {}).price || 0;
      const line = cart.
      filter((l) => ids.includes(l.itemId)).
      reduce((best, l) => !best || priceOf(l) > priceOf(best) ? l : best, null);
      if (!line) return null;
      const amount = Math.min(priceOf(line), line.unit);
      const ok = p.requireItem ? cart.some((l) => l.itemId === p.requireItem) : !p.min || base - amount >= p.min;
      if (!ok || amount <= 0) return null;
      base -= amount;
      return { id: p.id, title: p.title, item: line.name, uid: line.uid, pct: 100, amount };
    }).
    filter(Boolean);
    return [...bulk, ...free];
  };
  const itemDiscount = () => itemDiscountLines().reduce((s, x) => s + x.amount, 0);

  // pembulatan total ke kelipatan terdekat (naik/turun)
  const ROUND_TO = tw.rounding === 'off' ? 0 : Number(tw.rounding);
  const roundValue = (n) => ROUND_TO ? Math.round(n / ROUND_TO) * ROUND_TO : Math.round(n);

  // service charge (opsional) & mode pajak (exclude = ditambahkan di atas, include = sudah termasuk harga)
  const SERVICE_RATE = !tw.serviceCharge || tw.serviceCharge === 'off' ? 0 : Number(tw.serviceCharge) / 100;
  const taxInclusive = tw.taxMode === 'include';

  // Rincian pembayaran terpusat — semua layar memakai angka yang sama
  const computeBill = () => {
    const paidSubtotal = cartSubtotal();
    const itemDisc = itemDiscount();
    // subtotal = setelah Promo Produk (Figma: "Subtotal = jumlah harga SETELAH promo").
    // Promo Produk tidak punya baris sendiri di ringkasan — penandanya menempel di baris item.
    const subtotal = Math.max(0, paidSubtotal - itemDisc);
    const discount = promoDiscount();
    const net = Math.max(0, subtotal - discount);
    const service = Math.round(net * SERVICE_RATE);
    const taxBase = net + service;
    const tax = taxInclusive ? taxBase - Math.round(taxBase / (1 + TAX_RATE)) : Math.round(taxBase * TAX_RATE);
    const rawTotal = taxInclusive ? taxBase : taxBase + tax;
    const total = roundValue(rawTotal);
    return { subtotal, paidSubtotal, discount, itemDisc, net, service, serviceRate: SERVICE_RATE, tax, taxInclusive, taxRate: TAX_RATE, rounding: total - rawTotal, total };
  };

  const taxAmount = (base) => {
    const b = base != null ? base : Math.max(0, cartSubtotal() - promoDiscount() - itemDiscount());
    return taxInclusive ? b - Math.round(b / (1 + TAX_RATE)) : Math.round(b * TAX_RATE);
  };
  const orderTotal = () => computeBill().total;

  // ── promo ──
  // MVP: promo dipasang & dilepas otomatis (efek auto-apply di bawah).
  const removePromo = (id) => {
    setApplied((a) => a.filter((x) => x.id !== id));
    // Kembalikan referensi cart yang sama jika tidak ada item yang dihapus (voucher).
    // Tanpa ini, cart selalu membuat referensi baru → efek auto-apply terpicu ulang.
    setCart((c) => {const next = c.filter((l) => l.promoId !== id);return next.length === c.length ? c : next;});
  };
  const unlockPromo = (id) => setUnlocked((u) => u.includes(id) ? u : [...u, id]);

  // ── MVP: semua promo otomatis (Figma "Case: Diskon Transaksi Otomatis") ──
  // Tamu tidak memilih promo, dan sistem TIDAK PERNAH menambah/membuang barang di keranjang —
  // semua barang (termasuk barang hadiah promo) diinput tamu sendiri. Promo hanya menghitung:
  // · item gratis (free-item), beli-N (bulk) & harga coret (price) → dari isi keranjang
  //   (itemDiscountLines / linePrice), tidak perlu dipasang
  // · Diskon Transaksi → maks. 1 aktif. Kalau >1 memenuhi syarat, dipilih potongan
  //   TERBESAR (asumsi prototipe — di Figma ditandai "BELUM DIPUTUSKAN").
  useE(() => {
    const tx = bestTxPromo(productSubtotal());
    const want = tx ? [tx.id] : [];
    const same = applied.length === want.length && want.every((id) => applied.some((a) => a.id === id));
    if (!same) setApplied(want.map((id) => applied.find((a) => a.id === id) || { id, pick: null }));
  }, [cart]);

  // harga per baris untuk tampilan: asal (dicoret) vs akhir + promo produk yang berlaku
  const linePrice = (line) => {
    const it = itemById(line.itemId) || {};
    const disc = itemDiscountLines();
    const free = disc.find((d) => d.uid === line.uid);
    if (free) {const orig = line.unit * line.qty;return { orig, final: orig - free.amount, promo: promoById(free.id) };}
    const bulk = disc.find((d) => {const p = promoById(d.id);return p.kind === 'bulk' && p.requireItem === line.itemId;});
    if (bulk) {const p = promoById(bulk.id);const orig = line.unit * line.qty;return { orig, final: orig - Math.round(orig * p.value), promo: p };}
    const strike = strikePromoFor(line.itemId);
    if (strike && it.oldPrice) return { orig: (line.unit + it.oldPrice - it.price) * line.qty, final: line.unit * line.qty, promo: strike };
    return { orig: line.unit * line.qty, final: line.unit * line.qty, promo: null };
  };

  // ── open bill ──
  // Per order kita simpan NET PRA-PAJAK (subtotal item − diskon produk). Pajak transaksi
  // & voucher tidak dihitung per order — keduanya diterapkan SEKALI saat Bayar Semua.
  const submitOrder = (info) => {
    const b = computeBill();
    const subtotal = b.paidSubtotal;
    const itemDisc = b.itemDisc;
    const net = Math.max(0, subtotal - itemDisc);
    const cust = info && (info.name || info.phone) ? { name: info.name || '', phone: info.phone || '' } : null;
    const order = { id: 'o' + Date.now(), num: orderNum.current++, time: 'Baru saja', createdAt: Date.now(), lines: cart, applied, subtotal, itemDisc, net, total: net, customer: cust };
    setOrders((o) => [...o, order]);
    setCart([]);setApplied([]);
    // Navbar layout (sidebar atau klasik): kembali ke menu dgn tab orders. Klasik non-navbar: halaman bill. Sidebar non-navbar: tab bill.
    if (tw.billStripLayout === 'navbar') go('menu', { root: true, tab: mode === 'dyn-openbill' ? 'menu' : 'riwayat' });
    else if (tw.menuShell === 'klasik') go('bill', { root: true });
    else go('menu', { root: true, tab: 'bill' });
  };
  // total net pra-pajak dari semua order terkirim
  const ordersNet = () => orders.reduce((s, o) => s + (o.net != null ? o.net : o.total || 0), 0);
  const ordersSubtotal = () => orders.reduce((s, o) => s + (o.subtotal != null ? o.subtotal : o.lines.filter((l) => !l.free).reduce((a, l) => a + l.unit * l.qty, 0)), 0);
  // Tagihan akhir Open Bill — PAJAK & service dihitung SEKALI dari (net − diskon transaksi).
  const settleBill = (discount = 0) => {
    const grossNet = ordersNet();
    const net = Math.max(0, grossNet - discount);
    const service = Math.round(net * SERVICE_RATE);
    const taxBase = net + service;
    const tax = taxInclusive ? taxBase - Math.round(taxBase / (1 + TAX_RATE)) : Math.round(taxBase * TAX_RATE);
    const rawTotal = taxInclusive ? taxBase : taxBase + tax;
    const total = roundValue(rawTotal);
    return { grossNet, subtotal: ordersSubtotal(), itemDisc: ordersSubtotal() - grossNet, discount, net, service, serviceRate: SERVICE_RATE, tax, taxInclusive, taxRate: TAX_RATE, rounding: total - rawTotal, total };
  };
  // Headline "Tagihan Berjalan" = subtotal makanan yang sudah dipesan (PPN tampil hanya di Ringkasan Pembayaran)
  const grandTotal = () => ordersSubtotal();

  // ── auth — WhatsApp login, just-in-time at "Lihat Keranjang" ──
  const login = (num) => {if (num) setPhoneNum(num);setLoggedIn(true);};
  const logout = () => setLoggedIn(false);

  const store = {
    mode, table, menuLayout: tw.menuLayout, menuShell: tw.menuShell, menuHeader: tw.menuHeader, billStrip: tw.billStrip, billStripLayout: tw.billStripLayout, voucherStyle: tw.voucherStyle, offerSeeAll: tw.offerSeeAll, authMethod: tw.authMethod, pickerStyle: tw.pickerStyle, itemDetail: tw.itemDetail, checkoutSummary: tw.checkoutSummary, shareStyle: tw.shareStyle, memberBlock: tw.memberBlock, orderType, setOrderType, orderNote, setOrderNote,
    phone, loggedIn, login, logout,
    phoneHint: phone ? phone.slice(0, 3) + ' ' + phone.slice(3, 7) + ' ' + phone.slice(7) : '••• •••• ••••',
    orderRef, refCode: 'REF-' + String(orderRef).padStart(6, '0'), cart, applied, unlocked, orders, payment,
    confirm, askConfirm: (opts) => setConfirm(opts), closeConfirm: () => setConfirm(null),
    go, back, openSheet, closeSheet, openItem, reset, startSession,
    setPhone: setPhoneNum, addToCart, setLineQty, setLineType, applyOrderTypeAll, removeLine,
    cartSubtotal, productSubtotal, linePrice, promoDiscount, itemDiscount, itemDiscountLines, taxAmount, orderTotal, computeBill, serviceRate: SERVICE_RATE, taxInclusive, roundValue, roundTo: ROUND_TO, TAX_RATE, removePromo, unlockPromo,
    submitOrder, grandTotal, ordersNet, ordersSubtotal, settleBill, cartNet: () => { const b = computeBill(); return Math.max(0, b.paidSubtotal - b.itemDisc); }, setPayment: setPay,
    statusWhite, setStatusWhite
  };

  // ── screen registry ──
  const SCREENS = {
    entry: EntryScreen, phone: PhoneScreen, otp: OtpScreen, menu: MenuScreen,
    item: ItemScreen, search: SearchScreen, offers: OffersScreen, vouchers: PromoScreen, cart: CartScreen, promo: PromoScreen, confirm: ConfirmScreen, processing: ProcessingScreen,
    profile: ProfileScreen,
    bill: BillScreen, settle: SettleScreen, success: SuccessScreen, paid: SuccessScreen, cashstatus: CashStatusScreen, share: ShareReceiptScreen
  };
  const SHEETS = { orderType: OrderTypeSheet, login: LoginSheet, voucher: VoucherSheet, itemPicker: ItemPickerSheet, shareReceipt: ShareReceiptSheet };
  const ScreenComp = SCREENS[current.name] || EntryScreen;
  const SheetComp = sheet ? SHEETS[sheet.name] : null;

  return (
    <ThemeCtx.Provider value={theme}>
      <AppCtx.Provider value={store}>
        <Stage>
          <IOSDevice dark={current.name === 'menu' ? statusWhite : current.name === 'success' || current.name === 'paid' ? true : theme.statusDark} width={402} height={874}>
            <div style={{ position: 'relative', height: '100%', background: theme.bg, fontFamily: theme.fontBody, color: theme.ink }}>
              <div key={stack.length + ':' + current.name} style={{ height: '100%', animation: 'om-screen .32s cubic-bezier(.2,.8,.3,1)' }}>
                <ScreenComp params={current.params} />
              </div>
              {SheetComp && <SheetComp params={sheet.params} />}
              <ConfirmDialog />
            </div>
          </IOSDevice>
        </Stage>

        <TweaksPanel>
          <TweakSection label="Gaya Visual" />
          <TweakColor label="Warna utama" value={tw.primaryColor} options={['#1799A5', '#1F8A5B', '#B5532A', '#2A5DB0', '#8C5BD0', '#C23B5E', '#D97706', '#0E7C66', '#4338CA', '#BE185D', '#166534', '#DC2626', '#0891B2', '#7C3AED', '#CA8A04', '#0F172A']} onChange={(v) => setTweak('primaryColor', v)} />
        </TweaksPanel>
      </AppCtx.Provider>
    </ThemeCtx.Provider>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);