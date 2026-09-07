Bottom-sheet container — reach for this before building a custom overlay.

```jsx
<Sheet title="Pilih Varian" onClose={close} footer={<Button full onClick={confirm}>Tambah ke Keranjang</Button>}>
  …content…
</Sheet>
```

For a *single*, specific, must-resolve issue (one item out of stock, one price change) prefer a centered modal instead of a sheet — a sheet's drag-handle affordance implies "more below" which feels off for a single short message. Use Sheet once there are 2+ things to show, or the content is inherently a scrollable list (variant picker, filters).
