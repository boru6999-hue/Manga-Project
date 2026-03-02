import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../middlewares/catchAsync.js";
import AppError from "../utils/AppError.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return next(new AppError("All fields required", 400));

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });

  const token = signToken(user.id);

  res.status(201).json({ ok: true, token });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError("Invalid credentials", 401));

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return next(new AppError("Invalid credentials", 401));

  const token = signToken(user.id);

  res.json({ ok: true, token });
});

export const me = catchAsync(async (req, res) => {
  res.json({ ok: true, user: req.user });
});