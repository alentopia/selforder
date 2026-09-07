Primary tappable action — use for the one main thing a screen or sheet wants the user to do.

```jsx
<Button full onClick={handleConfirm}>Konfirmasi Pesanan</Button>
<Button variant="ghost" size="md" onClick={onCancel}>Batal</Button>
<Button variant="soft" icon={<Icon name="plus" size={16} />}>Tambah Barang</Button>
```

Notes:
- `full` is the default in footers/dialogs — buttons rarely float free-width in this system.
- `loading` swaps the icon for a spinner and disables the button — use for the moment after tap while checking payment/order status (`<Button full loading={checking}>Cek Status Pembayaran</Button>`). Keep the label text as-is; don't switch to a "Checking…" string — the spinner already communicates it.
- Labels should stay on one line (the button does not wrap gracefully) — keep copy under ~24 characters for `lg`.
- `dark` variant is reserved for moments that need to break from the primary teal (e.g. a "Bagikan" action next to a primary CTA).
