import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";
import { loginUserEffect } from "../services/auth.effect.js";
import { validateRegister, validateLogin } from "../utils/validation.js";
import { Effect } from "effect";
import { InvalidCredentialsError } from "../models/errors.model.js";

export async function register(req: Request, res: Response): Promise<void> {
  const validation = validateRegister(req.body);

  if (!validation.valid) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const { name, email, password } = req.body;

  try {
    const user = await registerUser({ name, email, password });
    res.status(201).json({ message: "Usuário criado com sucesso.", user });
  } catch (err) {
    if (err instanceof Error && err.message === "E-mail já cadastrado.") {
      res.status(409).json({ errors: [{ field: "email", message: err.message }] });
      return;
    }
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const validation = validateLogin(req.body);

  if (!validation.valid) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const { email, password } = req.body;

  const result = await Effect.runPromise(
    Effect.either(loginUserEffect(email, password))
  );

  if (result._tag === "Left") {
    const error = result.left;

    if (error._tag === "InvalidCredentialsError") {
      res.status(401).json({ error: error.message });
      return;
    }

    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
    return;
  }

  res.status(200).json(result.right);
}