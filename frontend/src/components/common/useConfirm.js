import { useState } from "react";

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [dialogProps, setDialogProps] = useState({});

  const confirm = (callback, props = {}) => {
    setConfirmCallback(() => callback);
    setDialogProps(props);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleClose,
    dialogProps,
  };
};

export default useConfirm;