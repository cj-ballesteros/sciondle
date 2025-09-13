import { Router } from "express";
import { pool } from "../db";

const router = Router();

const correct_character_id = 4;

router.post("/guess", async (req, res) => {
  try {
    const {characterId} = req.body;

    if (!characterId) {
      return res.status(400).json({error: "Missing characterId"});
    }

    const result = await pool.query(
      "SELECT id, name, image_url FROM characters WHERE id = $1",
      [characterId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: "Character not found"});
    }

    const character = result.rows[0];

    const isCorrect = character.id === correct_character_id;

    res.json({correct: isCorrect, character});
  } catch(err) {
  console.error(err);
  res.status(500).json({error: "server error"});}
});

export default router;
