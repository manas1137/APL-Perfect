import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`border-2 border-primary-600 border-t-transparent rounded-full ${sizes[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;