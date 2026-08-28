import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transactions", authenticate, createTransaction);
router.get("/transactions", authenticate, getTransactions);
router.put("/transactions/:id", authenticate, updateTransaction);
router.delete("/transactions/:id", authenticate, deleteTransaction);

export default router;
