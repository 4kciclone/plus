import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import planRoutes from "./routes/plans";
import subscriptionRoutes from "./routes/subscriptions";
import ticketRoutes from "./routes/tickets";
import invoiceRoutes from "./routes/invoices";
import speedtestRoutes from "./routes/speedtest";
import chatRoutes from "./routes/chat";
import adminRoutes from "./routes/admin";
import employeeRoutes from "./routes/employee";

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.raw({ type: "application/octet-stream", limit: "100mb" }));

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Plus Internet API", version: "1.0.0" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/plans", planRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/tickets", ticketRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/speedtest", speedtestRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Plus Internet API rodando na porta ${PORT}`);
  console.log(`📡 Banco de dados: SQLite (./prisma/dev.db)`);
  console.log(`🔐 JWT configurado`);
  console.log(`📶 Speed Test disponível em /speedtest`);
});
