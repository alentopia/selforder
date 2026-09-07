// FoodImg.jsx — image slot with a generated diagonal-stripe placeholder + monospace
// caption while no photo is loaded (or the photo URL fails). Fades the real photo in
// once loaded so there's never a broken-image flash.
function shade(hex, amt) {
  const h = hex.replace('#', '');
  let r = parseInt(h.slice(0, 2), 16) + amt, g = parseInt(h.slice(2, 4), 16) + amt, b = parseInt(h.slice(4, 6), 16) + amt;
  const cl = (x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0');
  return '#' + cl(r) + cl(g) + cl(b);
}
export function FoodImg({ label, h = 120, radius, style, src }) {
  const [imgOk, setImgOk] = React.useState(false);
  const r = radius != null ? radius : 12;
  const placeholder = '#DDE6E6'; // falls back if --color-placeholder isn't resolvable inline
  const stripes = `repeating-linear-gradient(135deg, var(--color-placeholder, ${placeholder}) 0 10px, ${shade(placeholder, -4)} 10px 20px)`;
  return (
    <div style={{ position: 'relative', height: h, borderRadius: r, overflow: 'hidden', flexShrink: 0, background: stripes, display: 'flex', alignItems: 'flex-end', ...style }}>
      {src &&
        <img src={src} alt={label} onLoad={() => setImgOk(true)} onError={() => setImgOk(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: imgOk ? 1 : 0, transition: 'opacity .35s ease' }} />
      }
      {!imgOk &&
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--color-placeholder-ink)', padding: '5px 7px', letterSpacing: 0.2, lineHeight: 1.2 }}>foto \u00b7 {label}</span>
      }
    </div>
  );
}
