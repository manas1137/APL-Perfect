/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import siteAuthApi from "../api/siteAuthApi";

const SiteAuthContext = createContext();

const getInitialSite = () => {
  const storedSite = localStorage.getItem("site");
  return storedSite ? JSON.parse(storedSite) : null;
};

const useSiteAuth = () => {
  const context = useContext(SiteAuthContext);
  if (!context) {
    throw new Error("useSiteAuth must be used within SiteAuthProvider");
  }
  return context;
};

const SiteAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [site, setSite] = useState(getInitialSite);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await siteAuthApi.login(credentials);
      const siteData = response.data.data;
      setSite(siteData);
      localStorage.setItem("site", JSON.stringify(siteData));
      toast.success("Site login successful!");
      navigate("/site/dashboard");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Site login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await siteAuthApi.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSite(null);
      localStorage.removeItem("site");
      navigate("/auth/site-login");
    }
  };

  const isAuthenticated = !!site;

  return (
    <SiteAuthContext.Provider value={{ site, isLoading, login, logout, isAuthenticated }}>
      {children}
    </SiteAuthContext.Provider>
  );
};

export { useSiteAuth, SiteAuthProvider };
export default SiteAuthContext;
