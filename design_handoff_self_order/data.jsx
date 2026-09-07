// data.jsx — design tokens, themes, menu + promo data, helpers.
// Exported to window for cross-file (babel) sharing.

// ── Money ──────────────────────────────────────────────────
const rupiah = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0));

// ── Themes ─────────────────────────────────────────────────
const FONT_SETS = {
  elegan:  { display: '"Hanken Grotesk", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif', displayWeight: 600, italic: false },
  modern:  { display: '"Hanken Grotesk", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif', displayWeight: 700, italic: false },
  kontras: { display: '"Hanken Grotesk", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif', displayWeight: 800, italic: false },
};

function makeTheme({ style = 'porcelain', primary = '#1799A5', fonts = 'elegan' } = {}) {
  const f = FONT_SETS[fonts] || FONT_SETS.elegan;
  const base = {
    primary,
    onPrimary: '#FFFFFF',
    accent: '#B8893B',
    accentSoft: 'rgba(184,137,59,0.12)',
    fontDisplay: f.display,
    fontBody: f.body,
    displayWeight: f.displayWeight,
    displayItalic: f.italic,
    radius: 18,
    radiusSm: 12,
    radiusLg: 26,
  };
  const themes = {
    linen: {
      ...base,
      name: 'Linen',
      bg: '#F4EFE7',
      bgTint: '#EDE6DA',
      surface: '#FFFFFF',
      surface2: '#FAF6F0',
      ink: '#1E1B16',
      muted: '#6F685D',
      faint: '#A79E90',
      line: 'rgba(30,27,22,0.09)',
      lineStrong: 'rgba(30,27,22,0.16)',
      primarySoft: 'rgba(23,153,165,0.10)',
      shadow: '0 1px 2px rgba(40,33,22,0.04), 0 8px 24px rgba(40,33,22,0.06)',
      statusDark: false,
      placeholder: '#E7DFD2',
      placeholderInk: '#B6A98F',
    },
    porcelain: {
      ...base,
      name: 'Porcelain',
      bg: '#EEF2F2',
      bgTint: '#E5EBEB',
      surface: '#FFFFFF',
      surface2: '#F6F9F9',
      ink: '#13201F',
      muted: '#5C6B6A',
      faint: '#9BAAA9',
      line: 'rgba(19,32,31,0.08)',
      lineStrong: 'rgba(19,32,31,0.15)',
      primarySoft: 'rgba(23,153,165,0.10)',
      shadow: '0 1px 2px rgba(20,40,40,0.04), 0 10px 30px rgba(20,50,50,0.07)',
      statusDark: false,
      placeholder: '#DDE6E6',
      placeholderInk: '#9DB0AF',
    },
    noir: {
      ...base,
      name: 'Noir',
      bg: '#121514',
      bgTint: '#0C0F0E',
      surface: '#1B201F',
      surface2: '#232927',
      ink: '#F3F0EA',
      muted: '#9AA29F',
      faint: '#6A726F',
      line: 'rgba(255,255,255,0.10)',
      lineStrong: 'rgba(255,255,255,0.18)',
      onPrimary: '#06201F',
      accent: '#D8B26B',
      accentSoft: 'rgba(216,178,107,0.14)',
      primarySoft: 'rgba(23,153,165,0.16)',
      shadow: '0 1px 2px rgba(0,0,0,0.4), 0 14px 34px rgba(0,0,0,0.45)',
      statusDark: true,
      placeholder: '#262D2B',
      placeholderInk: '#5C6663',
    },
  };
  return themes[style] || themes.porcelain;
}

// ── Brand ──────────────────────────────────────────────────
const BRAND = {
  name: 'POS',
  tagline: 'Kasir & Pesan Mandiri',
  location: 'Jakarta Barat',
  whatsapp: '6281380012025',
};

// ── Menu ───────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'signature', label: 'Best Seller' },
  { id: 'ayam', label: 'Ayam' },
  { id: 'nasi', label: 'Nasi' },
  { id: 'pembuka', label: 'Pembuka' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'manis', label: 'Pencuci Mulut' },
];

