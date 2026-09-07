// EmptyState.jsx — icon/illustration + title + description for empty lists, zero-result
// search, empty cart, etc. Pass `src` for a real illustration; omit it during design to
// get a drop-in <image-slot> placeholder the user can fill later.
export function EmptyState({ src, title, desc, size = 208, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {src
        ? <img src={src} alt="" style={{ width: size, height: size, objectFit: 'contain', marginBottom: 14, display: 'block' }} />
        : <div style={{ width: size, height: size, marginBottom: 14, borderRadius: 20, background: 'var(--color-surface-2)', border: '1.5px dashed var(--color-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-faint)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>illustration</div>
      }
      <p style={{ color: 'var(--color-ink)', fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</p>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, margin: 0, lineHeight: 1.5, maxWidth: 280 }}>{desc}</p>
      {children}
    </div>
  );
}
