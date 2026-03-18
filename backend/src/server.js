import "dotenv/config";
import app from "./app.js";
import prisma from "./config/db.js";

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
  process.exit(1);
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
}

startServer();