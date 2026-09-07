// ConfirmDialog.jsx — centered modal for destructive/blocking confirmations
// ("Hapus item?", single-issue order-check alerts). Prop-driven, no app context needed.
export function ConfirmDialog({ title = 'Hapus item?', message, confirmLabel = 'Hapus', cancelLabel = 'Batal', onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(10,20,19,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '24px 22px 18px', boxShadow: 'var(--shadow-modal)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--color-ink)', lineHeight: 1.15 }}>{title}</h3>
        {message && <p style={{ margin: '8px 0 20px', fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.5 }}>{message}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: message ? 0 : 20 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 44, border: '1.5px solid var(--color-line-strong)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{ flex: 1, height: 44, border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
