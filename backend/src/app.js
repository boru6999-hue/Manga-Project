console.log("app.js start");
import express from "express";
import cors from "cors";


import authRoutes from "./routes/auth.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";
import mangaRoutes from "./routes/manga.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import categoryRoutes from "./routes/category.routes.js";
import tagRouter from "./routes/tag.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tags", tagRouter);

console.log("routes imported");

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/manga", mangaRoutes);  
app.use("/api/categories", categoryRoutes);


// Middleware for handling errors & 404
app.use(notFound);
app.use(errorHandler);

console.log("app.js ready");
export default app;