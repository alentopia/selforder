/** Formats a number as "Rp12.345" (Indonesian thousands separators). */
export interface MoneyProps {
  value: number;
  /** Muted + line-through — pair with a non-strike Money for a before/after price comparison. */
  strike?: boolean;
  style?: React.CSSProperties;
}
