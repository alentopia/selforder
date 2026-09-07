/** Two-way segmented control for order type. Presentational — pass the current
 * `value` and handle selection yourself (the real app opens a confirm sheet before
 * committing the switch, since it affects table assignment / pickup instructions). */
export interface OrderTypePillsProps {
  value: 'dinein' | 'takeaway';
  onSelect: (next: 'dinein' | 'takeaway') => void;
  style?: React.CSSProperties;
}
