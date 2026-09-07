// Sheet.jsx — bottom-sheet shell: drag-handle, optional title + close button, scrollable
// body, optional sticky footer. Backdrop click calls onClose.
export function Sheet({ children, onClose, title, footer, maxH = '86%' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,8,0.42)' }} />
      <div style={{
        position: 'relative', background: 'var(--color-surface)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)',
        maxHeight: maxH, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sheet)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--color-line-strong)' }} />
        </div>
        {title &&
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 6px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, color: 'var(--color-ink)' }}>{title}</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'var(--color-primary-soft)', width: 34, height: 34, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>\u00d7</button>
          </div>
        }
        <div style={{ overflow: 'auto', flex: 1, padding: '4px 20px 16px' }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px calc(16px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--color-line)', background: 'var(--color-surface)' }}>{footer}</div>}
      </div>
    </div>
  );
}
