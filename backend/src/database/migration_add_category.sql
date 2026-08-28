-- Migração: adiciona suporte a categorias nas transações.
-- Execute no SQL Editor do Neon (ou em qualquer PostgreSQL).

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS category VARCHAR(30) NOT NULL DEFAULT 'outros' CHECK (
    category IN (
      'alimentacao', 'moradia', 'transporte', 'lazer',
      'saude', 'educacao', 'salario', 'outros'
    )
  );
