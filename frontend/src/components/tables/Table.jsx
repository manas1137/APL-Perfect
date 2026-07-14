import { classNames } from "../../utils";
import { SkeletonTable } from "../common/SkeletonLoader";

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  className,
}) => {
  if (isLoading) {
    return <SkeletonTable rows={5} columns={columns.length} />;
  }

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className={classNames("overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0", className)}>
      <table className="w-full min-w-full sm:min-w-0">
        <thead>
          <tr className="border-b border-secondary-200 dark:border-secondary-700">
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={classNames(
                  "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase tracking-wider",
                  index === 0 ? "rounded-l-xl" : "",
                  index === columns.length - 1 ? "rounded-r-xl" : ""
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 sm:px-4 py-6 sm:py-8 text-center text-secondary-600 dark:text-secondary-400 text-sm sm:text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={classNames(
                  "border-b border-secondary-200 dark:border-secondary-700 last:border-0",
                  onRowClick && "cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-theme"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-sm text-secondary-900 dark:text-white"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;