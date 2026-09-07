/** Sticky screen header: back button (circular, floating), title, optional subtitle
 * and trailing slot. Every full screen opens with one of these. */
export interface TopBarProps {
  title?: React.ReactNode;
  onBack?: () => void;
  /** Rendered inside the back button — pass an <Icon name="back" />. */
  backIcon?: React.ReactNode;
  /** Trailing content (search, cart button, …). */
  right?: React.ReactNode;
  /** Drop the background/border — for screens that scroll under the bar (hero photo, etc). */
  transparent?: boolean;
  /** Use display type + larger size for the title — greeting/hero screens. */
  big?: boolean;
  sub?: React.ReactNode;
  /** Reduce the default status-bar clearance padding — for sheets, not full screens. */
  flush?: boolean;
}
