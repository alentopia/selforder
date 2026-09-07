// OrderTypePills.jsx — segmented control for Dine In / Take Away. Purely presentational;
// the parent owns selection state and typically opens a confirm sheet on tap rather than
// switching instantly (order type affects table/pickup flow downstream).
export function OrderTypePills({ value, onSelect, style }) {
  const opts = [
    { id: 'dinein', label: 'Dine In', icon: '\uD83C\uDF7D' },
    { id: 'takeaway', label: 'Take Away', icon: '\uD83E\uDD6A' }
  ];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: 4, padding: 4, background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-line)', ...style }}>
      {opts.map((o) => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onSelect(o.id)} style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: on ? 'var(--color-primary)' : 'transparent',
            boxShadow: on ? '0 1px 3px rgba(23,153,165,0.35)' : 'none',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
            color: on ? 'var(--color-on-primary)' : 'var(--color-muted)'
          }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
