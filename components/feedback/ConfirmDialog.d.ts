/** Centered, blocking confirmation modal — destructive actions ("Hapus item?") and
 * single, specific order-check alerts. Backdrop click and Cancel both fire `onCancel`. */
export interface ConfirmDialogProps {
  /** @default 'Hapus item?' */
  title?: string;
  message?: string;
  /** @default 'Hapus' */
  confirmLabel?: string;
  /** @default 'Batal' */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
