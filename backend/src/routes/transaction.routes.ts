import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createTransaction, getTransactions } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transactions", authenticate, createTransaction);
router.get("/transactions", authenticate, getTransactions);

export default router;