/** Photo slot for menu items / cart lines. Renders a diagonal-stripe placeholder with
 * a monospace caption until `src` loads successfully; fails silently back to the
 * placeholder if the image errors. */
export interface FoodImgProps {
  /** Shown in the placeholder caption ("foto · {label}") and as the img alt text. */
  label: string;
  /** @default 120 */
  h?: number;
  /** @default 12 */
  radius?: number;
  style?: React.CSSProperties;
  src?: string;
}
