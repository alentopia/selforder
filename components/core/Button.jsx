// Button.jsx — primary UI action element. CSS-var driven, theme-agnostic.
export function Button({ children, onClick, variant = 'primary', size = 'lg', disabled, loading, full, icon, style }) {
  const isDisabled = disabled || loading;
  const sizes = {
    lg: { height: 54, fontSize: 'var(--text-body-lg)', padding: '0 22px' },
    md: { height: 44, fontSize: 15, padding: '0 18px' },
    sm: { height: 36, fontSize: 'var(--text-body-xs)', padding: '0 14px', borderRadius: 'var(--radius-sm)' }
  };
  const variants = {
    primary: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', boxShadow: disabled ? 'none' : 'var(--shadow-button)' },
    ghost: { background: 'transparent', color: 'var(--color-ink)', border: '1.5px solid var(--color-line-strong)' },
    soft: { background: 'var(--color-primary-soft)', color: 'var(--color-primary)' },
    dark: { background: 'var(--color-ink)', color: 'var(--color-surface)' }
  };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-body)', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--radius-md)', width: full ? '100%' : undefined,
    letterSpacing: 0.1, whiteSpace: 'nowrap', transition: 'transform .12s ease, opacity .15s ease, background .15s',
    opacity: disabled ? 0.45 : 1, WebkitTapHighlightColor: 'transparent'
  };
  const spinnerColor = variant === 'ghost' ? 'var(--color-ink)' : variant === 'soft' ? 'var(--color-primary)' : variant === 'dark' ? 'var(--color-surface)' : 'var(--color-on-primary)';
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      aria-busy={loading || undefined}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => !isDisabled && (e.currentTarget.style.transform = 'scale(0.975)')}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      {loading ? <span style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid ' + spinnerColor, borderTopColor: 'transparent', opacity: 0.9, animation: 'ds-btn-spin .7s linear infinite', flexShrink: 0 }} /> : icon}
      {children}
    </button>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('ds-btn-spin-kf')) {
  const s = document.createElement('style');
  s.id = 'ds-btn-spin-kf';
  s.textContent = '@keyframes ds-btn-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}
