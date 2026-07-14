import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const requiredEnvVars = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "NODE_ENV",
  "CLIENT_URL",
];

const optionalEnvVars = ["JWT_EXPIRES"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  optionalEnvVars.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`Optional environment variable ${key} is not set. Using default.`);
    }
  });

  if (process.env.NODE_ENV === "production" && !process.env.JWT_EXPIRES) {
    console.warn("JWT_EXPIRES is not set in production. Using default 24h.");
  }
};

const env = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || "24h",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

export { validateEnv, env };
