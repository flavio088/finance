import pool from "../config/database.js";
import { Transaction, CreateTransactionDTO } from "../models/transaction.model.js";

export async function createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
  const result = await pool.query<Transaction>(
    `INSERT INTO transactions (user_id, type, amount, description, payment_method, date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.user_id,
      data.type,
      data.amount,
      data.description,
      data.payment_method ?? null,
      data.date,
    ]
  );
  return result.rows[0];
}
