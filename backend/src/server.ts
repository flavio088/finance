import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import pool from "./config/database.js";

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares globais
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(healthRouter);
app.use(authRouter);
app.use(transactionRouter);

pool.query("SELECT NOW()").then((result) => {
  console.log("Banco de dados conectado:", result.rows[0].now);
}).catch((err) => {
  console.error("Erro ao conectar ao banco:", err.message);
});

app.listen(PORT, () => {
  console.log(`Servidor FINANCE rodando em http://localhost:${PORT}`);
});