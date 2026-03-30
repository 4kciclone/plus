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
import wifiRoutes from "./routes/wifi";
import notificationsRoutes from "./routes/notifications";
import contractsRoutes from "./routes/contracts";

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
app.use("/wifi", wifiRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/contracts", contractsRoutes);

// Temporarily injecting a seed endpoint to populate the DB with all plans
app.get("/seed", async (_req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Check if seeded
    const count = await prisma.plan.count();
    if (count > 0) {
      res.json({ message: "Plano já foram cadastrados.", count });
      return;
    }

    const plans = [
      { name: "100 Mega", price: 79.9, category: "Residencial", speed: "100", popular: false, features: "100% Fibra Óptica, Download Ilimitado" },
      { name: "500 Mega", price: 109.9, category: "Residencial", speed: "500", popular: true, features: "100% Fibra Óptica, Ideal para Família" },
      { name: "800 Mega", price: 159.9, category: "Residencial", speed: "800", popular: false, features: "100% Fibra Óptica, Ideal para Games" },
      { name: "1 Giga", price: 199.9, category: "Residencial", speed: "1G", popular: false, features: "100% Fibra Óptica, Ultra Velocidade" },
      { name: "100 Mega", price: 119.9, category: "Comercial", speed: "100", popular: false, features: "100% Fibra Óptica, Estabilidade Corporativa" },
      { name: "300 Mega", price: 149.9, category: "Comercial", speed: "300", popular: false, features: "100% Fibra Óptica, Alta Disponibilidade" },
      { name: "500 Mega", price: 169.9, category: "Comercial", speed: "500", popular: true, features: "100% Fibra Óptica, Suporte Empresarial Rápido" },
      { name: "50 Mega + IP Válido", price: 239.9, category: "Comercial", speed: "50", popular: false, features: "IP Fixo Válido, Rotas Dedicadas" },
      { name: "100 Mega + Streaming", price: 99.9, category: "Combo", speed: "100", popular: false, features: "Paramount+, 3 meses de Deezer" },
      { name: "500 Mega + Paramount", price: 129.9, category: "Combo", speed: "500", popular: true, features: "Paramount+, Deezer" },
      { name: "500 Mega + Max", price: 129.9, category: "Combo", speed: "500", popular: false, features: "Max Incluso, 100% Fibra Óptica" },
      { name: "1 Giga + Completo", price: 199.9, category: "Combo", speed: "1G", popular: false, features: "Paramount+, Deezer, Max, Ultra Velocidade" },
      { name: "TV + Streaming", price: 49.9, category: "Internet + TV", speed: "", popular: false, features: "Plataforma de Canais, Conteúdo On-Demand" },
      { name: "Combo 150 Mega + TV", price: 99.9, category: "Internet + TV", speed: "150", popular: true, features: "Internet Fibra 150 Mega, Plataforma de TV" },
      { name: "Rural 200 Mega + TV", price: 129.9, category: "Internet + TV", speed: "200", popular: false, features: "Internet Rural 200 Mega, Plataforma de TV" }
    ];

    let inserted = 0;
    for (const p of plans) {
      await prisma.plan.create({ data: p });
      inserted++;
    }
    
    res.json({ message: "Planos semeados no Banco de Dados com Sucesso!", inserted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
