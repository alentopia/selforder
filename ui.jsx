// ui.jsx — shared contexts, icons, primitives. Exported to window.
const { createContext, useContext, useState, useEffect, useRef } = React;

// ── Contexts ───────────────────────────────────────────────
const ThemeCtx = createContext(null);
const AppCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);
const useApp = () => useContext(AppCtx);

// ── Icons (simple line set) ────────────────────────────────
function Icon({ name, size = 22, color = 'currentColor', stroke = 2, style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  // Geometri = komponen Figma Icon/* (Komponen Primitif, 491:4 dst.; `store` = Icon/storefront).
  // Ikon tanpa padanan di Figma (arrowRight, lock, bolt, calendar, repeat, instagram, gift,
  // fire, spark, bell, coupon) tetap gambar lama.
  const paths = {
    back: <path d="M15 5L8 12L15 19" {...p} />,
    close: <path d="M6 6L18 18M18 6L6 18" {...p} />,
    search: <g {...p}><path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" /><path d="M20 20L16.8 16.8" /></g>,
    plus: <path d="M12 5V19M5 12H19" {...p} />,
    minus: <path d="M5 12H19" {...p} />,
    trash: <g {...p}><path d="M4 7H20M9 7V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H14C14.2652 4 14.5196 4.10536 14.7071 4.29289C14.8946 4.48043 15 4.73478 15 5V7M6 7L7 20C7 20.2652 7.10536 20.5196 7.29289 20.7071C7.48043 20.8946 7.73478 21 8 21H16C16.2652 21 16.5196 20.8946 16.7071 20.7071C16.8946 20.5196 17 20.2652 17 20L18 7" /><path d="M10 11V17M14 11V17" /></g>,
    cart: <g {...p}><path d="M4 5H6L8.2 16.5C8.24675 16.7293 8.37242 16.9349 8.55514 17.0811C8.73786 17.2272 8.96605 17.3047 9.2 17.3H16.6C16.8339 17.3047 17.0621 17.2272 17.2449 17.0811C17.4276 16.9349 17.5532 16.7293 17.6 16.5L20 8H7" /><path d="M10 21.3C10.718 21.3 11.3 20.718 11.3 20C11.3 19.282 10.718 18.7 10 18.7C9.28204 18.7 8.70001 19.282 8.70001 20C8.70001 20.718 9.28204 21.3 10 21.3Z" /><path d="M17 21.3C17.718 21.3 18.3 20.718 18.3 20C18.3 19.282 17.718 18.7 17 18.7C16.282 18.7 15.7 19.282 15.7 20C15.7 20.718 16.282 21.3 17 21.3Z" /></g>,
    tag: <g {...p}><path d="M4 4H11L20 13L13 20L4 11V4Z" /><path d="M8.50001 9.9C9.2732 9.9 9.90001 9.2732 9.90001 8.5C9.90001 7.7268 9.2732 7.1 8.50001 7.1C7.72681 7.1 7.10001 7.7268 7.10001 8.5C7.10001 9.2732 7.72681 9.9 8.50001 9.9Z" /></g>,
    arrowRight: <path d="M4 12h15M13 6l6 6-6 6" {...p} />,
    lock: <g {...p}><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    check: <path d="M5 13L9 17L19 6" {...p} />,
    checkCircle: <g {...p}><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" /><path d="M8 12.5L10.5 15L16 9" /></g>,
    chevron: <path d="M9 5L16 12L9 19" {...p} />,
    qr: <g {...p}><path d="M9 4H5C4.44772 4 4 4.44772 4 5V9C4 9.55228 4.44772 10 5 10H9C9.55228 10 10 9.55228 10 9V5C10 4.44772 9.55228 4 9 4Z" /><path d="M19 4H15C14.4477 4 14 4.44772 14 5V9C14 9.55228 14.4477 10 15 10H19C19.5523 10 20 9.55228 20 9V5C20 4.44772 19.5523 4 19 4Z" /><path d="M9 14H5C4.44772 14 4 14.4477 4 15V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V15C10 14.4477 9.55228 14 9 14Z" /><path d="M14 14H16V16M20 14V20M14 20H16M19 19H20" /></g>,
    phone: <g {...p}><path d="M14.5 3H9.5C8.11929 3 7 4.11929 7 5.5V18.5C7 19.8807 8.11929 21 9.5 21H14.5C15.8807 21 17 19.8807 17 18.5V5.5C17 4.11929 15.8807 3 14.5 3Z" /><path d="M11 18H13" /></g>,
    bolt: <path d="M13 3 L6 13 H11 L10 21 L18 10 H13 L13 3 Z" {...p} />,
    info: <g {...p}><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" /><path d="M12 11V16M12 8H12.01" /></g>,
    clock: <g {...p}><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" /><path d="M12 7V12L15 14" /></g>,
    calendar: <g {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></g>,
    repeat: <g {...p}><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></g>,
    edit: <path d="M5 19H19M14 5L19 10L10 19H6V15L14 5Z" {...p} />,
    receipt: <g {...p}><path d="M6 3H18V21L15.5 19.5L13 21L10.5 19.5L8 21L6 19.5V3Z" /><path d="M9 8H15M9 12H15" /></g>,
    download: <g {...p}><path d="M12 4V15M16 11L12 15L8 11" /><path d="M5 19H19" /></g>,
    share: <g {...p}><path d="M6.00001 14.4C7.32549 14.4 8.40001 13.3255 8.40001 12C8.40001 10.6745 7.32549 9.60001 6.00001 9.60001C4.67452 9.60001 3.60001 10.6745 3.60001 12C3.60001 13.3255 4.67452 14.4 6.00001 14.4Z" /><path d="M17 8.40001C18.3255 8.40001 19.4 7.32549 19.4 6.00001C19.4 4.67452 18.3255 3.60001 17 3.60001C15.6745 3.60001 14.6 4.67452 14.6 6.00001C14.6 7.32549 15.6745 8.40001 17 8.40001Z" /><path d="M17 20.4C18.3255 20.4 19.4 19.3255 19.4 18C19.4 16.6745 18.3255 15.6 17 15.6C15.6745 15.6 14.6 16.6745 14.6 18C14.6 19.3255 15.6745 20.4 17 20.4Z" /><path d="M8.10001 10.9L14.9 7.10001M8.10001 13.1L14.9 16.9" /></g>,
    mail: <g {...p}><path d="M18.5 5H5.5C4.11929 5 3 6.11929 3 7.5V16.5C3 17.8807 4.11929 19 5.5 19H18.5C19.8807 19 21 17.8807 21 16.5V7.5C21 6.11929 19.8807 5 18.5 5Z" /><path d="M4 7.5L12 13L20 7.5" /></g>,
    instagram: <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.1" cy="6.9" r="1.1" fill={color} stroke="none" /></g>,
    table: <path fill={color} d="M6.9 21L8.175 17.7188C8.3025 17.3833 8.50792 17.117 8.79125 16.9199C9.07458 16.7227 9.39333 16.6244 9.7475 16.625H11.15V13.1031C8.9825 13.0302 7.16548 12.7021 5.69895 12.1188C4.23242 11.5354 3.49943 10.85 3.5 10.0625C3.5 9.21667 4.32875 8.49479 5.98625 7.89688C7.64375 7.29896 9.64833 7 12 7C14.3658 7 16.3741 7.29896 18.0248 7.89688C19.6755 8.49479 20.5006 9.21667 20.5 10.0625C20.5 10.85 19.7667 11.5354 18.3002 12.1188C16.8337 12.7021 15.0169 13.0302 12.85 13.1031V16.625H14.2525C14.5925 16.625 14.9078 16.7236 15.1985 16.9208C15.4892 17.1179 15.6981 17.3839 15.825 17.7188L17.1 21H15.4L14.38 18.375H9.62L8.6 21H6.9Z" />,
    gift: <g {...p}><rect x="4" y="8.5" width="16" height="4" rx="1" /><path d="M5 12.5v6.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5M12 8.5v11.5" /><path d="M12 8.5S10.5 4 8.2 4.6C6.6 5 6.8 7.8 9 8.5h3zM12 8.5s1.5-4.5 3.8-3.9C17.4 5 17.2 7.8 15 8.5h-3z" /></g>,
    copy: <g {...p}><path d="M18 9H11C9.89543 9 9 9.89543 9 11V18C9 19.1046 9.89543 20 11 20H18C19.1046 20 20 19.1046 20 18V11C20 9.89543 19.1046 9 18 9Z" /><path d="M5 15V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H15" /></g>,
    fire: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.8-2.5 1.5-3 .2 1 .8 1.5 1.5 1.5.8 0 1-1 .3-2.2C10.5 5.5 11 4 12 3z" {...p} />,
    spark: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...p} />,
    user: <g {...p}><path d="M12 11.5C13.933 11.5 15.5 9.933 15.5 8C15.5 6.067 13.933 4.5 12 4.5C10.067 4.5 8.5 6.067 8.5 8C8.5 9.933 10.067 11.5 12 11.5Z" /><path d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20" /></g>,
    pin: <g {...p}><path d="M12 21C12 21 5 13.5 5 9C5 7.14348 5.7375 5.36301 7.05025 4.05025C8.36301 2.7375 10.1435 2 12 2C13.8565 2 15.637 2.7375 16.9497 4.05025C18.2625 5.36301 19 7.14348 19 9C19 13.5 12 21 12 21Z" /><path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" /></g>,
    home: <g {...p}><path d="M4 11L12 4L20 11" /><path d="M6 10V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H10V14H14V20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V10" /></g>,
    // dineIn & takeaway: ikon terisi dari Figma (Icon/dineIn = Material local_dining, Icon/takeaway)
    dineIn: <path fill={color} d="M7.79954 13.1283L10.6295 10.2983L3.60954 3.28833C2.04954 4.84833 2.04954 7.37833 3.60954 8.94833L7.79954 13.1283ZM14.5795 11.3183C16.1095 12.0283 18.2595 11.5283 19.8495 9.93833C21.7595 8.02833 22.1295 5.28833 20.6595 3.81833C19.1995 2.35833 16.4595 2.71833 14.5395 4.62833C12.9495 6.21833 12.4495 8.36833 13.1595 9.89833L3.39954 19.6583L4.80954 21.0683L11.6995 14.1983L18.5795 21.0783L19.9895 19.6683L13.1095 12.7883L14.5795 11.3183Z" />,
    takeaway: <path fill={color} d="M5.23125 10L3 7.45L4.19 6.05L5.55 7.65L5.5075 7.05L8.95 3H14.05L17.4925 7.05L17.45 7.65L18.81 6.05L20 7.45L17.7688 10H5.23125ZM6.3575 20L5.805 11.55H17.195L16.6425 20H6.3575Z" />,
    // store: Figma Icon/storefront (Material storefront, terisi) — opsi "Bayar di Kasir"
    store: <path fill={color} d="M20.9996 11.05V19C20.9996 19.55 20.804 20.021 20.4126 20.413C20.0213 20.805 19.5503 21.0007 18.9996 21H4.99963C4.44963 21 3.97896 20.8043 3.58763 20.413C3.19629 20.0217 3.00029 19.5507 2.99963 19V11.05C2.61629 10.7 2.32063 10.25 2.11263 9.7C1.90463 9.15 1.90029 8.55 2.09963 7.9L3.14963 4.5C3.28296 4.06667 3.52063 3.70833 3.86263 3.425C4.20463 3.14167 4.60029 3 5.04963 3H18.9496C19.3996 3 19.7913 3.13767 20.1246 3.413C20.458 3.68833 20.6996 4.05067 20.8496 4.5L21.8996 7.9C22.0996 8.55 22.0956 9.14167 21.8876 9.675C21.6796 10.2083 21.3836 10.6667 20.9996 11.05ZM14.1996 10C14.6496 10 14.9913 9.846 15.2246 9.538C15.458 9.23 15.5496 8.884 15.4996 8.5L14.9496 5H12.9996V8.7C12.9996 9.05 13.1163 9.35433 13.3496 9.613C13.583 9.87167 13.8663 10.0007 14.1996 10ZM9.69963 10C10.083 10 10.3956 9.87067 10.6376 9.612C10.8796 9.35333 11.0003 9.04933 10.9996 8.7V5H9.04963L8.49963 8.5C8.43296 8.9 8.52029 9.25 8.76163 9.55C9.00296 9.85 9.31563 10 9.69963 10ZM5.24963 10C5.54963 10 5.81196 9.89167 6.03663 9.675C6.26129 9.45833 6.39896 9.18333 6.44963 8.85L6.99963 5H5.04963L4.04963 8.35C3.94963 8.68333 4.00363 9.04167 4.21163 9.425C4.41963 9.80833 4.76563 10 5.24963 10ZM18.7496 10C19.233 10 19.583 9.80833 19.7996 9.425C20.0163 9.04167 20.0663 8.68333 19.9496 8.35L18.8996 5H16.9996L17.5496 8.85C17.5996 9.18333 17.7373 9.45833 17.9626 9.675C18.188 9.89167 18.4503 10 18.7496 10ZM4.99963 19H18.9996V11.95C18.9163 11.9833 18.8623 12 18.8376 12H18.7496C18.2996 12 17.904 11.925 17.5626 11.775C17.2213 11.625 16.8836 11.3833 16.5496 11.05C16.2496 11.35 15.908 11.5833 15.5246 11.75C15.1413 11.9167 14.733 12 14.2996 12C13.8496 12 13.4286 11.9167 13.0366 11.75C12.6446 11.5833 12.299 11.35 11.9996 11.05C11.7163 11.35 11.3873 11.5833 11.0126 11.75C10.638 11.9167 10.2336 12 9.79963 12C9.31629 12 8.87896 11.9167 8.48763 11.75C8.09629 11.5833 7.75029 11.35 7.44963 11.05C7.09963 11.4 6.75396 11.646 6.41263 11.788C6.07129 11.93 5.68363 12.0007 5.24963 12H5.13763C5.09563 12 5.04963 11.9833 4.99963 11.95V19Z" />,
    whatsapp: <path fill={color} d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2 22L7.25 20.62C8.7 21.41 10.33 21.83 12.04 21.83H12.05C17.51 21.83 21.96 17.38 21.96 11.92C21.96 9.27 20.93 6.78 19.06 4.91C18.1419 3.9829 17.0482 3.24807 15.8429 2.74843C14.6376 2.24878 13.3448 1.99435 12.04 2ZM17.84 16.16C17.6 16.84 16.42 17.47 15.89 17.54C15.39 17.61 14.76 17.64 14.07 17.43C13.65 17.3 13.11 17.12 12.42 16.82C9.52 15.57 7.63 12.65 7.48 12.46C7.34 12.27 6.3 10.89 6.3 9.47C6.3 8.05 7.05 7.35 7.31 7.06C7.57 6.77 7.88 6.7 8.07 6.7C8.26 6.7 8.45 6.7 8.62 6.71C8.8 6.72 9.03 6.64 9.26 7.2C9.5 7.77 10.07 9.17 10.14 9.31C10.21 9.45 10.26 9.62 10.16 9.81C10.06 10 10.02 10.12 9.87 10.29C9.73 10.46 9.57 10.67 9.44 10.8C9.3 10.94 9.15 11.09 9.32 11.37C9.49 11.65 10.06 12.59 10.91 13.35C12 14.32 12.92 14.62 13.21 14.76C13.5 14.9 13.66 14.88 13.83 14.69C14 14.5 14.54 13.86 14.73 13.58C14.92 13.29 15.11 13.34 15.37 13.44C15.63 13.53 17.03 14.22 17.32 14.37C17.61 14.51 17.8 14.58 17.87 14.7C17.94 14.82 17.94 15.39 17.7 16.07L17.84 16.16Z" />,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
    megaphone: <g {...p}><path d="M4 10V14H7L16 18V6L7 10H4Z" /><path d="M18.5 9C18.9256 9.37537 19.2665 9.83701 19.5 10.3542C19.7335 10.8715 19.8542 11.4325 19.8542 12C19.8542 12.5675 19.7335 13.1285 19.5 13.6458C19.2665 14.163 18.9256 14.6246 18.5 15" /><path d="M7 14V17.5C7 17.8978 7.15804 18.2794 7.43934 18.5607C7.72064 18.842 8.10218 19 8.5 19C8.89782 19 9.27936 18.842 9.56066 18.5607C9.84196 18.2794 10 17.8978 10 17.5V16" /></g>,
    percent: <g {...p}><path d="M7.49998 9.40001C8.54932 9.40001 9.39998 8.54935 9.39998 7.50001C9.39998 6.45067 8.54932 5.60001 7.49998 5.60001C6.45063 5.60001 5.59998 6.45067 5.59998 7.50001C5.59998 8.54935 6.45063 9.40001 7.49998 9.40001Z" /><path d="M16.5 18.4C17.5493 18.4 18.4 17.5493 18.4 16.5C18.4 15.4507 17.5493 14.6 16.5 14.6C15.4506 14.6 14.6 15.4507 14.6 16.5C14.6 17.5493 15.4506 18.4 16.5 18.4Z" /><path d="M18 6L6 18" /></g>,
    coupon: <g {...p}><path d="M3 7.5h18v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3v-3z" /><path d="M13 7.5v1.5M13 13v1.5M13 18.5V20" /></g>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>);

}

// ── Money display ──────────────────────────────────────────
function Money({ value, strike, style }) {
  // forced = default look for live prices (dark + bold); callers can still override
  // via the passed `style` (e.g. white price on a colored banner).
  const forced = strike ? { color: "rgb(140, 150, 149)" } : { fontWeight: "700", color: "rgb(19, 32, 31)" };
  return <span style={{ fontVariantNumeric: 'tabular-nums', textDecoration: strike ? 'line-through' : 'none', ...forced, ...style }}>{rupiah(value)}</span>;
}

// ── Option / modifier lines — satu modifier per baris (vertikal) ──
function OptLines({ options, size = 12, color, style }) {
  const t = useTheme();
  if (!options || !options.length) return null;
  return (
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {options.map((o, i) =>
      <span key={i} style={{ fontSize: size, color: color || t.muted, lineHeight: 1.42 }}>{o}</span>
      )}
    </div>);
}

// ── Struk Rinci — pecah harga dasar + tiap tambahan berbayar per baris ──
// Rekonstruksi grup + harga per opsi dari definisi mods item; sisanya (mis. isi
// paket / opsi tak dikenal) tetap tampil sebagai baris label. Item gratis → semua Rp0.
function lineBreakdown(line) {
  const item = itemById(line.itemId);
  const defs = (item && item.mods) || [];
  const opts = line.options || [];
  const base = line.free ? 0 : item ? item.price : line.unit;
  const used = opts.map(() => false);
  const mods = [];
  defs.forEach((g) => {
    g.options.forEach((o) => {
      const paid = o.label + ' (+' + rupiah(o.price) + ')';
      const idx = opts.findIndex((s, i) => !used[i] && (s === o.label || s === paid));
      if (idx !== -1) {used[idx] = true;mods.push({ group: g.label, label: o.label, price: line.free ? 0 : o.price });}
    });
  });
  opts.forEach((s, i) => {
    if (used[i]) return;
    const m = s.match(/^(.*) \(\+Rp([\d.,]+)\)$/);
    if (m) mods.push({ group: null, label: m[1], price: line.free ? 0 : Number(m[2].replace(/[^\d]/g, '')) });
    else mods.push({ group: null, label: s, price: 0 });
  });
  return { base, mods };
}

// Baris rincian gaya struk: modifier dikelompokkan per grup. Grup dengan >1 opsi
// tampil sebagai header sekali + daftar di bawahnya (mis. "Tambahan:" lalu tiap item).
// Grup 1 opsi tampil inline "Grup: Nilai". Harga inline dalam kurung (×qty); gratis = tanpa harga.
function ReceiptLines({ line, size = 12, style }) {
  const t = useTheme();
  const { mods } = lineBreakdown(line);
  if (!mods.length) return null;
  const q = line.qty || 1;
  const priceStr = (p) => p > 0 ? ' (+' + rupiah(p * q) + ')' : '';
  // kelompokkan berdasar nama grup; opsi tanpa grup (null) berdiri sendiri
  const groups = [];
  mods.forEach((m) => {
    const g = m.group ? groups.find((x) => x.name === m.group) : null;
    if (g) g.items.push(m);else groups.push({ name: m.group || null, items: [m] });
  });
  return (
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3, ...style }}>
      {groups.map((g, gi) => {
        if (!g.name) return g.items.map((m, i) =>
        <span key={gi + '-' + i} style={{ fontSize: size, color: t.muted, lineHeight: 1.4 }}>{m.label}{priceStr(m.price)}</span>);
        // pilihan tunggal & pendek → inline; grup banyak-opsi / nama panjang → header + list
        const inlineStr = g.name + ': ' + g.items[0].label + priceStr(g.items[0].price);
        const useHeader = g.items.length > 1 || inlineStr.length > 38;
        if (useHeader) return (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: size, color: t.faint, lineHeight: 1.4 }}>{g.name}:</span>
            {g.items.map((m, i) =>
            <span key={i} style={{ fontSize: size, color: t.muted, lineHeight: 1.4, paddingLeft: 10 }}>{m.label}{priceStr(m.price)}</span>)}
          </div>);
        return (
          <span key={gi} style={{ fontSize: size, color: t.muted, lineHeight: 1.4 }}>
            <span style={{ color: t.faint }}>{g.name}: </span>{g.items[0].label}{priceStr(g.items[0].price)}
          </span>);
      })}
    </div>);
}

