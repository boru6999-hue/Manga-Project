import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../middlewares/catchAsync.js";
import AppError from "../utils/AppError.js";

// JWT token үүсгэх функц
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// User register
export const register = catchAsync(async (req, res, next) => {
  console.log("Body:", req.body);
  const { Username, email, password } = req.body;

  console.log("Received registration data:", { username: Username, email, password: password ? "******" : undefined });

  // Бүх required fields байгаа эсэхийг шалгах
  if (!Username || !email || !password) {
    console.log("Missing fields:", { username: Username, email, password });
    return next(new AppError("All fields required", 400));
  }

  // Password-г hash хийх
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log("Hashed password:", hashedPassword);

  // DB холболт шалгах (try/catch)
  try {
    const existingUsers = await prisma.user.findMany();
    console.log("Database connection OK. Users:", existingUsers);
  } catch (err) {
    console.error("Database connection failed:", err);
    return next(new AppError("Database connection failed", 500));
  }

  // User үүсгэх
  const user = await prisma.user.create({
    data: {
      Username, // lowercase field name
      email,
      password: hashedPassword,
    },
  });
  console.log("Created user:", { id: user.id, username: user.username, email: user.email });

  // JWT token үүсгэх
  const token = signToken(user.id);

  // Амжилттай response
  res.status(201).json({
    ok: true,
    token,
  });
});

// User login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError("Invalid credentials", 401));

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return next(new AppError("Invalid credentials", 401));

  const token = signToken(user.id);

  res.json({ ok: true, token });
});

// Me route
export const me = catchAsync(async (req, res) => {
  res.json({ ok: true, user: req.user });
});