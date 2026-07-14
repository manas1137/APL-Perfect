import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Site from "../models/Site.js";

const siteProtect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.siteJwt) {
    token = req.cookies.siteJwt;
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.site = await Site.findById(decoded.id);

    if (!req.site) {
      return next(new ApiError(401, "Not authorized - site not found"));
    }

    if (req.site.isActive === false) {
      return next(new ApiError(401, "Site account is deactivated"));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, "Not authorized - invalid token"));
  }
};

export { siteProtect };
