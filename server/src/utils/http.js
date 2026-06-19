export function ok(res, data, status = 200) {
  return res.status(status).json({ status: "success", data, error: null });
}

export function fail(res, status, message, details = null) {
  return res.status(status).json({
    status: "error",
    data: null,
    error: { message, details }
  });
}

export class AppError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

