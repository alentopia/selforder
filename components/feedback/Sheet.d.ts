/** Bottom-sheet shell — the standard container for any secondary flow that shouldn't
 * leave the current screen (filters, variant picker, order-type confirm, "what's
 * wrong with my order" overlays with 2+ issues). Tapping the backdrop calls `onClose`. */
export interface SheetProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  /** Sticky footer, typically a full-width primary Button. */
  footer?: React.ReactNode;
  /** @default '86%' */
  maxH?: string;
}