// ── EmptyState — ilustrasi statis (image-slot, bisa diisi user) + judul + teks ──
// slotId: id unik untuk persistensi drop. src: ilustrasi bawaan (opsional).
// resolveAsset: di build standalone, tukar path aset ke blob window.__resources[<basename>].
function resolveAsset(src) {
  if (!src) return src;
  if (typeof window !== 'undefined' && window.__resources) {
    const m = String(src).match(/([^/]+)\.[a-z0-9]+$/i);
    if (m && window.__resources[m[1]]) return window.__resources[m[1]];
  }
  return src;
}
function EmptyState({ slotId, src, title, desc, size = 208, children }) {
  const t = useTheme();
  return (
    <>
      {src ?
      <img src={resolveAsset(src)} alt="" style={{ width: size, height: size, objectFit: 'contain', marginBottom: 14, display: 'block' }} /> :
      React.createElement('image-slot', {
        id: slotId, shape: 'rounded', radius: '20', fit: 'contain',
        placeholder: 'Taruh ilustrasi',
        style: { width: size, height: size, marginBottom: 14 } })}
      <p style={{ color: t.ink, fontSize: 17, fontWeight: 700, textAlign: 'center', margin: 0 }}>{title}</p>
      <p style={{ color: t.muted, fontSize: 14, textAlign: 'center', margin: 0, lineHeight: 1.5, textWrap: 'pretty', maxWidth: 280 }}>{desc}</p>
      {children}
    </>);
}

