import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getAdminDashboard, getSiteDashboard } from "../services/dashboardService.js";

const getAdminDashboardData = async (req, res, next) => {
  try {
    const data = await getAdminDashboard();

    const response = new ApiResponse(200, data, "Admin dashboard fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteDashboardData = async (req, res, next) => {
  try {
    const data = await getSiteDashboard(req.site._id);

    const response = new ApiResponse(200, data, "Site dashboard fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export { getAdminDashboardData, getSiteDashboardData };
