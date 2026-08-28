-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações (entradas e saídas)
CREATE TABLE IF NOT EXISTS transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount          NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description     TEXT NOT NULL,
  payment_method  VARCHAR(20) CHECK (
                    payment_method IN ('debit', 'credit', 'pix', 'cash')
                  ),
  category        VARCHAR(30) NOT NULL DEFAULT 'outros' CHECK (
                    category IN (
                      'alimentacao', 'moradia', 'transporte', 'lazer',
                      'saude', 'educacao', 'salario', 'outros'
                    )
                  ),
  date            DATE NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance nas consultas mais comuns
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);