import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../models/auth.model.js";

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: "Erro de configuração do servidor." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string };
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
}