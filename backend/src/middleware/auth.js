import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return next(new ApiError(401, "Not authorized - admin not found"));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, "Not authorized - invalid token"));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return next(
        new ApiError(403, `Role ${req.admin.role} is not authorized for this route`)
      );
    }
    next();
  };
};

export { protect, authorize };
