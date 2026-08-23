# FINANCE

Sistema de controle financeiro pessoal. Permite registrar entradas e saídas, escolher forma de pagamento e acompanhar o saldo ao longo do tempo.

## Stack

**Backend:** Node.js, TypeScript, Express, PostgreSQL (Neon), Effect.ts  
**Frontend:** HTML, Sass, TypeScript  
**Testes:** Vitest  
**Versionamento:** Git, GitHub

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Registro de entradas de dinheiro (valor, descrição, data)
- Registro de saídas (valor, descrição, data, forma de pagamento)
- Histórico de transações com saldo calculado
- Cada usuário vê apenas seus próprios dados

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Conta gratuita no [Neon](https://neon.tech) para o banco de dados

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com sua DATABASE_URL do Neon e um JWT_SECRET de sua escolha
npm run dev
```

### Banco de dados

No painel do Neon, abra o SQL Editor e execute o conteúdo de `backend/src/database/schema.sql`.

### Frontend

```bash
cd frontend
npm install
npm run build
npx serve public -p 3000
```

Acesse `http://localhost:3000`.

## Testes

```bash
cd backend
npm test
```

17 testes cobrindo validações e lógica de autenticação com Effect.ts.


## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (padrão: 3001) |
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Chave para assinar os tokens JWT |

![Tests](https://img.shields.io/badge/tests-17%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node.js-20%2B-green)