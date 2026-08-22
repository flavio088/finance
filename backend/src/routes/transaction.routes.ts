import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transactions", authenticate, createTransaction);

export default router;