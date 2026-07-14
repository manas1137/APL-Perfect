import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import Site from "../models/Site.js";
import { ApiError } from "../utils/ApiError.js";

const login = async (name, password, res) => {
  console.log("[SITE AUTH] login() called");
  console.log("[SITE AUTH] received name:", JSON.stringify(name));
  console.log("[SITE AUTH] password provided:", Boolean(password));

  if (!name || !password) {
    console.log("[SITE AUTH] FAIL: name or password missing");
    throw new ApiError(400, "SITE NAME AND PASSWORD REQUIRED");
  }

  // Case-insensitive + whitespace-tolerant lookup (regex-escaped to avoid injection)
  const escapedName = String(name)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const site = await Site.findOne({
    name: { $regex: `^${escapedName}$`, $options: "i" },
  }).select("+password");

  console.log("[SITE AUTH] site lookup -> found:", !!site, "queriedName:", name);
  if (site) {
    console.log("[SITE AUTH] matched site name in DB:", site.name, "isActive:", site.isActive);
  }

  if (!site) {
    console.log("[SITE AUTH] FAIL: SITE NOT FOUND for name:", name);
    throw new ApiError(401, "SITE NOT FOUND: No site exists with the name '" + name + "'");
  }

  if (site.isActive === false) {
    console.log("[SITE AUTH] FAIL: SITE DISABLED (isActive=false) for name:", site.name);
    throw new ApiError(401, "SITE DISABLED: This site account has been deactivated");
  }

  const storedPassword = site.password;
  console.log(
    "[SITE AUTH] stored password present:",
    Boolean(storedPassword),
    "prefix:",
    storedPassword ? storedPassword.slice(0, 4) : "none"
  );

  let isPasswordCorrect = false;
  const looksHashed =
    storedPassword &&
    (storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$"));

  if (looksHashed) {
    isPasswordCorrect = await site.comparePassword(password);
    console.log("[SITE AUTH] bcrypt compare result:", isPasswordCorrect);
  } else {
    // Support legacy plaintext passwords until migration is complete
    isPasswordCorrect = password === storedPassword;
    console.log("[SITE AUTH] plaintext compare result:", isPasswordCorrect);
    if (isPasswordCorrect) {
      const salt = await bcrypt.genSalt(10);
      site.password = await bcrypt.hash(password, salt);
      await site.save();
      console.log("[SITE AUTH] migrated plaintext password -> bcrypt hash");
    }
  }

  if (!isPasswordCorrect) {
    console.log("[SITE AUTH] FAIL: PASSWORD INCORRECT for name:", site.name);
    throw new ApiError(401, "PASSWORD INCORRECT: The password you entered is wrong");
  }

  const token = generateToken(site._id, "site");

  res.cookie("siteJwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  console.log("[SITE AUTH] SUCCESS: login complete for site:", site.name, "| cookie 'siteJwt' set");

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
