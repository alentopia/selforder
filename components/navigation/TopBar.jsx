// TopBar.jsx — sticky screen header: optional back button, title (+ optional subtitle),
// trailing slot. `big` switches the title to display type for hero/greeting screens.
export function TopBar({ title, onBack, right, transparent, big, sub, flush, backIcon }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30, paddingTop: flush ? 6 : 50,
      background: transparent ? 'transparent' : 'var(--color-bg)',
      borderBottom: transparent ? '1px solid transparent' : '1px solid var(--color-line)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 12px', minHeight: 44 }}>
        {onBack &&
          <button onClick={onBack} style={{ border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', width: 40, height: 40, borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-ink)', flexShrink: 0 }}>
            {backIcon}
          </button>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          {title &&
            <div style={{
              fontFamily: big ? 'var(--font-display)' : 'var(--font-body)', fontWeight: big ? 600 : 700,
              fontSize: big ? 26 : 17, color: 'var(--color-ink)', lineHeight: 1.1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>{title}</div>
          }
          {sub && <div style={{ fontSize: 12.5, color: 'var(--color-muted)', marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}
