import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "../../utils";

const FOCUSABLE =
  'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  preventClose = false,
}) => {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Body scroll lock + Escape-to-close + autofocus first field
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !preventClose) onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown);

    const focusTimer = setTimeout(() => {
      const focusables = panelRef.current?.querySelectorAll(FOCUSABLE);
      focusables?.[0]?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, preventClose]);

  // Trap focus inside the modal
  const handleKeyDown = (e) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll(FOCUSABLE);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!preventClose) onCloseRef.current?.();
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onKeyDown={handleKeyDown}
            className={classNames(
              "relative z-10 flex flex-col w-[95vw] sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-hidden",
              "rounded-xl bg-white dark:bg-secondary-800 shadow-xl"
            )}
          >
            {/* Fixed header */}
            <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-secondary-200 dark:border-secondary-700 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white sm:text-xl">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                    {subtitle}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={() => {
                    if (!preventClose) onCloseRef.current?.();
                  }}
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {children}
            </div>

            {/* Fixed footer */}
            {footer && (
              <div className="flex flex-shrink-0 justify-end gap-3 border-t border-secondary-200 dark:border-secondary-700 px-5 py-4 sm:px-6">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
