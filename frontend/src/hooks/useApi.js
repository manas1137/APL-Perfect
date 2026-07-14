import { useState, useCallback, useRef, useEffect } from "react";
import { API_STATUS } from "../constants";

export const useApi = (apiFn) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [error, setError] = useState(null);
  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      if (inFlightRef.current) {
        return;
      }
      inFlightRef.current = true;
      setStatus(API_STATUS.LOADING);
      setError(null);
      try {
        const response = await apiFnRef.current(...args);
        if (mountedRef.current) {
          setData(response.data);
          setStatus(API_STATUS.SUCCESS);
        }
        return response.data;
      } catch (err) {
        if (!mountedRef.current) return;
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong";
        setError(message);
        setStatus(API_STATUS.ERROR);
        throw err;
      } finally {
        inFlightRef.current = false;
      }
    },
    []
  );

  return {
    data,
    status,
    error,
    execute,
    isLoading: status === API_STATUS.LOADING,
  };
};