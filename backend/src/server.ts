import "dotenv/config";
import express, { Application } from "express";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import pool from "./config/database.js";

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares globais
app.use(express.json());

// Rotas
app.use(healthRouter);
    app.use(authRouter);

// Testar conexão com o banco
pool.query("SELECT NOW()").then((result) => {
  console.log("Banco de dados conectado:", result.rows[0].now);
}).catch((err) => {
  console.error("Erro ao conectar ao banco:", err.message);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor FINANCE rodando em http://localhost:${PORT}`);
});
