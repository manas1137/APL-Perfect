import { motion } from "framer-motion";
import { classNames } from "../../utils";

const Card = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  action,
  padding = "md",
  ...props 
}) => {
  const paddingClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classNames(
        "bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm w-full",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="w-full sm:w-auto">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;