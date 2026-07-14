import { createContext, useContext, useState, useCallback } from "react";

const DataRefreshContext = createContext(null);

const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (!context) {
    throw new Error("useDataRefresh must be used within DataRefreshProvider");
  }
  return context;
};

const DataRefreshProvider = ({ children }) => {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return (
    <DataRefreshContext.Provider value={{ tick, refresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export { useDataRefresh , DataRefreshProvider };
export default DataRefreshProvider;
