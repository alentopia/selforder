# Handoff: Self Order — QR-Based Restaurant Self-Ordering App

## Overview
A complete mobile self-ordering kiosk app for restaurants. Customers scan a QR code at their table, browse the menu, add items to their cart, and pay via QRIS or at the cashier. Supports two modes:
- **QR Statis (Static QR):** Single item order → pay immediately (QRIS or cash).
- **QR Dinamis (Open Bill):** Multiple orders per session → pay everything at the end.

## About the Design Files
The files in this bundle are **high-fidelity HTML/JSX prototypes** built in-browser with React + Babel. They are design references showing intended look, feel, and behaviour — **not production code to ship directly**. The task is to recreate these designs in the target codebase using its existing framework, libraries, and patterns (or choose the best framework if none exists). For Figma specifically: Claude Code should use the Figma REST API (with a user-supplied personal access token) to create frames and layers from the designs.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, component states, and interactions are all specified. Recreate pixel-precisely using the codebase's libraries.

---

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `bg` | `#eef2f2` | Page background (linen) |
| `surface` | `#ffffff` | Cards, sheets |
| `surface2` | `#e2eaea` | Inputs, secondary bg |
| `primary` | `#1799A5` | Brand teal — CTAs, active states |
| `onPrimary` | `#ffffff` | Text on primary |
| `primarySoft` | `rgba(23,153,165,0.10)` | Chip bg, badge bg |
| `ink` | `#141e1e` | Main text |
| `muted` | `#5a7070` | Secondary text |
| `faint` | `#8aacac` | Placeholder, hints |
| `line` | `#d4e0e0` | Dividers, borders |
| `lineStrong` | `#bfd0d0` | Strong dividers |

### Typography
| Role | Font | Size | Weight |
|---|---|---|---|
| Display | Hanken Grotesk | 18–46px | 700–800 |
| Body | Hanken Grotesk | 12–16px | 400–700 |
| Label uppercase | same | 11px | 800, letter-spacing 0.6 |

### Spacing & Shape
- Border radius large: 14px
- Border radius small: 9px
- Card shadow: `0 2px 12px rgba(0,0,0,0.06)`
- Status bar height: 50px
- Bottom safe area: `env(safe-area-inset-bottom)`

---

## App Architecture

### State
Central React context (`AppCtx`) holds:
- `mode`: `'qr-static'` | `'dyn-openbill'`
- `table`: table number string
- `cart`: array of line items `{ uid, itemId, name, unit, qty, options, notes, free, type }`
- `applied`: active promos
- `orders`: submitted orders (open bill)
- `payment`: selected payment id
- `phone`, `loggedIn`: WhatsApp auth state
- `orderType`: `'dinein'` | `'takeaway'` (per item)
- Navigation: `stack` of `{ name, params }`

### Key Data Models

**Line item:**
```
{ uid: number, itemId: string, name: string, unit: number, qty: number,
  options: string[], notes: string, free: boolean,
  type: 'dinein' | 'takeaway', promoId?: string }
```

**Menu item:**
```
{ id, cat, name, price, oldPrice?, desc, mods?, contents?, stock, tag?, photo }
```

**Promo:**
```
{ id, scope: 'transaction'|'item', kind: 'percent'|'fixed'|'free-item'|'bulk',
  title, value, min?, cap?, activation, needsPick? }
```

---

## Screens

