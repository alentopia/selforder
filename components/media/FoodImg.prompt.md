Photo placeholder for any food/menu item — never show a raw broken-image icon or an empty box.

```jsx
<FoodImg label="nasi ayam bakar madu" h={56} radius={10} style={{ width: 56 }} src={item.photo} />
```

The placeholder is intentional brand texture (diagonal stripes + a monospace "foto · …" caption), not an error state — it's fine for it to show for items that genuinely have no photo yet.
