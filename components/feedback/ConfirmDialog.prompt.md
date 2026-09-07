Blocking centered modal for a yes/no decision, or a single must-resolve order issue.

```jsx
<ConfirmDialog
  title="Ayam Goreng Lengkuas habis"
  message="Barang ini kosong. Hapus dari keranjang sebelum lanjut bayar."
  confirmLabel="Hapus"
  onConfirm={removeLine}
  onCancel={close}
/>
```

For 2+ simultaneous issues (stock + price + promo all changed), use `<Sheet>` instead — a modal this size gets cramped once you add a list of affected items.