### 1. Entry Screen
**Purpose:** Choose QR mode  
**Layout:** Full screen dark bg (#162020), centered content  
- Two cards: QR Statis / QR Dinamis  
- Each card: icon + title + subtitle + table number  
- Card size: ~340px wide, border-radius 20px  

### 2. Menu Screen — Klasik (scroll layout)
**Purpose:** Browse and add food items  
**Layout:** Vertical scroll, full-height  
- **Header (at rest):** Restaurant banner image (185px tall) → POS info card overlapping (margin-top -24px), login prompt bar, inline chip bar (hidden at rest, appears on scroll as sticky at top:50)
- **Sticky category bar:** Appears on scroll; chips: "Best Seller", "Ayam", "Nasi", "Pembuka", "Minuman", "Pencuci Mulut" + search icon; bg: t.bg; border-bottom; z-index 9 (below status bar z-10)
- **Promo voucher rail:** 2 horizontal pill chips
- **Promo Hari Ini:** Horizontal scrollable cards (232px wide each)
- **Menu sections:** Category heading (display font 21px) + item cards
- **Item card (list):** 92×92px food image + name (700 14px) + desc (muted 13px) + price + promo tag + add button (teal, 40×40 rounded)
- **Cart dock (bottom):** Floats at 20px from bottom; teal pill showing count + total

### 3. Item Detail Sheet
**Purpose:** Choose options (spice level, add-ons) and add to cart  
**Layout:** Bottom sheet, max 86% height  
- Food image top, name + price header
- Promo tag (if applicable)
- Mod groups (required / optional) with radio/checkbox rows
- Notes textarea
- Footer: QtyStepper [−][N][+] + Tambah/Simpan CTA button

### 4. Cart / Keranjang
**Purpose:** Review order, apply vouchers, proceed to payment  
**Layout:** Full screen, flex column  
- TopBar "Keranjang"
- Scroll body: item rows (line + free child rows), order note input, voucher card, subtotal breakdown
- **Sticky footer:** "Konfirmasi Pesanan" teal button, full width

**Item row:** 60px food image + name (700 14px) + options (one per line, 12px faint) + price. Right: QtyStepper or badge
**Voucher breakdown row labels:** Subtotal, Diskon voucher/item/Potongan harga, PPN 10%, Pembulatan, Total

### 5. Confirm / Konfirmasi Pesanan
**Purpose:** Final check before payment  
**Layout:** Full screen, flex column  
- TopBar "Konfirmasi Pesanan"
- Scroll: info card → optional fields → order summary → payment picker or open-bill info
- **Info card (QR Statis):** "🪑 Meja 5" left + "+62 ··· ✓" right (with marginLeft:auto)
- **Info card (Open Bill):** "🪑 Meja 12" left + "Open Bill" teal pill right
- **Atas Nama field (QR Statis, verified):** labeled input
- **Data Pelanggan (Open Bill):** Two separate inputs side-by-side: Nama | Nomor HP
- **Order summary — Struk variant (active):**
  - External label "RINGKASAN PESANAN · N item"
  - White card with 18px padding
  - Each line: 60px food image + name (700 14px) + "N pcs" (muted, right) + options (12px faint, stacked) + price (800 14px)
  - When mixed types: DINE IN / TAKE AWAY subheaders with icon
  - Collapsed: shows 1 item + "Lihat semua · N item lainnya" (centered, primary, 12.5px 700)
- **Payment picker (QR Statis):** Two cards: QRIS / Bayar Langsung; icon container (38×38, primarySoft bg, primary icon → solid primary when selected), radio circle right
- **Open Bill info card:** primarySoft bg, receipt icon, "Pesanan langsung ke dapur" + subtitle
- **Sticky footer:** "Bayar" or "Kirim ke Dapur" or "Bayar di Kasir" (54px, full width, teal)

### 6. QRIS Payment Screen
**Purpose:** Show QR code, wait for payment  
**Layout:** Full screen
- TopBar "Pembayaran QRIS"
- QR code placeholder (172px, white border 3px, rounded)
- Countdown timer (05:00), download QR button
- Total + step instructions

### 7. Cash Status Screen (Bayar Langsung)
**Purpose:** Show order summary for cashier  
**Layout:** Full screen
- TopBar "Bayar di Kasir"
- Order ref card (large ref number)
- Customer info card: type rows (Dine In · Meja N)
- Order lines list

### 8. Processing Screen
**Purpose:** Animated loading between states  
**Layout:** Centered spinner on bg

### 9. Success / Pembayaran Berhasil
**Purpose:** Payment confirmation  
**Layout:** Full screen, white bg
- **Hero (primary gradient):** Check circle (74px, white bg, green ✓) + "Pembayaran berhasil" + total (46px display font, white)
- **Receipt sheet (white, border-radius 22px 22px 0 0, margin-top -20):**
  - "PESANANMU" label + "Dine In · Meja N" right
  - Line items: qty× name + options + price (struck if free → Rp0)
  - "RINCIAN PEMBAYARAN": Subtotal, Diskon promo (primary), Pajak & layanan
  - "DETAIL TRANSAKSI": Metode, Tanggal, ID Transaksi (+ copy icon)
  - Dashed divider
  - "Bagikan struk" ghost button
- Footer: "Kembali ke Menu" full CTA

### 10. Share Receipt Sheet (Overlay)
**Purpose:** Share receipt via WhatsApp or Email  
**Layout:** Bottom sheet  
- Title "Bagikan struk"
- Segmented toggle: WhatsApp (green #25D366) | Email (primary)
- **Adaptive WhatsApp input:**
  - If phone known: confirm row "Kirim ke nomor" (primarySoft bg, WA icon, formatted number, "Ganti" link)
  - If phone unknown (Open Bill): +62 prefix input field
- Email: input with validation
- Footer: "Kirim struk" (disabled until valid)
- Sent state: check animation + "Struk terkirim" + destination

### 11. Order List / BillScreen (Open Bill)
**Purpose:** View submitted orders, pay all  
**Layout:** Full screen
- TopBar "Order List" + Meja pill right
- Order cards: "#1 Order · lines · Subtotal"
- Free-item promo lines in primary color
- Bottom sticky: total + "Bayar Semua" CTA

### 12. Voucher Claim Screen
**Purpose:** Apply vouchers from cart  
**Layout:** Full screen
- Flat row per voucher: primary seal circle (%, tag, gift icon) + bold title + "Min. belanja Rp…" (chevron) + "Pakai" outlined pill
- If below min: orange "RpXX.XXX lagi buat pakai promo ini" below dashed divider
- "Pakai" disabled until min met

---

## Interactions & Behaviour

### Navigation
Stack-based: `go(screenName, params)`, `back()`. Screens animate in from right (`translateX(14px) → 0, opacity 0→1`, 320ms).

### Cart
- Tap item card → Item Detail sheet (required mods must be filled)
- Tap existing cart line → ItemPicker sheet with QtyStepper
- Minus at qty 1 → "Hapus item?" confirm dialog
- Type change (Dine In ↔ Take Away) → sets default for NEW items, existing items keep their type → cart groups by type with headers

### Payment
- QRIS: tap QR → simulate paid
- Cash: show "Bayar di Kasir" status screen
- Open Bill: "Kirim ke Dapur" → submit order, loop back to menu

### Promos
- Vouchers: 100% manual (no auto-apply); blocked if below min spend
- Free items: auto-added to cart when trigger item present
- Applied voucher drops if cart falls below its minimum

---

## Files in this Package

| File | Role |
|---|---|
| `Self Order.html` | Entry HTML, loads all scripts |
| `app.jsx` | Root app, state, navigation, tweak panel |
| `data.jsx` | Design tokens, menu data, promo data |
| `ui.jsx` | Shared components: Icon, Button, QtyStepper, Sheet, TopBar, FoodImg, etc. |
| `screens-menu.jsx` | Menu screen, promo/offer cards, voucher UI, item detail |
| `screens-cart.jsx` | Cart, promo picker, free-item sheet |
| `screens-checkout.jsx` | Confirm, QRIS, cash, processing, success, share receipt |
| `screens-auth.jsx` | WhatsApp login / OTP flow |
| `screens-cashstatus.jsx` | Cash payment status screen |
| `screens-picker.jsx` | ItemPicker sheet (edit existing cart line) |
| `menu-sidebar.jsx` | Sidebar/kiosk menu shell (alternative layout) |
| `ios-frame.jsx` | iOS device bezel + status bar |
| `tweaks-panel.jsx` | In-design tweak controls |
| `image-slot.js` | Drag-and-drop image placeholder |

---

## For Figma Export via Claude Code

To create Figma frames from this design using the Figma REST API:

1. **Get your Figma Personal Access Token:** Figma → Settings → Personal access tokens
2. **Create a new Figma file** and note its file key (from the URL: `figma.com/file/<FILE_KEY>/`)
3. **Ask Claude Code to:**
   - Take screenshots of each screen (using Playwright or Puppeteer to render the HTML)
   - Upload each screenshot to Figma as a frame via the REST API
   - Or use `@figma/rest-api-spec` + POST to `/v1/files/{key}/images` to add image fills

Example prompt for Claude Code:
```
Use Playwright to render Self Order.html, navigate to each screen, take a screenshot, 
then use the Figma API to create a new page with one frame per screen. 
Figma token: [your token]. File key: [your file key].
```
