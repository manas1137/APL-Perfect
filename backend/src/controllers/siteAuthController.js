import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { login, logout } from "../services/siteAuthService.js";

const loginSite = async (req, res, next) => {
  try {
    console.log("[SITE AUTH CTRL] Incoming login body:", JSON.stringify(req.body));

    const { name, password } = req.body;

    if (!name || !password) {
      return next(new ApiError(400, "SITE NAME AND PASSWORD REQUIRED"));
    }

    const result = await login(name, password, res);

    const response = new ApiResponse(200, result, "Login successful");
    console.log("[SITE AUTH CTRL] Login response -> 200 for site:", result.site.name);
    response.send(res);
  } catch (error) {
    console.log("[SITE AUTH CTRL] Login error ->", error.statusCode || 500, error.message);
    next(error);
  }
};

const logoutSite = async (req, res, next) => {
  try {
    await logout(res);

    const response = new ApiResponse(200, null, "Logout successful");
    console.log("[SITE AUTH CTRL] Logout response -> 200");
    response.send(res);
  } catch (error) {
    console.log("[SITE AUTH CTRL] Logout error ->", error.statusCode || 500, error.message);
    next(error);
  }
};

export { loginSite, logoutSite };
