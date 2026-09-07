Screen-level header — every full screen in the app opens with a TopBar.

```jsx
<TopBar title="Keranjang" onBack={goBack} backIcon={<Icon name="back" size={20} />} />
<TopBar big title="Selamat siang!" sub="Meja 12 · Dine In" />
```

`flush` is for use inside a `<Sheet>` (which already clears the device status bar) — omit it on real screens so content doesn't sit under the notch.
