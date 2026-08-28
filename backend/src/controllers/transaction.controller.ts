import { Response } from "express";
import { AuthenticatedRequest } from "../models/auth.model.js";
import {
  createTransactionService,
  getTransactionsService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transaction.service.js";
import { TransactionType, PaymentMethod, Category } from "../models/transaction.model.js";
import {
  validateTransaction,
  validateTransactionFilters,
} from "../utils/validation.js";

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

  const { type, amount, description, paymentMethod, category, date } = req.body;

  try {
    const transaction = await createTransactionService({
      userId,
      type: type as TransactionType,
      amount: Number(amount),
      description,
      paymentMethod: paymentMethod as PaymentMethod | undefined,
      category: category as Category | undefined,
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

  const validation = validateTransactionFilters(req.query);

  if (!validation.valid) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const filters = {
    type: req.query.type as TransactionType | undefined,
    paymentMethod: req.query.paymentMethod as PaymentMethod | undefined,
    category: req.query.category as Category | undefined,
    q: typeof req.query.q === "string" ? req.query.q : undefined,
    startDate: typeof req.query.startDate === "string" ? req.query.startDate : undefined,
    endDate: typeof req.query.endDate === "string" ? req.query.endDate : undefined,
  };

  try {
    const data = await getTransactionsService(userId, filters);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

export async function updateTransaction(
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

  const { type, amount, description, paymentMethod, category, date } = req.body;

  try {
    const transaction = await updateTransactionService(String(req.params.id), userId, {
      type: type as TransactionType,
      amount: Number(amount),
      description,
      paymentMethod: paymentMethod as PaymentMethod | undefined,
      category: category as Category | undefined,
      date,
    });

    if (!transaction) {
      res.status(404).json({ error: "Transação não encontrada." });
      return;
    }

    res.status(200).json({ message: "Transação atualizada com sucesso.", transaction });
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

export async function deleteTransaction(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  try {
    const deleted = await deleteTransactionService(String(req.params.id), userId);

    if (!deleted) {
      res.status(404).json({ error: "Transação não encontrada." });
      return;
    }

    res.status(200).json({ message: "Transação excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir transação:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}
