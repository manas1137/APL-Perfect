import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../buttons";

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 bg-white dark:bg-secondary-800 rounded-xl shadow-xl p-6 max-w-sm w-full"
          >
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">{title}</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">{message}</p>
            
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={onClose}>
                {cancelText}
              </Button>
              <Button 
                variant={variant} 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
