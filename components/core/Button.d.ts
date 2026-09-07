/**
 * Primary action button. Sizes: lg (default, 54px, main CTAs) · md (44px, dialogs)
 * · sm (36px, inline/compact actions). Variants: primary (filled teal) · ghost
 * (outlined) · soft (tinted) · dark (ink-filled, for high-contrast moments).
 */
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  /** @default 'primary' */
  variant?: 'primary' | 'ghost' | 'soft' | 'dark';
  /** @default 'lg' */
  size?: 'lg' | 'md' | 'sm';
  disabled?: boolean;
  /** Shows a spinner in place of the icon and disables interaction — for the moment after tap while an async action (payment, status check) is in flight. */
  loading?: boolean;
  /** Stretch to 100% of container width — the common case for sheet/dialog footers. */
  full?: boolean;
  /** Leading icon element, e.g. <Icon name="plus" size={18} />. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}