const SPICE = {
  id: 'spice', label: 'Tingkat Pedas', type: 'single', required: true,
  options: [
    { id: 'no', label: 'Tidak Pedas', price: 0 },
    { id: 'mild', label: 'Sedang', price: 0 },
    { id: 'hot', label: 'Pedas', price: 0 },
    { id: 'extra', label: 'Extra Pedas', price: 3000 },
  ],
};
const ADDON = {
  id: 'addon', label: 'Tambahan', type: 'multi', required: false,
  options: [
    { id: 'rice', label: 'Nasi Putih', price: 8000 },
    { id: 'egg', label: 'Telur Dadar', price: 7000 },
    { id: 'krupuk', label: 'Kerupuk Udang', price: 5000 },
  ],
};

// ── Grup pilihan paket (pilih 1 per grup) ──
const PKG_AYAM = {
  id: 'pkg-ayam', label: 'Pilihan Ayam', type: 'single', required: true,
  options: [
    { id: 'kremes',   label: 'Ayam Goreng Kremes',      price: 0 },
    { id: 'lengkuas', label: 'Ayam Goreng Lengkuas',    price: 0 },
    { id: 'penyet',   label: 'Ayam Penyet Sambal Ijo',  price: 3000 },
  ],
};
const PKG_NASI = {
  id: 'pkg-nasi', label: 'Pilihan Nasi', type: 'single', required: true,
  options: [
    { id: 'putih', label: 'Nasi Putih',          price: 0 },
    { id: 'bakar', label: 'Nasi Bakar Komplit',  price: 6000 },
  ],
};
const PKG_MINUM = {
  id: 'pkg-minum', label: 'Pilihan Minuman', type: 'single', required: true,
  options: [
    { id: 'esteh',   label: 'Es Teh Manis',     price: 0 },
    { id: 'esjeruk', label: 'Es Jeruk Peras',   price: 4000 },
    { id: 'kopi',    label: 'Kopi Susu Saji',   price: 8000 },
  ],
};

