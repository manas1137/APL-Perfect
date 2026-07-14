import { motion } from "framer-motion";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-secondary-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <div className="w-20 h-20 mx-auto bg-primary-600 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 6.16-1.26 10-5.45 10-11V7l-10-5z" />
            </svg>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-bold text-secondary-900 dark:text-white"
        >
          APL Perfect
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-2 text-secondary-600 dark:text-secondary-400"
        >
          Construction Management System
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <div className="w-12 h-1 border-2 border-primary-600 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              className="w-full h-full bg-primary-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;