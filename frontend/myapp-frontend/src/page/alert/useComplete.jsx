import { useState } from 'react';
import CompleteDialog from './completeDialog';

//complete dialog
const useComplete = () => {
  const [showComplete, setShowComplete] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);
  
  const showCompleteContent = () => {
    setShowComplete(true);
    
    const promise = new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });

    return promise;
  };

  const handleCompleteClose = () => {
    if (resolvePromise) {
      resolvePromise();
    }
    setShowComplete(false);
    return;
  };

  return {
    showCompleteContent,
    renderDialogsComplete: (dialog) => (
      <>
        {showComplete && <CompleteDialog onClose={handleCompleteClose} message={dialog}/>}
      </>
    ),
  };

};

export default useComplete;
