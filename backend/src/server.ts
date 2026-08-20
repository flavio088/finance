import "dotenv/config";
import express, { Application } from "express";
import healthRouter from "./routes/health.routes.js";

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares globais
app.use(express.json());

// Rotas
app.use(healthRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor FINANCE rodando em http://localhost:${PORT}`);
});