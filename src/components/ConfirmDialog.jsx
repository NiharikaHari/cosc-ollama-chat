export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-dialog">
      <h2 className="modal-title">{title}</h2>
      <p className="confirm-dialog-message">{message}</p>
      <div className="modal-actions">
        <button
          type="button"
          className="confirm-dialog-confirm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
