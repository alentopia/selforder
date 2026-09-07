Compact label for a status, filter, or category — always uppercase, always short.

```jsx
<Pill tone="primary" icon={<Icon name="tag" size={12} />}>Promo</Pill>
<Pill tone="danger">Stok Habis</Pill>
```

Keep label text under ~14 characters — the pill has no `white-space: nowrap`, so longer labels wrap and the pill loses its shape.
