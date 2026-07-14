import { forwardRef } from "react";
import { classNames } from "../../utils";

const Button = forwardRef(({ children, variant = "primary", size = "md", className, disabled, ...props }, ref) => {
  const baseClasses = "font-medium rounded-lg transition-theme inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-white focus:ring-secondary-500",
    outline: "border border-secondary-300 dark:border-secondary-600 bg-transparent hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 focus:ring-secondary-500",
    ghost: "bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 focus:ring-secondary-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-base sm:text-sm min-h-[44px] sm:min-h-0",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={classNames(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;