import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/favourites", favouriteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;