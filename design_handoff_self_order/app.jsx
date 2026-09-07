// app.jsx — store, navigation, scaling stage, tweaks, mount.
const { useState: useS, useRef: useR, useMemo: useM, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "visualStyle": "porcelain",
  "primaryColor": "#1799A5",
  "fonts": "elegan",
  "menuLayout": "grid",
  "menuShell": "sidebar",
  "menuHeader": "kartu",
  "billStrip": "on",
  "billStripLayout": "navbar",
  "voucherStyle": "kupon",
  "offerSeeAll": "icon",
  "authMethod": "whatsapp",
  "pickerStyle": "kartu",
  "rounding": "100",
  "taxMode": "exclude",
  "serviceCharge": "off",
  "checkoutSummary": "flat",
  "shareStyle": "overlay"
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
  const [tw, setTweak] = useTweaks(Object.assign({}, TWEAK_DEFAULTS, window.__TWEAK_OVERRIDES || {}));
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
  const addToCart = ({ itemId, name, unit, qty, options, notes }) => {
    setCart((c) => {
      const key = (l) => l.itemId + '|' + (l.options || []).join(',') + '|' + (l.notes || '');
      const cand = { itemId, options, notes };
      const idx = c.findIndex((l) => !l.free && key(l) === key(cand) && l.unit === unit);
      if (idx >= 0) {const n = [...c];n[idx] = { ...n[idx], qty: n[idx].qty + qty };return n;}
      return [...c, { uid: uid.current++, itemId, name, unit, qty, options, notes, free: false, type: orderType }];
    });
  };
  const setLineQty = (u, v) => setCart((c) => v < 1 ? c.filter((l) => l.uid !== u) : c.map((l) => l.uid === u ? { ...l, qty: v } : l));
  // tipe per baris (dine-in / takeaway) — item gratis ikut baris pemicunya
  const setLineType = (u, type) => setCart((c) => {
    const target = c.find((l) => l.uid === u);
    return c.map((l) => {
      if (l.uid === u) return { ...l, type };
      if (target && !target.free && l.free && l.promoId) {
        const p = promoById(l.promoId);
        if (p && p.requireItem === target.itemId) return { ...l, type };
      }
      return l;
    });
  });
  // set tipe untuk SEMUA baris + jadikan default (dipakai toggle global)
  const applyOrderTypeAll = (type) => {setOrderType(type);setCart((c) => c.map((l) => ({ ...l, type })));};
  const removeLine = (u) => {
    const next = cart.filter((l) => l.uid !== u);
    // buang item-gratis yang trigger-nya sudah tidak ada di keranjang
    const cleaned = next.filter((l) => {
      if (!l.free || !l.promoId) return true;
      const p = promoById(l.promoId);
      if (p && p.scope === 'item' && p.requireItem) return next.some((x) => !x.free && x.itemId === p.requireItem);
      return true;
    });
    setCart(cleaned);
    // lepas promo item-gratis yang baris gratisnya ikut terbuang
    const liveFreePromoIds = cleaned.filter((l) => l.free && l.promoId).map((l) => l.promoId);
    setApplied((a) => a.filter((x) => {
      const p = promoById(x.id);
      if (p && p.kind === 'free-item' && p.scope === 'item') return liveFreePromoIds.includes(x.id);
      return true;
    }));
  };

  const cartSubtotal = () => cart.filter((l) => !l.free).reduce((s, l) => s + l.unit * l.qty, 0);
  const freeCount = () => cart.filter((l) => l.free).reduce((s, l) => s + l.qty, 0);
  const promoDiscount = () => {
    const sub = cartSubtotal();
    return applied.reduce((sum, a) => {
      const p = promoById(a.id);
      if (!p || p.min && sub < p.min) return sum;
      if (p.kind === 'percent') return sum + Math.min(p.cap || Infinity, Math.round(sub * p.value));
      if (p.kind === 'fixed') return sum + p.value;
      return sum;
    }, 0);
  };

  const TAX_RATE = 0.10;

  // diskon item otomatis (mis. beli 2 diskon 40%) — dihitung dari isi keranjang, tak perlu di-apply
  const itemDiscountLines = () => PROMOS.
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
    const freeValue = cart.filter((l) => l.free).reduce((s, l) => s + ((itemById(l.itemId) || {}).price || 0) * l.qty, 0);
    const subtotal = paidSubtotal + freeValue;
    const discount = promoDiscount();
    const itemDisc = itemDiscount();
    const freeDisc = freeValue;
    const net = Math.max(0, subtotal - discount - itemDisc - freeDisc);
    const service = Math.round(net * SERVICE_RATE);
    const taxBase = net + service;
    const tax = taxInclusive ? taxBase - Math.round(taxBase / (1 + TAX_RATE)) : Math.round(taxBase * TAX_RATE);
    const rawTotal = taxInclusive ? taxBase : taxBase + tax;
    const total = roundValue(rawTotal);
    return { subtotal, paidSubtotal, freeValue, freeDisc, discount, itemDisc, net, service, serviceRate: SERVICE_RATE, tax, taxInclusive, taxRate: TAX_RATE, rounding: total - rawTotal, total };
  };

  const taxAmount = (base) => {
    const b = base != null ? base : Math.max(0, cartSubtotal() - promoDiscount() - itemDiscount());
    return taxInclusive ? b - Math.round(b / (1 + TAX_RATE)) : Math.round(b * TAX_RATE);
  };
  const orderTotal = () => computeBill().total;

  // ── promo ──
  const applyPromo = (id, pick, opts) => {
    const p = promoById(id);
    if (p.scope === 'transaction') {
      // hanya 1 voucher transaksi boleh aktif — voucher transaksi lain dilepas dulu
      setApplied((a) => {
        const dropIds = a.filter((x) => {const q = promoById(x.id);return q && q.scope === 'transaction' && x.id !== id;}).map((x) => x.id);
        const kept = a.filter((x) => !dropIds.includes(x.id));
        return kept.some((x) => x.id === id) ? kept : [...kept, { id, pick: pick || null }];
      });
      // buang baris item-gratis milik voucher transaksi yang dilepas
      setCart((c) => c.filter((l) => {const q = l.promoId && promoById(l.promoId);return !(q && q.scope === 'transaction' && l.promoId !== id);}));
    } else {
      setApplied((a) => a.some((x) => x.id === id) ? a : [...a, { id, pick: pick || null }]);
    }
    if (p.kind === 'free-item') {
      const itemId = p.needsPick ? pick : p.fixedItem;
      const it = itemById(itemId);
      setCart((c) => {
        const without = c.filter((l) => l.promoId !== id);
        const trig = p.requireItem ? without.find((l) => !l.free && l.itemId === p.requireItem) : null;
        const ftype = trig ? trig.type : orderType;
        return [...without, { uid: uid.current++, itemId, name: it.name, unit: 0, qty: 1, options: opts && opts.options || [], notes: opts && opts.notes || '', free: true, promoId: id, type: ftype }];
      });
    }
  };
  const removePromo = (id) => {
    setApplied((a) => a.filter((x) => x.id !== id));
    // Kembalikan referensi cart yang sama jika tidak ada item yang dihapus (voucher).
    // Tanpa ini, cart selalu membuat referensi baru → efek auto-apply terpicu ulang.
    setCart((c) => {const next = c.filter((l) => l.promoId !== id);return next.length === c.length ? c : next;});
  };
  const unlockPromo = (id) => setUnlocked((u) => u.includes(id) ? u : [...u, id]);

  // ── Promo transaksi 100% manual: TIDAK ada auto-apply ──
  // Voucher hanya aktif kalau user klaim sendiri dari keranjang. Effect ini cuma
  // menjaga konsistensi: kalau voucher yang sudah dipakai jadi tidak lagi memenuhi
  // syarat (keranjang kosong atau turun di bawah min. belanja), voucher dilepas
  // otomatis — supaya tidak ada promo "nyangkut" yang tak berlaku.
  useE(() => {
    const appliedTx = applied.find((a) => {const q = promoById(a.id);return q && q.scope === 'transaction';});
    if (!appliedTx) return;
    const p = promoById(appliedTx.id);
    if (!p) return;
    const paidCount = cart.filter((l) => !l.free).length;
    const sub = cartSubtotal();
    const stillValid = paidCount > 0 && (!p.min || sub >= p.min);
    if (!stillValid) removePromo(appliedTx.id);
  }, [cart, unlocked]);

  // ── open bill ──
  const submitOrder = (info) => {
    const total = computeBill().total;
    const cust = info && (info.name || info.phone) ? { name: info.name || '', phone: info.phone || '' } : null;
    const order = { id: 'o' + Date.now(), num: orderNum.current++, time: 'Baru saja', createdAt: Date.now(), lines: cart, applied, total, customer: cust };
    setOrders((o) => [...o, order]);
    setCart([]);setApplied([]);
    // Sidebar: kembali ke menu dgn tab Tagihan (bukan halaman terpisah). Klasik: halaman bill.
    if (tw.menuShell === 'klasik') go('bill', { root: true });else
    go('menu', { root: true, tab: 'bill' });
  };
  const grandTotal = () => orders.reduce((s, o) => s + o.total, 0);

  // ── auth — WhatsApp login, just-in-time at "Lihat Keranjang" ──
  const login = (num) => {if (num) setPhoneNum(num);setLoggedIn(true);};
  const logout = () => setLoggedIn(false);

  const store = {
    mode, table, menuLayout: tw.menuLayout, menuShell: tw.menuShell, menuHeader: tw.menuHeader, billStrip: tw.billStrip, billStripLayout: tw.billStripLayout, voucherStyle: tw.voucherStyle, offerSeeAll: tw.offerSeeAll, authMethod: tw.authMethod, pickerStyle: tw.pickerStyle, checkoutSummary: tw.checkoutSummary, shareStyle: tw.shareStyle, orderType, setOrderType, orderNote, setOrderNote,
    phone, loggedIn, login, logout,
    phoneHint: phone ? phone.slice(0, 3) + ' ' + phone.slice(3, 7) + ' ' + phone.slice(7) : '••• •••• ••••',
    orderRef, cart, applied, unlocked, orders, payment,
    confirm, askConfirm: (opts) => setConfirm(opts), closeConfirm: () => setConfirm(null),
    go, back, openSheet, closeSheet, openItem, reset, startSession,
    setPhone: setPhoneNum, addToCart, setLineQty, setLineType, applyOrderTypeAll, removeLine,
    cartSubtotal, freeCount, promoDiscount, itemDiscount, itemDiscountLines, taxAmount, orderTotal, computeBill, serviceRate: SERVICE_RATE, taxInclusive, roundValue, roundTo: ROUND_TO, TAX_RATE, applyPromo, removePromo, unlockPromo,
    submitOrder, grandTotal, setPayment: setPay,
    statusWhite, setStatusWhite
  };

  // ── screen registry ──
  const SCREENS = {
    entry: EntryScreen, phone: PhoneScreen, otp: OtpScreen, menu: MenuScreen,
    item: ItemScreen, search: SearchScreen, offers: OffersScreen, vouchers: PromoScreen, cart: CartScreen, promo: PromoScreen, confirm: ConfirmScreen, processing: ProcessingScreen,
    profile: ProfileScreen,
    bill: BillScreen, settle: SettleScreen, success: SuccessScreen, paid: SuccessScreen, cashstatus: CashStatusScreen, share: ShareReceiptScreen
  };
  const SHEETS = { freeitem: FreeItemSheet, orderType: OrderTypeSheet, login: LoginSheet, voucher: VoucherSheet, itemPicker: ItemPickerSheet, shareReceipt: ShareReceiptSheet };
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
          <TweakSelect label="Tema" value={tw.visualStyle} options={[
          { value: 'linen', label: 'Linen · hangat' },
          { value: 'porcelain', label: 'Porcelain · sejuk' },
          { value: 'noir', label: 'Noir · gelap mewah' }]
          } onChange={(v) => setTweak('visualStyle', v)} />
          <TweakSelect label="Tipografi" value={tw.fonts} options={[
          { value: 'elegan', label: 'Elegan · serif' },
          { value: 'modern', label: 'Modern · sans' },
          { value: 'kontras', label: 'Kontras · editorial' }]
          } onChange={(v) => setTweak('fonts', v)} />
          <TweakColor label="Warna utama" value={tw.primaryColor} options={['#1799A5', '#1F8A5B', '#B5532A', '#2A5DB0', '#8C5BD0']} onChange={(v) => setTweak('primaryColor', v)} />
          <TweakSection label="Tata Letak" />
          <TweakRadio label="Tampilan Menu" value={tw.menuShell || 'sidebar'} options={[{ value: 'sidebar', label: 'Sidebar' }, { value: 'klasik', label: 'Klasik' }]} onChange={(v) => setTweak('menuShell', v)} />
          {(tw.menuShell || 'sidebar') === 'klasik' && <TweakRadio label="Tagihan Berjalan" value={tw.billStrip || 'on'} options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]} onChange={(v) => setTweak('billStrip', v)} />}
          {(tw.menuShell || 'sidebar') === 'klasik' && (tw.billStrip || 'on') !== 'off' && <TweakSelect label="Layout Tagihan" value={tw.billStripLayout || 'navbar'} options={[
          { value: 'navbar', label: 'Navbar bawah ★' },
          { value: 'atas', label: 'Strip atas' },
          { value: 'banner', label: 'Banner · bawah header' },
          { value: 'bawah', label: 'Bar bawah' },
          { value: 'dua', label: 'Bar bawah · 2 segmen' },
          { value: 'pill', label: 'Pill mengambang' },
          { value: 'chip', label: 'Chip di header' },
          { value: 'struk', label: 'Struk mengintip' },
          { value: 'shade', label: 'Tarik (shade)' },
          { value: 'tab', label: 'Tab di atas' }]
          } onChange={(v) => setTweak('billStripLayout', v)} />}
          <TweakRadio label="Kartu Menu" value={tw.menuLayout} options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} onChange={(v) => setTweak('menuLayout', v)} />
          <TweakSelect label="Header Menu" value={tw.menuHeader || 'kartu'} options={[
            { value: 'kartu', label: 'Kartu' },
            { value: 'menyatu', label: 'Menyatu' },
            { value: 'hero-search', label: 'A \u00b7 Hero + Search' },
            { value: 'split', label: 'B \u00b7 Split warna' },
            { value: 'search-first', label: 'C \u00b7 Search first' },
            { value: 'cat-visual', label: 'D \u00b7 Kategori visual' }
          ]} onChange={(v) => setTweak('menuHeader', v)} />
          <TweakRadio label="Voucher" value={tw.voucherStyle} options={[{ value: 'kupon', label: 'Kupon' }, { value: 'kartu', label: 'Kartu' }, { value: 'tiket', label: 'Tiket' }, { value: 'minimal', label: 'Minimalis' }]} onChange={(v) => setTweak('voucherStyle', v)} />
          <TweakRadio label="Lihat Semua" value={tw.offerSeeAll} options={[{ value: 'icon', label: 'Ikon' }, { value: 'card', label: 'Kartu' }, { value: 'pill', label: 'Pill' }]} onChange={(v) => setTweak('offerSeeAll', v)} />
          <TweakRadio label="Picker Item" value={tw.pickerStyle} options={[{ value: 'kartu', label: 'Kartu' }, { value: 'ringkas', label: 'Ringkas' }, { value: 'blok', label: 'Blok' }]} onChange={(v) => setTweak('pickerStyle', v)} />
          <TweakRadio label="Ringkasan Checkout" value={tw.checkoutSummary} options={[{ value: 'dua', label: 'Dua Kartu' }, { value: 'struk', label: 'Struk' }, { value: 'flat', label: 'Flat' }, { value: 'sheet', label: 'Ringkas' }]} onChange={(v) => setTweak('checkoutSummary', v)} />
          <TweakRadio label="Bagikan Struk" value={tw.shareStyle || 'overlay'} options={[{ value: 'overlay', label: 'Overlay' }, { value: 'page', label: 'Halaman' }]} onChange={(v) => setTweak('shareStyle', v)} />
          <TweakSection label="Tarif & Pajak" />
          <TweakRadio label="Pajak" value={tw.taxMode || 'exclude'} options={[{ value: 'exclude', label: 'Belum termasuk' }, { value: 'include', label: 'Termasuk' }]} onChange={(v) => setTweak('taxMode', v)} />
          <TweakRadio label="Service Charge" value={tw.serviceCharge || 'off'} options={[{ value: 'off', label: 'Tidak' }, { value: '5', label: '5%' }, { value: '10', label: '10%' }]} onChange={(v) => setTweak('serviceCharge', v)} />
          <TweakRadio label="Pembulatan" value={tw.rounding} options={[{ value: 'off', label: 'Tidak' }, { value: '100', label: 'Rp100' }, { value: '500', label: 'Rp500' }]} onChange={(v) => setTweak('rounding', v)} />
          <TweakSection label="Autentikasi" />
          <TweakRadio label="Login" value={tw.authMethod} options={[{ value: 'whatsapp', label: 'WhatsApp' }, { value: 'otp', label: 'No. HP + OTP' }]} onChange={(v) => setTweak('authMethod', v)} />
        </TweaksPanel>
      </AppCtx.Provider>
    </ThemeCtx.Provider>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);