import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import { ApiError } from "../utils/ApiError.js";

const login = async (identifier, password, res) => {
  const admin = await Admin.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(admin._id, admin.role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    admin: {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
  };
};

const logout = async (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export { login, logout };
