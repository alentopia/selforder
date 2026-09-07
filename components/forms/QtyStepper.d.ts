/** Increment/decrement quantity control. `collapsible` starts as a single tappable
 * count pill (for dense grids) and expands to full +/- controls on tap, then
 * auto-collapses after ~2.5s of inactivity. */
export interface QtyStepperProps {
  value: number;
  onChange: (next: number) => void;
  /** @default 1 */
  min?: number;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** @default false */
  collapsible?: boolean;
  /** When at `min` and provided, the minus button calls this instead of decrementing — use to remove the line entirely. */
  onRemove?: () => void;
}