// ── Button ─────────────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'lg', disabled, loading, full, icon, style }) {
  const t = useTheme();
  const isDisabled = disabled || loading;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: t.fontBody, fontWeight: 650, cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: t.radius, width: full ? '100%' : undefined,
    letterSpacing: 0.1, transition: 'transform .12s ease, opacity .15s ease, background .15s',
    opacity: disabled ? 0.45 : 1, WebkitTapHighlightColor: 'transparent'
  };
  const sizes = {
    lg: { height: 54, fontSize: 16.5, padding: '0 22px' },
    md: { height: 44, fontSize: 15, padding: '0 18px' },
    sm: { height: 36, fontSize: 13.5, padding: '0 14px', borderRadius: t.radiusSm }
  };
  const variants = {
    primary: { background: t.primary, color: t.onPrimary, boxShadow: disabled ? 'none' : '0 6px 18px ' + hexA(t.primary, 0.28) },
    ghost: { background: 'transparent', color: t.ink, border: '1.5px solid ' + t.lineStrong },
    soft: { background: t.primarySoft, color: t.primary },
    dark: { background: t.ink, color: t.surface }
  };
  const spinnerColor = variant === 'ghost' ? t.ink : variant === 'soft' ? t.primary : variant === 'dark' ? t.surface : t.onPrimary;
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      aria-busy={loading || undefined}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style, fontWeight: 700 }}
      onMouseDown={(e) => !isDisabled && (e.currentTarget.style.transform = 'scale(0.975)')}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>

      {loading ?
      <span style={{ width: 15, height: 15, borderRadius: 999, border: '2px solid ' + hexA(spinnerColor, 0.35), borderTopColor: spinnerColor, animation: 'om-spin .7s linear infinite', flexShrink: 0 }} /> :
      icon && <Icon name={icon} size={size === 'sm' ? 17 : 20} />}
      {children}
    </button>);

}

