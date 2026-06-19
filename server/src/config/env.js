import dotenv from "dotenv";

dotenv.config({ path: process.env.ENV_FILE || "../.env" });
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/finsight_ai",
  jwtSecret: process.env.JWT_SECRET || "development-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  finnhubApiKey: process.env.FINNHUB_API_KEY || "",
  marketCacheSeconds: Number(process.env.MARKET_CACHE_SECONDS || 60)
};

