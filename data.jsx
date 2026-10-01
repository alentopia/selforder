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
  // soft tint derived from the chosen primary — so chips/badges follow the theme color
  const softFrom = (hex, a) => {
    const h = String(hex).replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  };
  // pilih teks di atas primary: putih utk warna gelap, ink gelap utk warna terang (mis. kuning/mint)
  const relLum = (hex) => {
    const h = String(hex).replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const r = chan(parseInt(n.slice(0, 2), 16)), g = chan(parseInt(n.slice(2, 4), 16)), b = chan(parseInt(n.slice(4, 6), 16));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const onPrimary = relLum(primary) > 0.55 ? '#1A1A1A' : '#FFFFFF';
  const base = {
    primary,
    primarySoft: softFrom(primary, 0.10),
    onPrimary,
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
      primarySoft: softFrom(primary, 0.16),
      shadow: '0 1px 2px rgba(0,0,0,0.4), 0 14px 34px rgba(0,0,0,0.45)',
      statusDark: true,
      placeholder: '#262D2B',
      placeholderInk: '#5C6663',
    },
  };
  return themes[style] || themes.porcelain;
}

// ── Brand ──────────────────────────────────────────────────
// QR Statis yang ditempel di meja (layar awal). Ganti di sini untuk menyesuaikan nomor meja.
const QR_TABLE = 'AA-01';

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
// Setiap varian ayam bisa butuh beberapa modifier tambahan sekaligus — semua tampil bersarang begitu ayamnya dipilih.
// Barang Grup (Figma "Case: Isi Paket & Pilihan"): BG induk → isi tetap (Barang Biasa)
// + grup modifier SATU tingkat. Pembungkus master data ("paket burger", "side dish combo")
// tidak ditampilkan — isinya dinaikkan satu tingkat.
const PKG_SNACK = {
  id: 'pkg-snack', label: 'Snack', type: 'single', required: true,
  options: [
    { id: 'applepie', label: 'Apple Pie',      price: 0 },
    { id: 'kentang',  label: 'Kentang Goreng', price: 0 },
  ],
};
const PKG_MINUMAN = {
  id: 'pkg-minuman', label: 'Minuman', type: 'single', required: true,
  options: [
    { id: 'jasmine',   label: 'Es Teh Jasmine', price: 0 },
    { id: 'milkshake', label: 'Milk Shake',     price: 0 },
  ],
};

// ── Paket Bundling — Nested Modifier (Figma 1952:53362) ──
// Pilihan Ayam = grup OptionRow level-atas; tiap varian ayam punya sub-grup (`subs`) yang
// baru tampil — sebagai ModifierChip bersarang — setelah varian itu dipilih.
const PKG_AYAM_PORSI = {
  id: 'pkg-ayam-porsi', label: 'Potongan', type: 'single', required: true,
  options: [
    { id: 'dada',  label: 'Dada',  price: 0 },
    { id: 'paha',  label: 'Paha',  price: 0 },
    { id: 'sayap', label: 'Sayap', price: 0 },
  ],
};
const PKG_AYAM_PEDAS = {
  id: 'pkg-ayam-pedas', label: 'Tingkat Kepedasan', type: 'single', required: true,
  options: [
    { id: 'tidak',  label: 'Tidak Pedas', price: 0 },
    { id: 'sedang', label: 'Sedang',      price: 0 },
    { id: 'pedas',  label: 'Pedas',       price: 0 },
  ],
};
const PKG_AYAM_SAMBAL = {
  id: 'pkg-ayam-sambal', label: 'Sambal', type: 'multi', required: false,
  options: [
    { id: 'terasi', label: 'Sambal Terasi', price: 0 },
    { id: 'ijo',    label: 'Sambal Ijo',    price: 0 },
    { id: 'matah',  label: 'Sambal Matah',  price: 2000 },
  ],
};
const PKG_AYAM = {
  id: 'pkg-ayam', label: 'Pilihan Ayam', type: 'single', required: true,
  options: [
    { id: 'kremes',   label: 'Ayam Goreng Kremes',     price: 0,    subs: [PKG_AYAM_PORSI, PKG_AYAM_PEDAS, PKG_AYAM_SAMBAL] },
    { id: 'lengkuas', label: 'Ayam Goreng Lengkuas',   price: 0,    subs: [PKG_AYAM_PORSI, PKG_AYAM_PEDAS, PKG_AYAM_SAMBAL] },
    // penyet sudah bersambal ijo → tanpa sub-grup Sambal
    { id: 'penyet',   label: 'Ayam Penyet Sambal Ijo', price: 3000, subs: [PKG_AYAM_PORSI, PKG_AYAM_PEDAS] },
  ],
};
const PKG_NASI = {
  id: 'pkg-nasi', label: 'Pilihan Nasi', type: 'single', required: true,
  options: [
    // Figma frame 3 (1948:69722): Nasi Putih terpilih tanpa harga & total Rp107.000 = 101.000 + Es Jeruk 4.000
    // + Sambal Matah 2.000 → Nasi Putih Rp0. (Frame 1 masih menulis +Rp8.000.)
    { id: 'putih', label: 'Nasi Putih',         price: 0 },
    { id: 'bakar', label: 'Nasi Bakar Komplit', price: 6000 },
  ],
};
const PKG_MINUM = {
  id: 'pkg-minum', label: 'Pilihan Minuman', type: 'single', required: true,
  options: [
    { id: 'esteh',   label: 'Es Teh Manis',   price: 0 },
    { id: 'esjeruk', label: 'Es Jeruk Peras', price: 4000 },
    { id: 'kopi',    label: 'Kopi Susu Saji', price: 8000 },
  ],
};

