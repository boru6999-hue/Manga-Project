import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";
import catchAsync from "./catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Authorization header шалгах
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorized - Token missing", 401));
  }

  // Token verify
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // User DB дээр байгаа эсэх
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return next(new AppError("User not found", 401));
  }

  // request дээр user хадгална
  req.user = user;

  next();
});