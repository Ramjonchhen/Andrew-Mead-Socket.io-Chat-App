// ? modules import
import mysql from "mysql";
import dotenv from "dotenv";

// ? env config
dotenv.config({ path: "./Secrets/.env" });

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

export default pool;
