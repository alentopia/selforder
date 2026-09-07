// Icon.jsx — shared line-icon set (stroke-based, 24×24 viewBox). ~35 glyphs covering
// commerce, navigation, and food-ordering actions used across Self Order.
export function Icon({ name, size = 22, color = 'currentColor', stroke = 2, style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    back: <path d="M15 5l-7 7 7 7" {...p} />,
    close: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    search: <g {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></g>,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    minus: <path d="M5 12h14" {...p} />,
    trash: <g {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M10 11v6M14 11v6" /></g>,
    cart: <g {...p}><path d="M4 5h2l2.2 11.5a1 1 0 0 0 1 .8h7.4a1 1 0 0 0 1-.8L20 8H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></g>,
    tag: <g {...p}><path d="M4 4h7l9 9-7 7-9-9V4z" /><circle cx="8.5" cy="8.5" r="1.4" /></g>,
    arrowRight: <path d="M4 12h15M13 6l6 6-6 6" {...p} />,
    lock: <g {...p}><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    check: <path d="M5 13l4 4 10-11" {...p} />,
    checkCircle: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" /></g>,
    chevron: <path d="M9 5l7 7-7 7" {...p} />,
    qr: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2M20 14v6M14 20h2M19 19h1" /></g>,
    phone: <g {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></g>,
    bolt: <path d="M13 3 L6 13 H11 L10 21 L18 10 H13 L13 3 Z" {...p} />,
    info: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    edit: <g {...p}><path d="M5 19h14M14 5l5 5-9 9H6v-4l8-10z" /></g>,
    receipt: <g {...p}><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3z" /><path d="M9 8h6M9 12h6" /></g>,
    download: <g {...p}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M5 19h14" /></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 10.9l6.8-3.8M8.1 13.1l6.8 3.8" /></g>,
    mail: <g {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7.5l8 5.5 8-5.5" /></g>,
    instagram: <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.1" cy="6.9" r="1.1" fill={color} stroke="none" /></g>,
    table: <g {...p}><rect x="3" y="9" width="18" height="3" rx="1" /><path d="M6 12v7M18 12v7" /></g>,
    gift: <g {...p}><rect x="4" y="9" width="16" height="11" rx="1.5" /></g>,
    copy: <g {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></g>,
    fire: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.8-2.5 1.5-3 .2 1 .8 1.5 1.5 1.5.8 0 1-1 .3-2.2C10.5 5.5 11 4 12 3z" {...p} />,
    spark: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...p} />,
    user: <g {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></g>,
    pin: <g {...p}><path d="M12 21C12 21 5 13.5 5 9a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></g>,
    home: <g {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" /></g>,
    dineIn: <g {...p}><path d="M12 3v10M8 3c0 3 1 5 4 6" /><path d="M16 3v4a4 4 0 0 1-4 4" /><path d="M10 19h4M12 13v6" /><ellipse cx="12" cy="20" rx="4" ry="1" /></g>,
    takeaway: <g {...p}><path d="M6 2h12l1 5H5L6 2z" /><path d="M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13" /><path d="M9 11h6" /></g>,
    whatsapp: <path fill={color} d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.69-.17 1.37z" />,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
    megaphone: <g {...p}><path d="M4 10v4h3l9 4V6l-9 4H4z" /><path d="M18.5 9a4 4 0 0 1 0 6" /><path d="M7 14v3.5a1.5 1.5 0 0 0 3 0V16" /></g>,
    percent: <g {...p}><circle cx="7.5" cy="7.5" r="1.9" /><circle cx="16.5" cy="16.5" r="1.9" /><path d="M18 6L6 18" /></g>,
    coupon: <g {...p}><path d="M3 7.5h18v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3v-3z" /><path d="M13 7.5v1.5M13 13v1.5M13 18.5V20" /></g>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}
