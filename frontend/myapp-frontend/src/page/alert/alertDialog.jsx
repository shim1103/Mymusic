import './dialog.css';

// eslint-disable-next-line react/prop-types
const AlertDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="alertBox">
      <p>{message}</p>
      <button className="okButton" onClick={onConfirm}>
        OK
      </button>
      <button className="cancelButton" onClick={onCancel}>
        キャンセル
      </button>
    </div>
  );
};

export default AlertDialog;
