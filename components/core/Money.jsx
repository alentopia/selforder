// Money.jsx — formats a number as Indonesian Rupiah, with an optional strikethrough
// (before/after price-change comparisons).
function rupiah(n) {
  return 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0));
}
export function Money({ value, strike, style }) {
  const forced = strike
    ? { color: 'var(--color-muted)' }
    : { fontWeight: 700, color: 'var(--color-ink)' };
  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      textDecoration: strike ? 'line-through' : 'none',
      fontFamily: 'var(--font-body)',
      ...forced,
      ...style
    }}>
      {rupiah(value)}
    </span>
  );
}
