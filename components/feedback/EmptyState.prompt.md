Empty cart, no search results, no orders yet — anywhere a list can be legitimately empty.

```jsx
<EmptyState title="Keranjang masih kosong" desc="Yuk pilih menu favoritmu dan mulai pesan.">
  <Button style={{ marginTop: 16 }} onClick={goToMenu}>Lihat Menu</Button>
</EmptyState>
```

Never leave the illustration area blank — either pass a real `src`, or accept the dashed placeholder as a visible "art goes here" marker for whoever fills it in next.
