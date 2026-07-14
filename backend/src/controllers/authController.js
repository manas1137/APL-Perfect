import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { login, logout } from "../services/authService.js";

const loginAdmin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(new ApiError(400, "Username/email and password are required"));
    }

    const result = await login(identifier, password, res);

    const response = new ApiResponse(200, result, "Login successful");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const logoutAdmin = async (req, res, next) => {
  try {
    await logout(res);

    const response = new ApiResponse(200, null, "Logout successful");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export { loginAdmin, logoutAdmin };
