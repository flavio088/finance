import { CreateTransactionDTO, Transaction, TransactionType, PaymentMethod } from "../models/transaction.model.js";
import { createTransaction, findTransactionsByUserId } from "../repositories/transaction.repository.js";

interface CreateTransactionInput {
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  paymentMethod?: PaymentMethod;
  date: string;
}

export async function createTransactionService(
  input: CreateTransactionInput
): Promise<Transaction> {
  return createTransaction({
    user_id: input.userId,
    type: input.type,
    amount: input.amount,
    description: input.description.trim(),
    payment_method: input.paymentMethod,
    date: input.date,
  });
}

export async function getTransactionsService(userId: string): Promise<{
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
}> {
  const transactions = await findTransactionsByUserId(userId);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return { transactions, balance, totalIncome, totalExpense };
}