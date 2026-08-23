# FINANCE — Planejamento do produto

Este documento registra o planejamento feito antes do desenvolvimento do FINANCE.

---

## Visão do produto

Um sistema simples de controle financeiro pessoal que qualquer pessoa possa usar para acompanhar para onde vai o dinheiro.

A ideia veio da dificuldade de entender o próprio saldo ao final do mês — planilhas são trabalhosas, aplicativos de banco não mostram uma visão consolidada, e anotar no papel não escala. O FINANCE resolve isso com uma interface limpa e registro rápido de transações.

---

## Problema que resolve

Pessoas que não conseguem visualizar claramente suas finanças pessoais ao longo do mês. O sistema precisa responder a uma pergunta simples: **quanto tenho, quanto entrou e quanto saiu?**

---

## Público-alvo

Qualquer pessoa que queira ter controle básico das próprias finanças sem depender de um banco específico ou de planilhas.

---

## Objetivos

- Permitir o registro rápido de entradas e saídas
- Mostrar o saldo atual de forma clara
- Guardar o histórico de transações
- Funcionar para múltiplos usuários com dados isolados

---

## Requisitos

### Funcionais

- Cadastro e login de usuário
- Registro de entrada: valor, descrição, data
- Registro de saída: valor, descrição, data, forma de pagamento (débito, crédito, PIX, dinheiro)
- Listagem de transações com filtro por tipo
- Cálculo de saldo (entradas - saídas)
- Dados por usuário — um usuário não acessa dados de outro

### Não funcionais

- Senhas armazenadas com hash (bcrypt)
- Autenticação via JWT
- Banco de dados persistente (PostgreSQL)
- Código TypeScript tipado no frontend e backend

---

## Épicos

| # | Épico |
|---|-------|
| E1 | Autenticação — cadastro, login, proteção de rotas |
| E2 | Entradas — registro e listagem |
| E3 | Saídas — registro com forma de pagamento |
| E4 | Histórico — visão consolidada com saldo |

---

## User Stories

**E1 — Autenticação**

- Como usuário, quero criar uma conta com nome, email e senha para acessar o sistema.
- Como usuário, quero fazer login com meu email e senha para acessar minhas finanças.
- Como usuário, quero que minha sessão persista para não precisar fazer login toda vez.

**E2 — Entradas**

- Como usuário, quero registrar uma entrada informando valor, descrição e data.
- Como usuário, quero que a entrada fique salva e não desapareça quando eu fechar o navegador.

**E3 — Saídas**

- Como usuário, quero registrar uma saída informando valor, descrição, data e forma de pagamento.
- Como usuário, quero escolher entre débito, crédito, PIX e dinheiro como forma de pagamento.

**E4 — Histórico**

- Como usuário, quero ver todas as minhas transações em ordem cronológica.
- Como usuário, quero ver meu saldo atual, total de entradas e total de saídas.

---

## Product Backlog

| Prioridade | Item | Épico |
|-----------|------|-------|
| Alta | Cadastro de usuário | E1 |
| Alta | Login com JWT | E1 |
| Alta | Middleware de autenticação | E1 |
| Alta | Registro de entradas | E2 |
| Alta | Registro de saídas | E3 |
| Alta | Histórico e saldo | E4 |
| Média | Validações centralizadas | E1/E2/E3 |
| Média | Testes automatizados | — |
| Média | Effect.ts na autenticação | E1 |
| Baixa | Documentação | — |

---

## Sprints

**Sprint 1 — Fundação**  
Estrutura do projeto, configuração de ferramentas, tela de login, servidor Express, banco de dados.

**Sprint 2 — Autenticação**  
Cadastro de usuários, login com JWT, middleware de proteção de rotas.

**Sprint 3 — Transações**  
Registro de entradas e saídas, API de transações, dashboard.

**Sprint 4 — Histórico e qualidade**  
Tela de histórico, cálculo de saldo, Effect.ts, testes, validações, revisão de arquitetura.

**Sprint 5 — Finalização**  
Configuração para outras máquinas, documentação, revisão para portfólio.

---

## Critérios de aceitação

- O usuário consegue criar conta, fazer login e acessar o dashboard
- Entradas e saídas são salvas no banco e persistem após reiniciar o servidor
- O histórico exibe todas as transações do usuário com saldo correto
- Um usuário não consegue acessar dados de outro usuário
- Senhas são armazenadas como hash — nunca em texto puro
- O projeto roda em qualquer máquina seguindo as instruções do README

---

## Definition of Done

Uma funcionalidade está pronta quando:

- O código está no repositório com commit descritivo
- A funcionalidade funciona end-to-end (frontend → backend → banco)
- Não quebra funcionalidades existentes
- Segue a arquitetura em camadas definida no projeto

---

## Roadmap — próximas versões

- Filtro de transações por período
- Categorias para entradas e saídas
- Gráfico de evolução do saldo ao longo do tempo
- Exportação para CSV
- Modo escuro