// ── Qty stepper ────────────────────────────────────────────
function QtyStepper({ value, onChange, min = 1, size = 'md', collapsible = false, onRemove }) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);
  const s = size === 'sm' ? 28 : 34;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setExpanded(false), 2500);
  };

  const handleExpand = () => {setExpanded(true);resetTimer();};
  const handleChange = (v) => {onChange(v);if (collapsible) resetTimer();};

  if (collapsible && !expanded) {
    return (
      <button onClick={handleExpand} className="om-press" style={{
        width: 24, height: 24, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: t.primary, color: t.onPrimary,
        fontFamily: t.fontBody,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent', borderRadius: "99px", fontWeight: "400", fontSize: "13px"
      }}>{value}</button>);

  }

  const btn = (icon, fn, off, danger) =>
  <button onClick={off ? undefined : () => {fn();if (collapsible) resetTimer();}} className={off ? undefined : 'om-press'} style={{
    width: s, height: s, borderRadius: 999, border: 'none', cursor: off ? 'default' : 'pointer',
    background: 'transparent', color: off ? t.faint : danger ? '#BE4137' : t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent'
  }}><Icon name={icon} size={size === 'sm' ? 15 : 18} stroke={2.4} /></button>;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: t.surface2, border: '1px solid ' + t.line, borderRadius: 999, padding: 2, flexShrink: 0 }}>
      {value <= min && onRemove ?
      btn('minus', onRemove, false) :
      btn('minus', () => handleChange(Math.max(min, value - 1)), value <= min)}
      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontSize: size === 'sm' ? 14 : 15.5, fontVariantNumeric: 'tabular-nums', color: t.ink }}>{value}</span>
      {btn('plus', () => handleChange(value + 1))}
    </div>);

}

