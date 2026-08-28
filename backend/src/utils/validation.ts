export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export const CATEGORIES = [
  "alimentacao",
  "moradia",
  "transporte",
  "lazer",
  "saude",
  "educacao",
  "salario",
  "outros",
] as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRegister(data: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Nome deve ter pelo menos 2 caracteres." });
  }

  if (!data.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Informe um e-mail válido." });
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.push({ field: "password", message: "Senha deve ter pelo menos 6 caracteres." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateLogin(data: {
  email?: unknown;
  password?: unknown;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Informe um e-mail válido." });
  }

  if (!data.password || typeof data.password !== "string" || data.password.trim().length === 0) {
    errors.push({ field: "password", message: "Informe sua senha." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateTransaction(data: {
  type?: unknown;
  amount?: unknown;
  description?: unknown;
  date?: unknown;
  paymentMethod?: unknown;
  category?: unknown;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.type || !["income", "expense"].includes(data.type as string)) {
    errors.push({ field: "type", message: "Tipo deve ser 'income' ou 'expense'." });
  }

  const amount = Number(data.amount);
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.push({ field: "amount", message: "Valor deve ser maior que zero." });
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push({ field: "description", message: "Descrição é obrigatória." });
  }

  if (!data.date || typeof data.date !== "string") {
    errors.push({ field: "date", message: "Data é obrigatória." });
  }

  if (data.type === "expense" && !data.paymentMethod) {
    errors.push({ field: "paymentMethod", message: "Forma de pagamento é obrigatória para saídas." });
  }

  if (
    data.category != null &&
    !CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])
  ) {
    errors.push({ field: "category", message: "Categoria inválida." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateTransactionFilters(data: {
  type?: unknown;
  paymentMethod?: unknown;
  category?: unknown;
  q?: unknown;
  startDate?: unknown;
  endDate?: unknown;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (
    data.type != null &&
    data.type !== "" &&
    !["income", "expense"].includes(data.type as string)
  ) {
    errors.push({ field: "type", message: "Tipo de filtro inválido." });
  }

  if (
    data.paymentMethod != null &&
    data.paymentMethod !== "" &&
    !["debit", "credit", "pix", "cash"].includes(data.paymentMethod as string)
  ) {
    errors.push({ field: "paymentMethod", message: "Forma de pagamento de filtro inválida." });
  }

  if (
    data.category != null &&
    data.category !== "" &&
    !CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])
  ) {
    errors.push({ field: "category", message: "Categoria de filtro inválida." });
  }

  return { valid: errors.length === 0, errors };
}