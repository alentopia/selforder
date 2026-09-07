Shared line-icon set. Every icon in the product comes from this one glyph table — never inline a one-off SVG.

```jsx
<Icon name="cart" size={20} color="var(--color-primary)" stroke={2} />
```

Notes:
- `whatsapp` and `instagram`'s dot are filled, not stroked — pass `color` and it fills correctly either way.
- Reach for `bell` / `megaphone` for generic "heads up" moments, `info` for neutral notices, and the danger-tinted pairing (`cart`, `tag`, `coupon`) for the three "something changed in your order" categories (stock / price / promo).
- Add new glyphs to this same file's `paths` map rather than creating a second icon component.