const UP = 'https://images.unsplash.com/';
const MENU = [
  { id: 'nasi-ayam-bakar', cat: 'signature', name: 'Nasi Ayam Bakar Madu', price: 45000, tag: 'Terlaris',
    desc: 'Ayam bakar bumbu madu, sambal terasi, lalapan & nasi hangat.', mods: [SPICE, ADDON], stock: 12,
    photo: UP + 'photo-1532550907401-a500c9a57435?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'nasi-bakar', cat: 'signature', name: 'Nasi Bakar Komplit', price: 42000,
    desc: 'Nasi bakar daun pisang isi ayam suwir, teri & kemangi.', mods: [SPICE], stock: 8,
    photo: UP + 'photo-1512058564366-18510be2db19?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'iga-bakar', cat: 'signature', name: 'Iga Bakar Saji', price: 78000,
    desc: 'Iga sapi empuk, glaze kecap manis, acar segar.', mods: [ADDON], stock: 4,
    photo: UP + 'photo-1544025162-d76694265947?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'paket-berdua', cat: 'signature', name: 'Paket Komplit Berdua', price: 95000, tag: 'Hemat',
    desc: 'Hemat untuk berdua — pilih ayam, nasi, dan minuman favoritmu.',
    mods: [PKG_AYAM, PKG_NASI, PKG_MINUM], stock: 10,
    photo: UP + 'photo-1432139555190-58524dae6a55?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'ayam-goreng-kremes', cat: 'ayam', name: 'Ayam Goreng Kremes', price: 38000, oldPrice: 52000,
    desc: 'Ayam kampung goreng, taburan kremes renyah.', mods: [SPICE], stock: 20,
    photo: UP + 'photo-1562967914-608f82629710?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'ayam-goreng-lengkuas', cat: 'ayam', name: 'Ayam Goreng Lengkuas', price: 38000,
    desc: 'Ayam berbalut serundeng lengkuas gurih.', mods: [SPICE], stock: 0,
    photo: UP + 'photo-1569058242253-92a9c755a0ec?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'ayam-penyet', cat: 'ayam', name: 'Ayam Penyet Sambal Ijo', price: 40000,
    desc: 'Ayam penyet dengan sambal ijo khas.', mods: [SPICE], stock: 6,
    photo: UP + 'photo-1455619452474-d2be8b1e70cd?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'nasgor', cat: 'nasi', name: 'Nasi Goreng Kampung', price: 35000, oldPrice: 50000,
    desc: 'Nasi goreng teri medan, telur mata sapi.', mods: [SPICE, ADDON], stock: 15,
    photo: UP + 'photo-1603133872878-684f208fb84b?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'nasi-putih', cat: 'nasi', name: 'Nasi Putih', price: 8000,
    desc: 'Sepiring nasi putih pulen.', mods: [], stock: 99,
    photo: UP + 'photo-1586201375761-83865001e31c?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'tahu-tempe', cat: 'pembuka', name: 'Tahu Tempe Krispi', price: 18000,
    desc: 'Tahu & tempe krispi, sambal kecap.', mods: [], stock: 18,
    photo: UP + 'photo-1546069901-ba9599a7e63c?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'sup-buntut', cat: 'pembuka', name: 'Sup Buntut Bening', price: 65000, tag: 'Premium',
    desc: 'Buntut sapi, kuah bening rempah, emping.', mods: [], stock: 5,
    photo: UP + 'photo-1547592166-23ac45744acd?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'es-teh', cat: 'minuman', name: 'Es Teh Manis', price: 8000,
    desc: 'Teh manis dingin menyegarkan.', mods: [], stock: 99,
    photo: UP + 'photo-1556679343-c7306c1976bc?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'es-jeruk', cat: 'minuman', name: 'Es Jeruk Peras', price: 15000,
    desc: 'Jeruk peras segar tanpa pemanis buatan.', mods: [], stock: 30,
    photo: UP + 'photo-1600271886742-f049cd451bba?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'teh-talua', cat: 'minuman', name: 'Teh Talua', price: 22000,
    desc: 'Teh telur khas Minang, hangat & creamy.', mods: [], stock: 10,
    photo: UP + 'photo-1564890369478-c89ca6d9cde9?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'kopi-susu', cat: 'minuman', name: 'Kopi Susu Saji', price: 25000, tag: 'Favorit',
    desc: 'Espresso, gula aren, susu segar.', mods: [], stock: 24,
    photo: UP + 'photo-1461023058943-07fcbe16d735?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'cendol', cat: 'manis', name: 'Es Cendol Durian', price: 28000, oldPrice: 40000,
    desc: 'Cendol, santan, gula merah & durian.', mods: [], stock: 9,
    photo: UP + 'photo-1551024506-0bccd828d307?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'pisang-goreng', cat: 'manis', name: 'Pisang Goreng Madu', price: 20000,
    desc: 'Pisang goreng madu, taburan keju.', mods: [], stock: 14,
    photo: UP + 'photo-1567620905732-2d1ec7ab7445?w=320&h=320&fit=crop&auto=format&q=75' },
];

// Standalone export: resolve menu photos to bundled blob URLs when available.
if (typeof window !== 'undefined' && window.__resources) {
  MENU.forEach((m) => { const r = window.__resources['img-' + m.id]; if (r) m.photo = r; });
}

const itemById = (id) => MENU.find((m) => m.id === id);

// ── Promo: taksonomi syarat (selaras dengan backend) ───────
// req  = tipe syarat: 'transaksi' (min. belanja) · 'kuantitas' (beli item) · 'lainnya' (follow IG dll)
// activation = 'claim' (semua promo harus diklaim manual) · 'locked' (buka aksi dulu, mis. follow IG)
// voucher = true → tampil tag "Voucher". reqText = teks chip syarat (statis, BUKAN kalkulasi keranjang).
const PROMO_REQ = {
  transaksi: { icon: 'receipt', filter: 'Min. belanja' },
  kuantitas: { icon: 'tag', filter: 'Beli item' },
  lainnya: { icon: 'instagram', filter: 'Follow IG' },
};

