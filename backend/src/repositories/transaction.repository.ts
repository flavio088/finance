import pool from "../config/database.js";
import {
  Transaction,
  CreateTransactionDTO,
  TransactionFilters,
} from "../models/transaction.model.js";

export async function createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
  const result = await pool.query<Transaction>(
    `INSERT INTO transactions (user_id, type, amount, description, payment_method, category, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.user_id,
      data.type,
      data.amount,
      data.description,
      data.payment_method ?? null,
      data.category ?? "outros",
      data.date,
    ]
  );
  return result.rows[0];
}

export async function findTransactionsByUserId(
  userId: string,
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const conditions: string[] = ["user_id = $1"];
  const params: unknown[] = [userId];
  let paramIndex = 2;

  if (filters.type) {
    conditions.push(`type = $${paramIndex++}`);
    params.push(filters.type);
  }
  if (filters.paymentMethod) {
    conditions.push(`payment_method = $${paramIndex++}`);
    params.push(filters.paymentMethod);
  }
  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }
  if (filters.startDate) {
    conditions.push(`date >= $${paramIndex++}`);
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`date <= $${paramIndex++}`);
    params.push(filters.endDate);
  }
  if (filters.q) {
    conditions.push(`description ILIKE $${paramIndex++}`);
    params.push(`%${filters.q}%`);
  }

  const result = await pool.query<Transaction>(
    `SELECT * FROM transactions
     WHERE ${conditions.join(" AND ")}
     ORDER BY date DESC, created_at DESC`,
    params
  );
  return result.rows;
}

export async function findTransactionByIdAndUser(
  id: string,
  userId: string
): Promise<Transaction | null> {
  const result = await pool.query<Transaction>(
    `SELECT * FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] ?? null;
}

export async function updateTransaction(
  id: string,
  userId: string,
  data: {
    type: Transaction["type"];
    amount: number;
    description: string;
    payment_method: Transaction["payment_method"];
    category: Transaction["category"];
    date: string;
  }
): Promise<Transaction | null> {
  const result = await pool.query<Transaction>(
    `UPDATE transactions
     SET type = $3, amount = $4, description = $5, payment_method = $6,
         category = $7, date = $8
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [
      id,
      userId,
      data.type,
      data.amount,
      data.description,
      data.payment_method,
      data.category,
      data.date,
    ]
  );
  return result.rows[0] ?? null;
}

export async function deleteTransaction(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}
