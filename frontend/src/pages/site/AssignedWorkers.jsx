import { useEffect } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import api from "../../api/axios";

const AssignedWorkers = () => {
  const { data, status, error, execute } = useApi(() => api.get("/site/assigned-workers"));

  useEffect(() => {
    execute();
  }, [execute]);

  const workers = Array.isArray(data?.data) ? data.data : [];

  const workerColumns = [
    { key: "name", label: "Name" },
    { key: "mobileNumber", label: "Mobile" },
    { key: "esiNumber", label: "ESI Number" },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === true
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }`}>
          {value === true ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Assigned Workers</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Workers assigned to this site</p>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search workers..." />
        </div>
        <Table 
          columns={workerColumns} 
          data={workers} 
          isLoading={status === API_STATUS.LOADING}
          emptyMessage="No workers assigned"
        />
      </Card>
    </div>
  );
};

export default AssignedWorkers;