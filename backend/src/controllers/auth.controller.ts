import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." });
    return;
  }

  try {
    const user = await registerUser({ name, email, password });
    res.status(201).json({ message: "Usuário criado com sucesso.", user });
  } catch (err) {
    if (err instanceof Error && err.message === "E-mail já cadastrado.") {
      res.status(409).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}