import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import Site from "../models/Site.js";
import { ApiError } from "../utils/ApiError.js";

const login = async (name, password, res) => {
  const site = await Site.findOne({ name: name }).select("+password");

  if (!site) {
    console.log("[DEBUG][SITE LOGIN]", {
      branch: "site-not-found",
      enteredName: name,
      enteredPassword: password,
      siteFound: !!site
    });
    throw new ApiError(401, "Invalid credentials");
  }

  if (site.isActive === false) {
    console.log("[DEBUG][SITE LOGIN]", {
      branch: "site-deactivated",
      enteredName: name,
      siteName: site?.name,
      isActive: site?.isActive
    });
    throw new ApiError(401, "Site account is deactivated");
  }

  let isPasswordCorrect = false;

  if (site.password && (site.password.startsWith("$2a$") || site.password.startsWith("$2b$"))) {
    isPasswordCorrect = await site.comparePassword(password);
  } else {
    isPasswordCorrect = password === site.password;
    if (isPasswordCorrect) {
      const salt = await bcrypt.genSalt(10);
      site.password = await bcrypt.hash(password, salt);
      await site.save();
    }
  }

  if (!isPasswordCorrect) {
    console.log("[DEBUG][SITE LOGIN]", {
      branch: "password-mismatch",
      enteredName: name,
      siteName: site?.name,
      storedPassword: site?.password,
      isPasswordCorrect
    });
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(site._id, "site");

  res.cookie("siteJwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    site: {
      _id: site._id,
      name: site.name,
      ownerName: site.ownerName,
      location: site.location,
      role: "site",
    },
  };
};

const logout = async (res) => {
  res.clearCookie("siteJwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export { login, logout };