// ── Tag / pill ─────────────────────────────────────────────
function Pill({ children, tone = 'neutral', icon, style }) {
  const t = useTheme();
  const tones = {
    neutral: { bg: t.surface2, fg: t.muted, bd: t.line },
    primary: { bg: t.primarySoft, fg: t.primary, bd: 'transparent' },
    promo: { bg: t.primarySoft, fg: t.primary, bd: 'transparent' },
    danger: { bg: 'rgba(190,60,55,0.10)', fg: '#BE4137', bd: 'transparent' }
  };
  const c = tones[tone] || tones.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 999,
      background: c.bg, color: c.fg, border: '1px solid ' + c.bd, fontSize: 11.5, fontWeight: 700,
      letterSpacing: 0.3, textTransform: 'uppercase', ...style }}>
      {icon && <Icon name={icon} size={12} stroke={2.4} />}
      {children}
    </span>);

}

// ── Food image placeholder (striped, monospace caption) ────
function FoodImg({ label, h = 120, radius, style, src }) {
  const t = useTheme();
  const r = radius != null ? radius : t.radiusSm;
  const [imgOk, setImgOk] = useState(false);
  const stripes = `repeating-linear-gradient(135deg, ${t.placeholder} 0 10px, ${shade(t.placeholder, -4)} 10px 20px)`;
  return (
    <div style={{ position: 'relative', height: h, borderRadius: r, overflow: 'hidden', flexShrink: 0,
      background: stripes, display: 'flex', alignItems: 'flex-end', ...style }}>
      {src &&
      <img src={src} alt={label}
      onLoad={() => setImgOk(true)}
      onError={() => setImgOk(false)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: imgOk ? 1 : 0, transition: 'opacity .35s ease' }} />
      }
      {!imgOk &&
      <span style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 9.5, color: t.placeholderInk,
        padding: '5px 7px', letterSpacing: 0.2, lineHeight: 1.2 }}>foto · {label}</span>
      }
    </div>);

}

