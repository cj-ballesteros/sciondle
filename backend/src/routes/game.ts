import { Router } from "express";
import { pool } from "../db";

const router = Router();

const correct_character_id = 4;

router.post("/guess", async (req, res, next) => {
  try {
    if (!req.body || typeof req.body.character_id === "undefined") {
      const error: any = new Error("Missing character_id in request body");
      error.status = 400;
      throw error;
    }

    const character_id = Number(req.body.character_id);
    if (isNaN(character_id)) {
      const error: any = new Error("character_id must be a number");
      error.status = 400;
      throw error;
    }

    const guess_result = await pool.query(
      "SELECT id, name, affiliation, current_job, race, version_introduction, image_url, age, gender, job_image_url FROM characters WHERE id = $1",
      [character_id]
    );

    if (guess_result.rows.length === 0) {
      const error: any = new Error("Character not found");
      error.status = 404;
      throw error;
    }
    const guess = guess_result.rows[0];

    const answerResult = await pool.query(
      "SELECT id, name, affiliation, current_job, race, version_introduction, image_url, age, gender FROM characters WHERE id = $1",
      [correct_character_id]
    )
    const answer = answerResult.rows[0];

    const comparison = {
      name: guess.name === answer.name,
      affiliation: guess.affiliation === answer.affiliation,
      current_job:
        guess.current_job === answer.current_job,
          // ? 'equal'
          // : guess.current_job === current_job
          // 'partial',
      race: guess.race === answer.race,
      version_introduction:
        guess.version_introduction === answer.version_introduction
          ? 'equal'
          : guess.version_introduction > answer.version_introduction
          ? 'lower'
          : 'higher',
      age:
        guess.age === answer.age
          ? 'equal'
          : guess.age > answer.age
          ? 'lower'
          : 'higher',
      gender: guess.gender === answer.gender,
    }

    res.json({
      guess,
      comparison,
      correct: guess.id === answer.id,
    });

  } catch(err) {
    next(err);
  }
});

export default router;
