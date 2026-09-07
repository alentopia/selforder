# Self Order — UI Kit

Click-through recreation of the full Self Order kiosk/mobile flow: **Menu →
Keranjang → Konfirmasi Pesanan → (QRIS atau Bayar Langsung) → Berhasil**,
plus the **Voucher** screen reachable from the cart. Every screen here was
rebuilt by driving the actual `Self Order.html` prototype end-to-end and
matching its real layout pixel-for-pixel — not simplified or approximated.

Built from the design system's tokens + primitives (`Button` incl. its
`loading` spinner state, `Icon`, `Pill`, `Money`, `FoodImg`, `TopBar`,
`EmptyState`) — see `kit-components.jsx` for the local copies used in this
demo (the authoritative, exported versions live in `/components/**`).

Files:
- `index.html` — app shell, cart state, screen router, phone frame (`ios-frame.jsx`)
- `MenuScreen.jsx` — hero photo + restaurant card (logo, table, order type, voucher chips), Promo Hari Ini + Best Seller horizontal rails
- `CartScreen.jsx` — line list (with free-item styling), catatan pesanan, voucher & diskon row, bill breakdown; empty-cart state included
- `CheckoutScreen.jsx` — meja/telp card, atas nama, order summary, QRIS vs. cash-at-counter picker — CTA uses `Button`'s `loading` state while "checking"
- `VoucherScreen.jsx` — full-screen voucher list (chip + conditions + Pakai)
- `QrisScreen.jsx` — QR code, countdown timer, total, cara bayar steps
- `CashStatusScreen.jsx` — waiting-for-cashier state with REF code to show at the till
- `SuccessScreen.jsx` — teal hero + itemized receipt + share/return actions
- `kit-components.jsx` — local, non-exported copies of the primitives this kit uses

Source: driven directly from `Self Order.html` (`app.jsx`, `data.jsx`,
`ui.jsx`, `screens-menu.jsx`, `screens-cart.jsx`, `screens-checkout.jsx`,
`screens-cashstatus.jsx`, `screen-qris.jsx`) — that prototype also has the
full promo system, tweakable visual themes, and the "stock habis / harga
naik / promo hangus" order-check overlay (see `confirm-flow.jsx` /
`Konfirmasi Pesanan - Prototype.html`) which aren't duplicated in this kit.
