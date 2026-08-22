import { CreateTransactionDTO, Transaction, TransactionType, PaymentMethod } from "../models/transaction.model.js";
import { createTransaction } from "../repositories/transaction.repository.js";

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
  if (input.amount <= 0) {
    throw new Error("O valor deve ser maior que zero.");
  }

  if (!input.description.trim()) {
    throw new Error("A descrição não pode estar vazia.");
  }

  if (input.type === "expense" && !input.paymentMethod) {
    throw new Error("Forma de pagamento é obrigatória para saídas.");
  }

  return createTransaction({
    user_id: input.userId,
    type: input.type,
    amount: input.amount,
    description: input.description.trim(),
    payment_method: input.paymentMethod,
    date: input.date,
  });
}