import { useState } from 'react';
import AlertDialog from './alertDialog';

//alert dialog
const useDialog = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const showAlertDialog = (onConfirm) => {
    setShowAlert(true);
    setOnConfirmAction(() => onConfirm);
    
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setShowAlert(false);
    if (onConfirmAction) onConfirmAction();
    if (resolvePromise) resolvePromise();
  };

  const handleCancel = () => {
    setShowAlert(false);
    if (resolvePromise) resolvePromise();
  };


  return {
    showAlertDialog,
    renderDialogs: (message) => (
      <>
        {showAlert && (
          <AlertDialog
            message={message || "本当に実行しますか？"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </>
    ),
  };
};

export default useDialog;
