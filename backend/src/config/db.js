import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

console.log("DB envs:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "***" : undefined,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // PORT
  port: parseInt(process.env.DB_PORT || "3306", 10),

  // CONNECTION POOL
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "20", 10),

  // 🔑 MYSQL 8 AUTH FIX
  allowPublicKeyRetrieval: true,

  // DEV environment дээр SSL хэрэггүй
  ssl: false
});

const prisma = new PrismaClient({ adapter });

export default prisma;