// ── PaketDetail — rincian Barang Grup: rail teal 3px + satu baris per slot ──
// Keranjang, Konfirmasi & Struk menampilkan SEMUA slot: isi tetap (mis. 5× Burger Bangor Sapi)
// + pilihan. (Menimpa Figma "Case: Isi Paket & Pilihan" yang menyembunyikan isi tetap di
// Keranjang — permintaan user 2026-09-29.) `max` opsional memotong jadi "+n lainnya".
// Add-on berbayar "(+RpX)" ditulis Regular muted, sama seperti opsi biasa.
const isPaketLine = (line) => (line.contents || []).length > 0;
function PaketDetail({ line, withContents, max, gap = 7 }) {
  const t = useTheme();
  const all = line.options || [];
  const slots = withContents ? all : all.slice((line.contents || []).length);
  if (!slots.length) return null;
  const shown = max ? slots.slice(0, max) : slots;
  const more = slots.length - shown.length;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
      <div style={{ width: 3, borderRadius: 2, background: t.primary, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap }}>
        {shown.map((o, i) => {
          const cut = o.indexOf(' (+');
          return (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.42, color: t.ink, fontWeight: 600 }}>
              {cut < 0 ? o : <>{o.slice(0, cut)}<span style={{ fontWeight: 400, color: t.muted }}>{o.slice(cut)}</span></>}
            </div>);
        })}
        {more > 0 && <div style={{ fontSize: 12, lineHeight: 1.42, color: t.muted }}>+{more} lainnya</div>}
      </div>
    </div>);
}

