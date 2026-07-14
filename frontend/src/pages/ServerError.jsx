import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/buttons";

const ServerError = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-secondary-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-8xl mb-4"
        >
          ⚠️
        </motion.div>
        
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">500</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Something went wrong on our end
        </p>
        
        <Link to="/">
          <Button variant="primary">
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ServerError;