import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { ok } from "./utils/http.js";

const app = express();
const configuredOrigins = env.clientUrl
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/$/, "");
  return (
    configuredOrigins.includes(normalizedOrigin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin) ||
    (env.nodeEnv !== "production" && /^http:\/\/localhost:\d+$/i.test(normalizedOrigin))
  );
}

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);
app.use(
  "/api/v1/chat",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 25,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.get("/", (_req, res) =>
  ok(res, {
    service: "finsight-api",
    message: "FinSight AI backend is running",
    health: "/api/v1/health"
  })
);
app.get("/api/v1/health", (_req, res) => ok(res, { service: "finsight-api", uptime: process.uptime() }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/market", marketRoutes);
app.use("/api/v1/portfolios", portfolioRoutes);
app.use("/api/v1/learning", learningRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