// ── Bottom sheet shell ─────────────────────────────────────
function Sheet({ children, onClose, title, footer, maxH = '86%' }) {
  const t = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,8,0.42)', animation: 'om-fade .2s ease' }} />
      <div style={{ position: 'relative', background: t.surface, borderTopLeftRadius: t.radiusLg, borderTopRightRadius: t.radiusLg,
        maxHeight: maxH, display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 40px rgba(0,0,0,0.25)', animation: 'om-sheet .28s cubic-bezier(.2,.9,.3,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ ...{ width: 40, height: 5, borderRadius: 999, background: t.primary }, background: "rgb(134, 134, 134)", height: "4px" }} />
        </div>
        {title &&
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 6px' }}>
            <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 24, color: t.ink }}>{title}</h3>
            <button onClick={onClose} style={{ border: 'none', background: t.primarySoft, width: 34, height: 34, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="close" size={18} color={t.primary} /></button>
          </div>
        }
        <div style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', flex: 1, padding: '4px 20px 16px' }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px calc(16px + env(safe-area-inset-bottom))', borderTop: '1px solid ' + t.line, background: t.surface }}>{footer}</div>}
      </div>
    </div>);

}

// ── Screen scaffold: status-clearing top bar + scroll body + optional dock ──
function TopBar({ title, onBack, right, transparent, big, sub, flush }) {
  const t = useTheme();
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, paddingTop: flush ? 6 : 50,
      background: transparent ? 'transparent' : t.bg,
      borderBottom: transparent ? '1px solid transparent' : '1px solid ' + t.line }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 12px', minHeight: 44 }}>
        {onBack &&
        <button onClick={onBack} style={{ border: 'none', background: t.surface, boxShadow: t.shadow, width: 40, height: 40, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.ink, flexShrink: 0 }}><Icon name="back" size={20} /></button>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={{ fontFamily: big ? t.fontDisplay : t.fontBody, fontStyle: big && t.displayItalic ? 'italic' : 'normal', fontWeight: big ? t.displayWeight : 700, fontSize: big ? 26 : 17, color: t.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
          {sub && <div style={{ fontSize: 12.5, color: t.muted, marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>);

}

// ── color helpers ──────────────────────────────────────────
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16),g = parseInt(n.slice(2, 4), 16),b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  let r = parseInt(n.slice(0, 2), 16) + amt,g = parseInt(n.slice(2, 4), 16) + amt,b = parseInt(n.slice(4, 6), 16) + amt;
  const cl = (x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0');
  return '#' + cl(r) + cl(g) + cl(b);
}

// ── Confirm dialog — global destructive-action confirmation ─
function ConfirmDialog() {
  const t = useTheme();
  const app = useApp();
  const c = app.confirm;
  if (!c) return null;
  const onCancel = () => app.closeConfirm();
  const onOk = () => {app.closeConfirm();c.onConfirm && c.onConfirm();};
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 120, background: hexA('#0a1413', 0.5), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, animation: 'om-fade .2s ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: t.surface, borderRadius: t.radiusLg, padding: '24px 22px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 20, color: t.ink, lineHeight: 1.15 }}>{c.title || 'Hapus item?'}</h3>
        {c.message && <p style={{ margin: '8px 0 20px', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>{c.message}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: c.message ? 0 : 20 }}>
          <Button variant="ghost" size="md" full onClick={onCancel}>{c.cancelLabel || 'Batal'}</Button>
          <Button size="md" full onClick={onOk} style={{ background: c.tone === 'primary' ? undefined : t.primary, boxShadow: 'none', color: t.onPrimary }}>{c.confirmLabel || 'Hapus'}</Button>
        </div>
      </div>
    </div>);

}

// ── OrderTypePills — segmented Dine In / Take Away ─────────
// Visual segmented control. Ketuk segmen → buka sheet konfirmasi (pre-select segmen itu).
function OrderTypePills({ style }) {
  const t = useTheme();
  const app = useApp();
  const opts = [
  { id: 'dinein', label: 'Dine In', icon: 'dineIn' },
  { id: 'takeaway', label: 'Take Away', icon: 'takeaway' }];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: 4, padding: 4, background: t.surface2, borderRadius: 12, border: '1px solid ' + t.line, ...style }}>
      {opts.map((o) => {
        const on = app.orderType === o.id;
        return (
          <button
            key={o.id}
            onClick={() => app.openSheet('orderType', { pending: o.id })}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: on ? t.primary : 'transparent',
              boxShadow: on ? '0 1px 3px ' + hexA(t.primary, 0.35) : 'none',
              fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              color: on ? t.onPrimary : t.muted,
              WebkitTapHighlightColor: 'transparent', transition: 'background .15s, color .15s' }}>

            <Icon name={o.icon} size={16} color={on ? t.onPrimary : t.faint} stroke={1.9} />
            {o.label}
          </button>);

      })}
    </div>);

}

// Klaim item gratis \u2014 kalau pilihannya cuma 1 varian, skip sheet pemilihan (tidak ada gunanya
// menyuruh user "pilih" saat cuma ada 1 opsi) dan langsung ke halaman detail/varian item itu.
function openFreeItemPick(app, promo) {
  if (promo.choices && promo.choices.length === 1) {
    app.go('item', { id: promo.choices[0], freePromo: promo.id });
    return;
  }
  app.openSheet('freeitem', { promoId: promo.id });
}

Object.assign(window, {
  ThemeCtx, AppCtx, useTheme, useApp,
  Icon, Money, OptLines, ReceiptLines, lineBreakdown, PaketDetail, isPaketLine, EmptyState, Button, QtyStepper, Pill, FoodImg, Sheet, TopBar, ConfirmDialog, OrderTypePills, hexA, shade, openFreeItemPick
});