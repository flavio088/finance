export type TransactionType = "income" | "expense";
export type PaymentMethod = "debit" | "credit" | "pix" | "cash";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method: PaymentMethod | null;
  date: string;
  created_at: Date;
}

export interface CreateTransactionDTO {
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  payment_method?: PaymentMethod;
  date: string;
}