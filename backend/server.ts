import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./src/db";   // 👈 must match the export above
import path from "path";
import gameRouter from "./src/routes/game";
import { errorHandler } from './src/middleware/errorHandler';

const app = express();
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api", gameRouter);

app.get("/api/characters", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const result = await pool.query(
      "SELECT id, name, image_url FROM characters WHERE name ILIKE $1 LIMIT 10",
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("DB error:", err);
    res.status(500).json({ db: "error", error: err.message });
  }
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