const UP = 'https://images.unsplash.com/';
const MENU = [
  { id: 'nasi-ayam-bakar', cat: 'signature', name: 'Nasi Ayam Bakar Madu', price: 45000, tag: 'Terlaris',
    desc: 'Ayam bakar bumbu madu, sambal terasi, lalapan & nasi hangat.', mods: [SPICE, ADDON],
    photo: UP + 'photo-1532550907401-a500c9a57435?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'nasi-bakar', cat: 'signature', name: 'Nasi Bakar Komplit', price: 42000,
    desc: 'Nasi bakar daun pisang isi ayam suwir, teri & kemangi.', mods: [SPICE],
    photo: UP + 'photo-1512058564366-18510be2db19?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'iga-bakar', cat: 'signature', name: 'Iga Bakar Saji', price: 78000,
    desc: 'Iga sapi empuk, glaze kecap manis, acar segar.', mods: [ADDON],
    photo: UP + 'photo-1544025162-d76694265947?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'burger-combo', cat: 'signature', name: 'Burger Combo Deluxe', price: 105000, tag: 'Hemat',
    desc: 'Sepuluh burger untuk ramai-ramai — tinggal pilih snack dan minumannya.',
    // isi tetap: tampil di Detail Menu, Keranjang, Konfirmasi & Struk
    contents: [{ qty: 5, name: 'Burger Bangor Sapi' }, { qty: 5, name: 'Burger Bangor Ayam' }],
    mods: [PKG_SNACK, PKG_MINUMAN],
    photo: 'assets/burger-combo.png' },
  { id: 'paket-berdua', cat: 'signature', name: 'Paket Komplit Berdua', price: 101000, tag: 'Hemat',
    desc: 'Hemat untuk berdua — pilih ayam, nasi, dan minuman favoritmu',
    mods: [PKG_AYAM, PKG_NASI, PKG_MINUM],
    photo: 'assets/paket-komplit-berdua.jpg' },

  { id: 'ayam-goreng-kremes', cat: 'ayam', name: 'Ayam Goreng Kremes', price: 38000,
    desc: 'Ayam kampung goreng, taburan kremes renyah.', mods: [SPICE],
    photo: UP + 'photo-1562967914-608f82629710?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'ayam-goreng-lengkuas', cat: 'ayam', name: 'Ayam Goreng Lengkuas', price: 38000,
    desc: 'Ayam berbalut serundeng lengkuas gurih.', mods: [SPICE],
    photo: UP + 'photo-1569058242253-92a9c755a0ec?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'ayam-penyet', cat: 'ayam', name: 'Ayam Penyet Sambal Ijo', price: 40000,
    desc: 'Ayam penyet dengan sambal ijo khas.', mods: [SPICE],
    photo: UP + 'photo-1455619452474-d2be8b1e70cd?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'sate-ayam-madu', cat: 'ayam', name: 'Sate Ayam Madu', price: 42000, tag: 'Promo',
    desc: 'Sepuluh tusuk sate ayam, bumbu kacang & kecap madu.', mods: [SPICE],
    photo: UP + 'photo-1529692236671-f1f6cf9683ba?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'nasgor', cat: 'nasi', name: 'Nasi Goreng Kampung', price: 35000, oldPrice: 50000,
    desc: 'Nasi goreng teri medan, telur mata sapi.', mods: [SPICE, ADDON],
    photo: UP + 'photo-1603133872878-684f208fb84b?w=320&h=320&fit=crop&auto=format&q=75' },
  // Case nama kepanjangan (84 karakter): terpotong "…" di kartu menu, tampil penuh di
  // Detail Menu, Keranjang, Konfirmasi Pesanan & Pembayaran berhasil.
  { id: 'nasgor-seafood', cat: 'nasi', name: 'Nasi Goreng Seafood Spesial Udang Cumi Kerang dengan Telur Mata Sapi & Kerupuk Udang', price: 58000,
    desc: 'Nasi goreng bumbu rempah dengan udang, cumi, kerang, telur mata sapi & kerupuk udang.', mods: [SPICE, ADDON],
    photo: UP + 'photo-1603133872878-684f208fb84b?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'nasi-putih', cat: 'nasi', name: 'Nasi Putih', price: 8000,
    desc: 'Sepiring nasi putih pulen.', mods: [],
    photo: UP + 'photo-1586201375761-83865001e31c?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'tahu-tempe', cat: 'pembuka', name: 'Tahu Tempe Krispi', price: 18000,
    desc: 'Tahu & tempe krispi, sambal kecap.', mods: [],
    photo: UP + 'photo-1546069901-ba9599a7e63c?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'sup-buntut', cat: 'pembuka', name: 'Sup Buntut Bening', price: 65000, tag: 'Premium',
    desc: 'Buntut sapi, kuah bening rempah, emping.', mods: [],
    photo: UP + 'photo-1547592166-23ac45744acd?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'es-teh', cat: 'minuman', name: 'Es Teh Manis', price: 8000,
    desc: 'Teh manis dingin menyegarkan.', mods: [],
    photo: UP + 'photo-1556679343-c7306c1976bc?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'es-jeruk', cat: 'minuman', name: 'Es Jeruk Peras', price: 15000,
    desc: 'Jeruk peras segar tanpa pemanis buatan.', mods: [],
    photo: UP + 'photo-1600271886742-f049cd451bba?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'teh-talua', cat: 'minuman', name: 'Teh Talua', price: 22000,
    desc: 'Teh telur khas Minang, hangat & creamy.', mods: [],
    photo: UP + 'photo-1564890369478-c89ca6d9cde9?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'kopi-susu', cat: 'minuman', name: 'Kopi Susu Saji', price: 25000, tag: 'Favorit',
    desc: 'Espresso, gula aren, susu segar.', mods: [],
    photo: UP + 'photo-1461023058943-07fcbe16d735?w=320&h=320&fit=crop&auto=format&q=75' },

  { id: 'cendol', cat: 'manis', name: 'Es Cendol Durian', price: 28000, oldPrice: 40000,
    desc: 'Cendol, santan, gula merah & durian.', mods: [],
    photo: UP + 'photo-1551024506-0bccd828d307?w=320&h=320&fit=crop&auto=format&q=75' },
  { id: 'pisang-goreng', cat: 'manis', name: 'Pisang Goreng Madu', price: 20000,
    desc: 'Pisang goreng madu, taburan keju.', mods: [],
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
    detail: 'Beli Nasi Ayam Bakar Madu, lalu tambahkan sendiri Ayam Goreng Kremes atau Ayam Goreng Lengkuas dari menu. 1 porsi Ayam Goreng otomatis jadi gratis di Keranjang.',
    requireItem: 'nasi-ayam-bakar',
    needsPick: true,
    choices: ['ayam-goreng-kremes', 'ayam-goreng-lengkuas'],
    badge: 'Gratis Item',
    tagline: 'Beli 1, gratis Ayam Goreng',
    period: { dates: ['2025-06-09', '2025-06-10'], days: [1, 2, 3, 4, 5], hours: [['13.00', '14.00'], ['17.00', '18.00']] },
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
    period: { dates: ['2025-06-10', '2025-06-10'], days: 'all', hours: [['00.00', '23.59']] },
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
    period: { dates: ['2025-06-01', '2025-06-30'], days: 'all', hours: [['00.00', '23.59']] },
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
    detail: 'Tambahkan sendiri Es Teh Manis dari menu. Untuk transaksi minimum Rp50.000, 1 Es Teh Manis otomatis jadi gratis di Keranjang.',
    min: 50000,
    needsPick: false,
    fixedItem: 'es-teh',
    badge: 'Gratis Item',
    tagline: 'Gratis · min. belanja Rp50.000',
    period: { dates: ['2025-06-09', '2025-06-10'], days: 'all', hours: [['10.00', '22.00']] },
  },
  {
    id: 'bulk-sate',
    scope: 'item',
    kind: 'bulk',
    req: 'kuantitas',
    reqText: 'Beli 2 Sate Ayam Madu',
    conds: ['Beli min. 2 porsi', 'Diskon 20% otomatis di keranjang'],
    activation: 'claim',
    title: 'Beli 2 Diskon 20%',
    sub: 'Khusus Sate Ayam Madu',
    detail: 'Beli 2 porsi Sate Ayam Madu atau lebih, langsung dapat potongan 20% untuk item ini. Diskon otomatis terhitung di keranjang — tanpa perlu klaim.',
    requireItem: 'sate-ayam-madu',
    minQty: 2,
    value: 0.2,
    badge: 'Promo Item',
    tagline: 'Beli 2, diskon 20%',
    period: { dates: ['2025-06-01', '2025-06-30'], days: [1, 2, 3, 4, 5], hours: [['11.00', '14.00']] },
  },
  {
    // harga coret di menu (MENU.oldPrice) = Promo Produk. Potongannya sudah masuk ke
    // MENU.price, jadi promo ini hanya memberi nama & detail untuk penanda di keranjang.
    id: 'disc30-produk',
    scope: 'item',
    kind: 'price',
    req: 'kuantitas',
    items: ['nasgor', 'cendol'],
    activation: 'auto',
    title: 'Diskon 30%',
    sub: 'Promo Produk',
    detail: 'Diskon 30% untuk item yang memenuhi syarat promo. Promo diterapkan otomatis di Keranjang saat syarat terpenuhi.',
    terms: ['Berlaku untuk item yang memenuhi syarat'],
    value: 0.3,
    badge: 'Promo Produk',
    period: { dates: ['2025-06-10', '2025-06-10'], days: [1, 2, 3, 4, 5, 6], hours: [['00.00', '23.59']] },
  },
];
const promoById = (id) => PROMOS.find((p) => p.id === id);
// voucher = promo yang mengurangi diskon transaksi (potongan %/nominal), BUKAN item gratis.
const isVoucher = (p) => p.scope === 'transaction' && (p.kind === 'percent' || p.kind === 'fixed');

