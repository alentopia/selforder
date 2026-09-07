// QtyStepper.jsx — quantity increment/decrement control. Optional `collapsible` mode
// starts as a single tappable count pill and expands into +/- controls, auto-collapsing
// after a pause (used in dense menu grids where every card needs its own stepper).
export function QtyStepper({ value, onChange, min = 1, size = 'md', collapsible = false, onRemove }) {
  const [expanded, setExpanded] = React.useState(false);
  const timerRef = React.useRef(null);
  const s = size === 'sm' ? 28 : 34;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setExpanded(false), 2500);
  };
  const handleExpand = () => { setExpanded(true); resetTimer(); };
  const handleChange = (v) => { onChange(v); if (collapsible) resetTimer(); };

  if (collapsible && !expanded) {
    return (
      <button onClick={handleExpand} style={{
        width: 24, height: 24, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'var(--font-body)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-pill)',
        fontWeight: 400, fontSize: 13
      }}>{value}</button>
    );
  }

  const btn = (icon, fn, off, danger) => (
    <button onClick={off ? undefined : () => { fn(); if (collapsible) resetTimer(); }} style={{
      width: s, height: s, borderRadius: 'var(--radius-pill)', border: 'none', cursor: off ? 'default' : 'pointer',
      background: 'transparent', color: off ? 'var(--color-faint)' : danger ? 'var(--color-danger)' : 'var(--color-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>{icon}</button>
  );

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--color-surface-2)', border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: 2, flexShrink: 0 }}>
      {value <= min && onRemove ? btn('\u2212', onRemove, false) : btn('\u2212', () => handleChange(Math.max(min, value - 1)), value <= min)}
      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontSize: size === 'sm' ? 14 : 15.5, fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink)' }}>{value}</span>
      {btn('+', () => handleChange(value + 1))}
    </div>
  );
}
