import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  const payload = { id, role };

  const options = {
    expiresIn: process.env.JWT_EXPIRES || "24h",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export { generateToken };
