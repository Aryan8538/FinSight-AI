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
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.clientUrl.split(",").map((value) => value.trim()), credentials: true }));
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

app.get("/api/v1/health", (_req, res) => ok(res, { service: "finsight-api", uptime: process.uptime() }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/market", marketRoutes);
app.use("/api/v1/portfolios", portfolioRoutes);
app.use("/api/v1/learning", learningRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;

