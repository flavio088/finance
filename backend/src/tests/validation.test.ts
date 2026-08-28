import { describe, it, expect } from "vitest";
import {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateTransactionFilters,
} from "../utils/validation.js";

describe("validateRegister", () => {
  it("deve retornar válido quando os dados estão corretos", () => {
    const result = validateRegister({
      name: "Flávio",
      email: "flavio@email.com",
      password: "123456",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("deve rejeitar nome muito curto", () => {
    const result = validateRegister({
      name: "F",
      email: "flavio@email.com",
      password: "123456",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "name")).toBe(true);
  });

  it("deve rejeitar email inválido", () => {
    const result = validateRegister({
      name: "Flávio",
      email: "email-invalido",
      password: "123456",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "email")).toBe(true);
  });

  it("deve rejeitar senha muito curta", () => {
    const result = validateRegister({
      name: "Flávio",
      email: "flavio@email.com",
      password: "123",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "password")).toBe(true);
  });

  it("deve retornar múltiplos erros quando vários campos são inválidos", () => {
    const result = validateRegister({
      name: "",
      email: "",
      password: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe("validateLogin", () => {
  it("deve retornar válido quando os dados estão corretos", () => {
    const result = validateLogin({
      email: "flavio@email.com",
      password: "123456",
    });
    expect(result.valid).toBe(true);
  });

  it("deve rejeitar email inválido", () => {
    const result = validateLogin({
      email: "nao-e-email",
      password: "123456",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "email")).toBe(true);
  });

  it("deve rejeitar senha vazia", () => {
    const result = validateLogin({
      email: "flavio@email.com",
      password: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "password")).toBe(true);
  });
});

describe("validateTransaction", () => {
  it("deve retornar válido para uma entrada correta", () => {
    const result = validateTransaction({
      type: "income",
      amount: 1000,
      description: "Salário",
      date: "2026-08-23",
    });
    expect(result.valid).toBe(true);
  });

  it("deve retornar válido para uma saída com forma de pagamento", () => {
    const result = validateTransaction({
      type: "expense",
      amount: 500,
      description: "Supermercado",
      date: "2026-08-23",
      paymentMethod: "pix",
    });
    expect(result.valid).toBe(true);
  });

  it("deve rejeitar valor zero", () => {
    const result = validateTransaction({
      type: "income",
      amount: 0,
      description: "Salário",
      date: "2026-08-23",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "amount")).toBe(true);
  });

  it("deve rejeitar valor negativo", () => {
    const result = validateTransaction({
      type: "income",
      amount: -100,
      description: "Salário",
      date: "2026-08-23",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "amount")).toBe(true);
  });

  it("deve rejeitar saída sem forma de pagamento", () => {
    const result = validateTransaction({
      type: "expense",
      amount: 500,
      description: "Supermercado",
      date: "2026-08-23",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "paymentMethod")).toBe(true);
  });

  it("deve rejeitar tipo inválido", () => {
    const result = validateTransaction({
      type: "invalido",
      amount: 500,
      description: "Teste",
      date: "2026-08-23",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "type")).toBe(true);
  });

  it("deve aceitar categoria válida", () => {
    const result = validateTransaction({
      type: "expense",
      amount: 500,
      description: "Supermercado",
      date: "2026-08-23",
      paymentMethod: "pix",
      category: "alimentacao",
    });
    expect(result.valid).toBe(true);
  });

  it("deve rejeitar categoria inválida", () => {
    const result = validateTransaction({
      type: "income",
      amount: 500,
      description: "Salário",
      date: "2026-08-23",
      category: "nao-existe",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "category")).toBe(true);
  });
});

describe("validateTransactionFilters", () => {
  it("deve retornar válido para filtros vazios", () => {
    const result = validateTransactionFilters({});
    expect(result.valid).toBe(true);
  });

  it("deve aceitar filtros válidos", () => {
    const result = validateTransactionFilters({
      type: "income",
      paymentMethod: "pix",
      category: "alimentacao",
      q: "mercado",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    });
    expect(result.valid).toBe(true);
  });

  it("deve rejeitar tipo de filtro inválido", () => {
    const result = validateTransactionFilters({ type: "invalido" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "type")).toBe(true);
  });

  it("deve rejeitar categoria de filtro inválida", () => {
    const result = validateTransactionFilters({ category: "invalida" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "category")).toBe(true);
  });

  it("deve aceitar strings vazias como sem filtro", () => {
    const result = validateTransactionFilters({ type: "", category: "" });
    expect(result.valid).toBe(true);
  });
});