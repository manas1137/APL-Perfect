import { motion } from "framer-motion";
import { classNames } from "../../utils";

const FormLayout = ({ 
  title, 
  subtitle, 
  children, 
  onSubmit,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={classNames(
        "bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm p-6",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </motion.div>
  );
};

export default FormLayout;