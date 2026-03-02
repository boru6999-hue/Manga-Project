import AppError from "../utils/AppError.js";

export default (err, req, res, next) => {
  if (err.code === "P2002") {
    err = new AppError("Duplicate field value", 400);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    message: err.message,
  });
};