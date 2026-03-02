import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";
import catchAsync from "./catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) return next(new AppError("User not found", 401));

  req.user = user;
  next();
});