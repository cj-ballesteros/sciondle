import { Pool } from "pg";

export const pool = new Pool({
  user: "yukinosakimuri",
  host: "localhost",
  database: "xivcharacters",
  password: "Databasefrieren10!",
  port: 5432,
});
