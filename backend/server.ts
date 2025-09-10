import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./src/db";   // 👈 must match the export above

const app = express();
app.use(cors());

app.get("/api/characters", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db: "connected", time: result.rows[0].now });
  } catch (err: any) {
    console.error("DB error:", err);
    res.status(500).json({ db: "error", error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