// ── Auto-apply (MVP) — fungsi murni, dipakai app.jsx ──
// besar potongan Diskon Transaksi untuk subtotal tertentu (0 kalau min. belanja belum terpenuhi)
function txPromoAmount(p, sub) {
  if (p.min && sub < p.min) return 0;
  if (p.kind === 'percent') return Math.min(p.cap || Infinity, Math.round(sub * p.value));
  if (p.kind === 'fixed') return Math.min(p.value, sub);
  return 0;
}
// Diskon Transaksi yang berlaku: potongan terbesar di antara yang memenuhi syarat
function bestTxPromo(sub) {
  return PROMOS.filter(isVoucher).reduce((best, p) => {
    const amt = txPromoAmount(p, sub);
    return amt > 0 && (!best || amt > txPromoAmount(best, sub)) ? p : best;
  }, null);
}
// promo harga coret (kind 'price') untuk sebuah item menu
const strikePromoFor = (itemId) => PROMOS.find((p) => p.kind === 'price' && (p.items || []).includes(itemId));
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

// ── promoSummary — kalimat ringkas promo (katalog + kepala Detail) ──
// 4 template, sumber: Figma "Tabel Template Deskripsi Promo (4 Template)":
// 1 Promo Produk nominal : Diskon Rp{nominal} pada {item}. Maksimum {n} barang terdiskon dalam satuan pcs.
// 2 Promo Produk persen  : Diskon {persen}% pada {item}. Maksimum {n} barang terdiskon dalam satuan pcs. (gratis = 100%)
// 3 Diskon Transaksi %   : Diskon {persen}% pada transaksi. Maksimum potongan Rp{cap}.
// 4 Diskon Transaksi Rp  : Diskon Rp{nominal} pada transaksi.
// Kalimat "Maksimum n barang" hanya muncul kalau promonya memang membatasi jumlah
// (item gratis selalu 1; bulk berlaku untuk semua porsi, jadi tanpa batas).
function promoSummary(p) {
  const pct = (v) => Math.round(v * 100) + '%';
  if (isVoucher(p)) {
    if (p.kind === 'percent') return 'Diskon ' + pct(p.value) + ' pada transaksi.' + (p.cap ? ' Maksimum potongan ' + rupiah(p.cap) + '.' : '');
    return 'Diskon ' + rupiah(p.value) + ' pada transaksi.';
  }
  const free = p.kind === 'free-item';
  const ids = free ? (p.needsPick ? p.choices : [p.fixedItem]) : p.items || [p.requireItem];
  const items = ids.map((id) => (itemById(id) || {}).name).filter(Boolean).join(' atau ');
  const amount = free ? '100%' : p.kind === 'fixed' ? rupiah(p.value) : pct(p.value);
  const maxQty = free ? 1 : p.maxQty;
  return 'Diskon ' + amount + ' pada ' + items + '.' + (maxQty ? ' Maksimum ' + maxQty + ' barang terdiskon dalam satuan pcs.' : '');
}

