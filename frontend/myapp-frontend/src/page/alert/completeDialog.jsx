import './dialog.css';


// eslint-disable-next-line react/prop-types
const CompleteDialog = ({ onClose , message }) => {
  return (
    <div className="completeBox">
      <p>{message ||'完了しました'}</p>
      <button className="confirmButton" onClick={onClose}>OK</button>
    </div>
  );
};

export default CompleteDialog;
