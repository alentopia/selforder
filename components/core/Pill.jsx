// Pill.jsx — small rounded label chip. Used for status tags, filters, and category badges.
export function Pill({ children, tone = 'neutral', icon, style }) {
  const tones = {
    neutral: { bg: 'var(--color-surface-2)', fg: 'var(--color-muted)', bd: 'var(--color-line)' },
    primary: { bg: 'var(--color-primary-soft)', fg: 'var(--color-primary)', bd: 'transparent' },
    danger: { bg: 'var(--color-danger-soft)', fg: 'var(--color-danger)', bd: 'transparent' }
  };
  const c = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 'var(--radius-pill)',
      background: c.bg, color: c.fg, border: '1px solid ' + c.bd, fontSize: 'var(--text-caption)', fontWeight: 700,
      letterSpacing: 0.3, textTransform: 'uppercase', fontFamily: 'var(--font-body)', ...style
    }}>
      {icon}
      {children}
    </span>
  );
}
