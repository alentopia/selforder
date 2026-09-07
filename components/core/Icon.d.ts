/** Line-icon glyph, 24×24 viewBox, stroke-based (matches Hanken Grotesk/Inter's geometric weight). */
export interface IconProps {
  name:
    | 'back' | 'close' | 'search' | 'plus' | 'minus' | 'trash' | 'cart' | 'tag'
    | 'arrowRight' | 'lock' | 'check' | 'checkCircle' | 'chevron' | 'qr' | 'phone'
    | 'bolt' | 'info' | 'clock' | 'edit' | 'receipt' | 'download' | 'share' | 'mail'
    | 'instagram' | 'table' | 'gift' | 'copy' | 'fire' | 'spark' | 'user' | 'pin'
    | 'home' | 'dineIn' | 'takeaway' | 'whatsapp' | 'bell' | 'megaphone' | 'percent' | 'coupon';
  /** @default 22 */
  size?: number;
  /** @default 'currentColor' */
  color?: string;
  /** @default 2 */
  stroke?: number;
  style?: React.CSSProperties;
}
