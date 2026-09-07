Currency display — always route Rupiah amounts through this instead of formatting inline.

```jsx
<Money value={48000} />
<div style={{ display: 'flex', gap: 6 }}>
  <Money value={45000} strike style={{ fontSize: 12 }} />
  <Money value={48000} style={{ fontSize: 14 }} />
</div>
```
