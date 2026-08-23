import { Response } from "express";
import { AuthenticatedRequest } from "../models/auth.model.js";
import { createTransactionService, getTransactionsService } from "../services/transaction.service.js";
import { TransactionType, PaymentMethod } from "../models/transaction.model.js";
import { validateTransaction } from "../utils/validation.js";

export async function createTransaction(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  const validation = validateTransaction(req.body);

  if (!validation.valid) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const { type, amount, description, paymentMethod, date } = req.body;

  try {
    const transaction = await createTransactionService({
      userId,
      type: type as TransactionType,
      amount: Number(amount),
      description,
      paymentMethod: paymentMethod as PaymentMethod | undefined,
      date,
    });

    res.status(201).json({ message: "Transação registrada com sucesso.", transaction });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

export async function getTransactions(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  try {
    const data = await getTransactionsService(userId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}