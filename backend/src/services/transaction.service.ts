import {
  CreateTransactionDTO,
  Transaction,
  TransactionFilters,
  TransactionType,
  PaymentMethod,
  Category,
} from "../models/transaction.model.js";
import {
  createTransaction,
  findTransactionsByUserId,
  findTransactionByIdAndUser,
  updateTransaction,
  deleteTransaction,
} from "../repositories/transaction.repository.js";

interface CreateTransactionInput {
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  paymentMethod?: PaymentMethod;
  category?: Category;
  date: string;
}

interface UpdateTransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  paymentMethod?: PaymentMethod;
  category?: Category;
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
    category: input.category,
    date: input.date,
  });
}

export async function getTransactionsService(
  userId: string,
  filters: TransactionFilters = {}
): Promise<{
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
}> {
  const transactions = await findTransactionsByUserId(userId, filters);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return { transactions, balance, totalIncome, totalExpense };
}

export async function updateTransactionService(
  id: string,
  userId: string,
  input: UpdateTransactionInput
): Promise<Transaction | null> {
  const existing = await findTransactionByIdAndUser(id, userId);
  if (!existing) return null;

  return updateTransaction(id, userId, {
    type: input.type,
    amount: input.amount,
    description: input.description.trim(),
    payment_method: input.paymentMethod ?? null,
    category: input.category ?? "outros",
    date: input.date,
  });
}

export async function deleteTransactionService(
  id: string,
  userId: string
): Promise<boolean> {
  return deleteTransaction(id, userId);
}
