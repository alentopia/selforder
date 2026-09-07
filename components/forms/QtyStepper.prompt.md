Quantity control for cart lines and menu cards.

```jsx
<QtyStepper value={qty} onChange={setQty} />
<QtyStepper value={qty} onChange={setQty} min={1} onRemove={handleRemove} />
<QtyStepper value={qty} onChange={setQty} collapsible size="sm" />
```

Use `collapsible` inside a menu grid where every card has its own stepper and screen space is tight — it reads as a plain "add" count-badge until tapped. Use the full (non-collapsible) form in the cart list itself, where the stepper is the primary control on the row.
