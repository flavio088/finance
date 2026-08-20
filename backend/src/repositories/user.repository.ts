import pool from "../config/database.js";
import { User, CreateUserDTO } from "../models/user.model.js";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.email, data.password]
  );
  return result.rows[0];
}