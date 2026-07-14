import { useState } from "react";
import { motion } from "framer-motion";
import { classNames } from "../../utils";

const SearchBar = ({ placeholder = "Search...", onSearch, className }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={classNames("relative", className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={classNames(
          "w-full pl-10 pr-4 py-2.5 rounded-lg border transition-theme",
          "border-secondary-300 dark:border-secondary-600",
          "bg-white dark:bg-secondary-800",
          "text-secondary-900 dark:text-white",
          "placeholder:text-secondary-400 dark:placeholder:text-secondary-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        )}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500"
      >
        🔍
      </motion.button>
    </form>
  );
};

export default SearchBar;