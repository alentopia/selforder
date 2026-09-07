/** Small uppercase status/category chip. */
export interface PillProps {
  children: React.ReactNode;
  /** @default 'neutral' */
  tone?: 'neutral' | 'primary' | 'danger';
  /** Leading icon element, e.g. <Icon name="tag" size={12} />. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}