const PROMOS = [
  {
    id: 'free-ayam',
    scope: 'item',
    kind: 'free-item',
    req: 'kuantitas',
    reqText: 'Beli Nasi Ayam Bakar Madu',
    conds: ['Beli Nasi Ayam Bakar Madu'],
    activation: 'claim',
    title: 'Gratis Ayam Goreng',
    sub: 'Beli Nasi Ayam Bakar, gratis 1 Ayam Goreng',
    detail: 'Setiap pembelian Nasi Ayam Bakar Madu, dapatkan 1 Ayam Goreng gratis. Pilih varian saat klaim.',
    requireItem: 'nasi-ayam-bakar',
    needsPick: true,
    choices: ['ayam-goreng-kremes', 'ayam-goreng-lengkuas'],
    badge: 'Gratis Item',
    tagline: 'Beli 1, gratis Ayam Goreng',
  },
  {
    id: 'disc20',
    scope: 'transaction',
    kind: 'percent',
    req: 'transaksi',
    reqText: 'Min. belanja Rp100.000',
    conds: ['Min. belanja Rp100.000', 'Maks. potongan Rp30.000'],
    voucher: true,
    activation: 'claim',
    title: 'Diskon 20%',
    sub: 'Min. belanja Rp100.000 · maks. Rp30.000',
    detail: 'Potongan 20% dari subtotal, berlaku untuk minimum belanja Rp100.000, maksimal potongan Rp30.000.',
    value: 0.2,
    min: 100000,
    cap: 30000,
    badge: 'Voucher',
  },
  {
    id: 'hemat15',
    scope: 'transaction',
    kind: 'fixed',
    req: 'transaksi',
    reqText: 'Min. belanja Rp75.000',
    conds: ['Min. belanja Rp75.000'],
    voucher: true,
    activation: 'claim',
    title: 'Potongan Rp15.000',
    sub: 'Min. belanja Rp75.000',
    detail: 'Potongan langsung Rp15.000 untuk transaksi minimum Rp75.000.',
    value: 15000,
    min: 75000,
    badge: 'Voucher',
  },
  {
    id: 'free-esteh',
    scope: 'transaction',
    kind: 'free-item',
    req: 'transaksi',
    reqText: 'Min. belanja Rp50.000',
    conds: ['Min. belanja Rp50.000'],
    activation: 'claim',
    title: 'Gratis Es Teh Manis',
    sub: 'Min. belanja Rp50.000',
    detail: 'Gratis 1 Es Teh Manis untuk setiap transaksi minimum Rp50.000.',
    min: 50000,
    needsPick: false,
    fixedItem: 'es-teh',
    badge: 'Gratis Item',
    tagline: 'Gratis · min. belanja Rp50.000',
  },
];
const promoById = (id) => PROMOS.find((p) => p.id === id);
// voucher = promo yang mengurangi diskon transaksi (potongan %/nominal), BUKAN item gratis.
const isVoucher = (p) => p.scope === 'transaction' && (p.kind === 'percent' || p.kind === 'fixed');
// item yang jadi hadiah free-item (untuk ditampilkan di "Promo Hari Ini")
const freeItemTargets = (id) => PROMOS.some((p) => p.kind === 'free-item' && (p.fixedItem === id || (p.choices || []).includes(id)));

// ── promoReward — format kartu ditentukan JENIS HASIL promo ──
// percent/bulk → angka %; fixed → nominal; free-item → "Gratis <item>".
function promoReward(p) {
  if (p.kind === 'percent' || p.kind === 'bulk')
  return { value: Math.round(p.value * 100) + '%', label: p.kind === 'bulk' ? 'Diskon paket' : 'Diskon', icon: 'tag', free: false };
  if (p.kind === 'fixed')
  return { value: rupiah(p.value), label: 'Potongan harga', icon: 'tag', free: false };
  if (p.kind === 'free-item')
  return { value: 'Gratis', label: p.title.replace(/^Gratis\s*/i, ''), icon: 'gift', free: true };
  return { value: p.title, label: '', icon: 'tag', free: false };
}
// daftar syarat (berapa pun) — fallback ke reqText kalau conds belum ada
function promoConds(p) {return p.conds && p.conds.length ? p.conds : p.reqText ? [p.reqText] : [];}

// ── Payment methods ────────────────────────────────────────
const PAYMENTS = [
  { id: 'qris',  label: 'QRIS',          sub: 'Semua e-wallet & m-banking', kind: 'qr',   recommended: true },
  { id: 'cash',  label: 'Bayar Langsung', sub: 'Tunai atau kartu di kasir',  kind: 'cash', recommended: false },
];
const paymentById = (id) => PAYMENTS.find((p) => p.id === id);

Object.assign(window, {
  rupiah, makeTheme, FONT_SETS, BRAND,
  CATEGORIES, MENU, itemById,
  PROMOS, PROMO_REQ, promoById, promoReward, promoConds, isVoucher, freeItemTargets, PAYMENTS, paymentById,
});
