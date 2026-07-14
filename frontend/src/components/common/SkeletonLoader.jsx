import { motion } from "framer-motion";
import { classNames } from "../../utils";

const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={classNames("bg-secondary-200 dark:bg-secondary-700 rounded", className)}
      {...props}
    />
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-12 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonTable };