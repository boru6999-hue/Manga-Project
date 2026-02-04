import { db } from "../config/db.js";

const [rows] = await db.query(
  "SELECT * FROM user WHERE email = ?",
  [email]
);
