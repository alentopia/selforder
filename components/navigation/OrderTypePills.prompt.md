Dine In / Take Away switcher, shown near the top of the menu screen.

```jsx
<OrderTypePills value={orderType} onSelect={(next) => openConfirmSheet(next)} />
```

Treat a tap as a *request* to switch, not an instant commit — in the product this opens a confirmation sheet first because changing order type can affect table assignment.