// ── promoTerms — syarat versi kalimat lengkap (blok "Syarat" di Detail) ──
// Beda dari promoConds (chip singkat di kartu keranjang). p.terms menimpa hasil turunan.
function promoTerms(p) {
  if (p.terms) return p.terms;
  const out = [];
  if (p.requireItem) out.push('Pembelian Minimum ' + (p.minQty || 1) + ' ' + ((itemById(p.requireItem) || {}).name || '') + ' dalam satuan PCS');
  // "(Maksimal 30.000)" tanpa "Rp" — mengikuti copy Figma apa adanya
  if (p.min) out.push('Minimal transaksi ' + rupiah(p.min) + (p.cap ? ' (Maksimal ' + rupiah(p.cap).replace(/^Rp/, '') + ')' : ''));
  return out.length ? out : promoConds(p);
}

// ── promoPeriod — teks blok "Periode Promosi" ──
// period.dates = [mulai, selesai] (ISO) · days = 'all' | [0=Minggu … 6=Sabtu] · hours = [[mulai, selesai], …]
const ID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const ID_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
function promoPeriod(p) {
  const pr = p.period;
  if (!pr) return null;
  const fmtDate = (iso) => {const [y, m, d] = iso.split('-').map(Number);return d + ' ' + ID_MONTHS[m - 1] + ' ' + y;};
  // urut Senin → Minggu; 3+ hari berurutan diringkas jadi "Hari X Sampai Y"
  const order = (d) => d === 0 ? 7 : d;
  const days = pr.days === 'all' || pr.days.length === 7 ? null : [...pr.days].sort((a, b) => order(a) - order(b));
  const consecutive = days && days.length >= 3 && days.every((d, i) => i === 0 || order(d) === order(days[i - 1]) + 1);
  const dayText = !days ? 'Setiap hari' :
  consecutive ? 'Hari ' + ID_DAYS[days[0]] + ' Sampai ' + ID_DAYS[days[days.length - 1]] :
  'Hari ' + days.map((d) => ID_DAYS[d]).join(', ');
  const ranges = pr.hours.map(([a, b]) => a + ' - ' + b);
  return {
    dates: fmtDate(pr.dates[0]) + ' - ' + fmtDate(pr.dates[1]),
    days: dayText,
    hours: ranges.length === 2 ? ranges.join(' dan ') : ranges.join(', ')
  };
}


// ── Payment methods ────────────────────────────────────────
const PAYMENTS = [
  { id: 'qris',  label: 'QRIS',          sub: 'Semua e-wallet & m-banking', kind: 'qr',   recommended: true },
  { id: 'cash',  label: 'Bayar di Kasir', sub: 'Tunai atau kartu di kasir',  kind: 'cash', recommended: false },
];
const paymentById = (id) => PAYMENTS.find((p) => p.id === id);

Object.assign(window, {
  rupiah, makeTheme, FONT_SETS, BRAND, QR_TABLE,
  CATEGORIES, MENU, itemById,
  PROMOS, PROMO_REQ, promoById, promoReward, promoConds, promoSummary, promoTerms, promoPeriod, isVoucher, txPromoAmount, bestTxPromo, strikePromoFor, freeItemTargets, PAYMENTS, paymentById,
});
