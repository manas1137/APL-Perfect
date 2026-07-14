import { forwardRef } from "react";
import { classNames } from "../../utils";

const Input = forwardRef(({ label, error, className, labelClassName, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={classNames("text-sm sm:text-sm font-medium text-secondary-700 dark:text-secondary-300", labelClassName)}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classNames(
          "px-4 py-3 sm:py-2.5 rounded-lg border transition-theme",
          "border-secondary-300 dark:border-secondary-600",
          "bg-white dark:bg-secondary-800",
          "text-base sm:text-sm text-secondary-900 dark:text-white",
          "placeholder:text-secondary-400 dark:placeholder:text-secondary-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "min-h-[44px] sm:min-h-0",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;