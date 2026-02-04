import express from "express";
import cors from "cors";
import mangaRoutes from "./routes/manga.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";



import categoryRoutes from "./routes/category.routes.js";
import tagRoutes from "./routes/tag.routes.js";


const app = express();

app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => res.json({ ok: true }));


app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/manga", mangaRoutes);
app.use("/api/favourites", favouriteRoutes);


export default app;
