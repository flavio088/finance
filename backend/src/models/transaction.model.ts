export type TransactionType = "income" | "expense";
export type PaymentMethod = "debit" | "credit" | "pix" | "cash";
export type Category =
  | "alimentacao"
  | "moradia"
  | "transporte"
  | "lazer"
  | "saude"
  | "educacao"
  | "salario"
  | "outros";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method: PaymentMethod | null;
  category: Category;
  date: string;
  created_at: Date;
}

export interface CreateTransactionDTO {
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method?: PaymentMethod;
  category?: Category;
  date: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  category?: Category;
  q?: string;
  startDate?: string;
  endDate?: string;
}
