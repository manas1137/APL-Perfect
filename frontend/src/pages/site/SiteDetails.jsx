import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/cards";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { siteApi } from "../../api";

const SiteDetails = () => {
  const detailsHook = useApi(siteApi.details);

  useEffect(() => {
    detailsHook.execute();
  }, [detailsHook.execute]);

  const site = detailsHook.data?.data || {};
  const assignedWorkers = Array.isArray(site.assignedWorkers) ? site.assignedWorkers.length : 0;

  const isLoading = detailsHook.status === API_STATUS.LOADING;

  const infoItems = [
    { label: "Site Owner", value: site.ownerName },
    { label: "Location", value: site.location },
    { label: "Budget", value: site.budget != null ? `₹${site.budget}` : "—" },
    { label: "Assigned Workers", value: assignedWorkers },
    { label: "Created Date", value: site.createdAt ? new Date(site.createdAt).toLocaleDateString() : "—" },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
          {isLoading ? "Loading..." : site.name}
        </h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Site Details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card title="Site Information">
            <div className="space-y-3 sm:space-y-4">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{item.label}</label>
                  <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">
                    {item.value != null && item.value !== "" ? item.value : "—"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card title="Status">
            <div>
              <label className="text-sm text-secondary-600 dark:text-secondary-400">Status</label>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {site.isActive === false ? "Deactivated" : "Active"}
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SiteDetails;
