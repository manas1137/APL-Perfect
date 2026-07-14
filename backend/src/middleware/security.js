import helmet from "helmet";
import rateLimit from "express-rate-limit";

const securityMiddleware = (app) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.set("trust proxy", 1);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skip: (req) => req.method === "OPTIONS",
    message: {
      success: false,
      message: "Too many login attempts, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.method === "OPTIONS",
    message: {
      success: false,
      message: "Too many requests, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth/login", authLimiter);
  app.use("/api/site/auth/login", authLimiter);
  app.use("/api", generalLimiter);
};

export { securityMiddleware };
