/** Illustration + title + description for any empty/zero-result state. In the live
 * product the illustration is a user-fillable `<image-slot>` (drag-and-drop) rather
 * than a static image — this component falls back to a plain dashed placeholder box
 * when no `src` is given, since `<image-slot>` isn't available outside the editor. */
export interface EmptyStateProps {
  /** Real illustration URL, if you have one. */
  src?: string;
  title: string;
  desc: string;
  /** Illustration box size (square), px. @default 208 */
  size?: number;
  /** Optional action below the description, e.g. a Button. */
  children?: React.ReactNode;
}
