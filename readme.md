# Self Order — Design System

A design system for **Self Order**, a self-service kiosk/mobile ordering
product for Indonesian restaurants (dine-in table ordering + takeaway). It
was extracted from an existing HTML/React prototype in this project — there
is no external codebase or Figma file backing it; this system formalizes
the tokens and components that prototype already established.

**Source material** (all in this project's root, not a separate repo/Figma):
- `data.jsx` — theme definitions (`makeTheme`), menu/promo data model, brand constants
- `ui.jsx` — shared primitives (`Icon`, `Button`, `Money`, `Pill`, `FoodImg`, `TopBar`, `Sheet`, `QtyStepper`, `EmptyState`, `ConfirmDialog`, `OrderTypePills`)
- `screens-menu.jsx`, `screens-cart.jsx` *(cart logic lives in* `confirm-flow.jsx`*)*, `screens-checkout.jsx`, `screens-auth.jsx`, `screens-picker.jsx`, `screen-qr.jsx`, `screen-qris.jsx`, `screen-connection.jsx`, `screen-negcase.jsx`, `screens-cashstatus.jsx` — full screen recreations
- `Konfirmasi Pesanan - Prototype.html` + `confirm-flow.jsx` — the fully interactive "order-check" flow (stock/price/promo issues), which is where most of this system's semantic-color and alert-pattern decisions came from
- `Pesanan Popup - Eksplorasi.html` / `popup-explore.jsx` — the design exploration that settled on the "hero illustration + itemized list" alert pattern

If you have access to this project, those files are the ground truth for
anything this system simplifies or omits.

## Index

- `styles.css` — the single global-CSS entry point (imports everything under `tokens/`)
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — design tokens
- `components/core/` — Button, Icon, Pill, Money
- `components/forms/` — QtyStepper
- `components/media/` — FoodImg
- `components/navigation/` — TopBar, OrderTypePills
- `components/feedback/` — Sheet, EmptyState, ConfirmDialog
- `guidelines/` — specimen cards (colors, type, spacing, shadows, icon set)
- `ui_kits/self-order/` — Menu → Cart → Checkout → QRIS/Kasir → Success click-through (+ Voucher), matched pixel-for-pixel against the real prototype
- `assets/` — `empty-cart.png`, `empty-cart-crop.png`, `empty-order.svg`
- `SKILL.md` — Claude Code / Agent Skills manifest

## Content fundamentals

- **Language**: all product copy is Bahasa Indonesia, informal/friendly register — "kamu" not "Anda", contractions like "Yuk" are common ("Yuk, sesuaikan pesananmu").
- **Tone**: calm and helpful even in error/blocking states — no alarm-bell language. Compare "Ayam Goreng Lengkuas habis" (matter-of-fact) against a more dramatic "Maaf, stok habis!" — the system consistently picks the plainer version.
- **Directness over hedging**: action sentences are short imperative fragments — "Hapus dari keranjang sebelum lanjut bayar." rather than a passive/long-winded equivalent.
- **No emoji in UI copy.** The only emoji usage is the two menu-category glyphs in `OrderTypePills` (🍽️ / 🥡) as a lightweight visual anchor next to a label — never standalone or in place of an icon.
- **Numbers**: currency is always Rupiah, formatted `Rp45.000` via `Intl.NumberFormat('id-ID')` — never write raw numbers or `$` in copy.
- **Character budgets matter.** Because most surfaces are a 402px-wide phone frame, copy is written to fit specific line/character budgets (titles ≤~48 chars, item names in dense rows ≤~22 chars/line, button labels ≤~24 chars single line). See `Batas Teks - Dokumentasi.html` in the prototype project for the full worked table — the same discipline should carry into any new copy for this system.

## Visual foundations

- **Palette**: single primary — teal `#1799A5` — carries almost all brand color weight (buttons, active states, prices, links). One secondary accent, a muted gold `#B8893B`, appears only in promo/reward contexts. Two semantic colors extend the system for the order-check flow: danger red `#BE4137` (stock issues — the one truly blocking state) and a price-amber `#B8781F` (price changes — informational, not blocking). This is a deliberately narrow palette — resist adding new brand colors; extend via soft/tint variants of the existing four instead.
- **Neutrals / themes**: three interchangeable neutral themes — Porcelain (cool, airy, the default), Linen (warm), Noir (dark). All three share the same primary/accent/danger colors; only surface, ink, and line values change. Pick per product mood, not per screen.
- **Type**: two-font pairing — Hanken Grotesk (display: titles, big headlines) + Inter (body: everything else, including buttons). Display weight is themeable (600 "elegan" default / 700 "modern" / 800 "kontras" for promo-heavy moments) but the font pairing itself never changes.
- **Spacing**: 4px base scale (`--space-1` through `--space-8`). Corner radius is a 3-step scale — 12 / 18 / 26px — plus a pill (999px) for chips, badges, and the qty stepper. Cards are consistently `--radius-md` (18px); sheets and modals step up to `--radius-lg` (26px) on their top or all corners.
- **Backgrounds**: flat surfaces only — no gradients, no photographic full-bleed backgrounds, no textures except the intentional diagonal-stripe placeholder inside `FoodImg` (which is brand texture, not a bug). Depth comes entirely from elevation (shadow) and thin 8–15%-opacity ink borders, not from color layering.
- **Shadows**: soft, low-contrast, tinted toward ink (never pure black) — `--shadow-card` for resting cards, `--shadow-sheet` / `--shadow-modal` for overlays, `--shadow-button` (a colored teal glow) only on the primary button.
- **Animation**: minimal and functional — a fade for backdrops (`om-fade`), a slide-up for sheets (`om-sheet`), a scale-in pop for centered modals (`om-pop`), a subtle press-scale (0.975) on buttons. No bounce/spring easing, no decorative looping animation, and everything respects `prefers-reduced-motion`.
- **Hover/press states**: press = scale to ~0.975 (buttons) or opacity shift; there is no traditional mouse-hover state design since this is a touch-first kiosk/mobile product — don't invent elaborate `:hover` treatments.
- **Borders**: hairline only, always ink-tinted at low opacity (`--color-line` ≈8% / `--color-line-strong` ≈15–18%) rather than a flat gray — this is what makes the same border read correctly across all three themes.
- **Transparency & blur**: reserved for one purpose — modal/sheet backdrops (`rgba(10-15,°,°,0.5-0.6)` + `backdrop-filter: blur(3px)`) so content behind an overlay is dimmed *and* illegible, never just dimmed (a half-legible cart row behind a popup reads as a layout bug, not a scrim).
- **Imagery tone**: warm, appetizing food photography (Unsplash placeholders in this system) — natural light, close crop, no filters/desaturation. The `FoodImg` striped placeholder is intentionally graphic/abstract so it never gets mistaken for a broken photo.
- **Cards**: white/surface fill, 1px hairline border, soft card shadow, `--radius-md` corners. No colored left-border accent strip — that pattern is deliberately avoided.

## Iconography

- One shared stroke-based icon font substitute: a single `Icon` component with ~35 hand-authored SVG glyphs (24×24 viewBox, `round` linecap/join, default 2px stroke). There is no external icon library dependency and no icon font file — every icon used anywhere in the product is in this one glyph map.
- Two icons are filled rather than stroked: `whatsapp` and `instagram`'s dot — both use `fill={color}` because at small sizes a stroked "brand mark" reads poorly.
- No emoji-as-icon anywhere except the two glyphs inside `OrderTypePills` (🍽️ Dine In / 🥡 Take Away), which sit *beside* an `Icon`, not instead of one, in every other component.
- When a new icon is needed, add it to the `paths` map inside `Icon.jsx` — never introduce a second icon component or inline a one-off `<svg>`.

## Intentional additions

- **`OrderTypePills`** — the source (`ui.jsx`) version reads app-context state (`useApp()`) directly. This system's version is a plain, prop-driven variant (`value`/`onSelect`) so it has no dependency on a specific app's context shape — same visuals, reusable anywhere.
- **`ConfirmDialog`** — likewise de-coupled from `useApp()`/global confirm-queue state into plain props (`onConfirm`/`onCancel`) for the same reason.
- **`EmptyState`**'s illustration slot — the live product uses a custom `<image-slot>` web component (drag-and-drop, persisted) that isn't available outside that editor runtime. This system's version falls back to a dashed placeholder box when no `src` is given; wire in your own upload/slot mechanism in a real app.

## Fonts

Hanken Grotesk + Inter, both Google Fonts — no font binaries are bundled in
this repo. Include this stylesheet link wherever `styles.css` is used:

```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

## Caveats / ask

- No logo exists anywhere in the source prototype — the brand constant (`data.jsx`) just has a plain-text name (`"POS"`) and tagline. This system never invents a wordmark; wherever a mark would go, plain type is used instead. **If you have a real logo, please attach it** and I'll wire it into the brand guidelines and any UI-kit header that currently shows plain text.
- Only three illustrations exist in the source project (`empty-cart.png`, `empty-cart-crop.png`, `empty-order.svg`), copied into `assets/`. Every other "empty state" / "issue" illustration in the product is a user-fillable `<image-slot>` placeholder, not a real asset — this system's `EmptyState` reflects that by defaulting to a dashed placeholder box rather than fabricating artwork.
- The UI kit now covers Menu, Cart, Checkout, Voucher, QRIS payment, cash-at-counter status, and the success receipt — all matched against the live prototype. Still not recreated: auth/login (WhatsApp), QR/QRIS expiry popup, connection-loss/maintenance states, and the full order-issue overlay (stock/price/promo) — happy to add any of those on request.
- `Button` now has a `loading` state (spinner replaces the icon, interaction disabled) — used on "Bayar"/"Bayar di Kasir", "Update Status Pesanan", and "Cek Status Pembayaran" wherever the real app simulates a status check.
