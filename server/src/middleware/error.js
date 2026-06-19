import { AppError, fail } from "../utils/http.js";

export function notFound(req, _res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    return fail(res, 409, "A record with that value already exists", error.keyValue);
  }
  if (error.name === "CastError") return fail(res, 400, "Invalid resource identifier");

  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return fail(res, status, error.message || "Internal server error", error.details);
}

