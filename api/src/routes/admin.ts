import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Middleware to check if user is admin
const requireAdmin = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(403).json({ error: "Usuário não encontrado." });
      return;
    }
    
    // Auto-promote admin@plusinternet.com.br for testing
    if (user.role !== "ADMIN" && user.email !== "admin@plusinternet.com.br") {
      res.status(403).json({ error: "Acesso negado. Apenas administradores." });
      return;
    }
    
    if (user.email === "admin@plusinternet.com.br" && user.role !== "ADMIN") {
      await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar permissões." });
  }
};

// GET /admin/dashboard - Get overall stats
router.get("/dashboard", authMiddleware, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const [totalUsers, totalSubscriptions, newSubscriptions, openTickets] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "PENDING_INSTALL" } }),
    prisma.ticket.count({ where: { status: "OPEN" } }),
  ]);

  res.json({ totalUsers, totalSubscriptions, newSubscriptions, openTickets });
});

// GET /admin/subscriptions - Lists all pending/active installations
router.get("/subscriptions", authMiddleware, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    include: { user: true, plan: true },
    orderBy: { startDate: "desc" },
  });
  res.json(subscriptions);
});

// GET /admin/tickets - List all support tickets
router.get("/tickets", authMiddleware, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(tickets);
});

// PUT /admin/subscriptions/:id - Update status (e.g. mark installed)
router.put("/subscriptions/:id", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, installationDate } = req.body; // status: ACTIVE, CANCELLED

  const sub = await prisma.subscription.update({
    where: { id: String(id) },
    data: { 
      status: String(status), 
      installationDate: installationDate ? new Date(String(installationDate)) : undefined 
    },
  });
  
  // Here we would integrate Idea 4: MikroTik PPPoE enable/disable
  if (status === "ACTIVE") {
    console.log(`\n[MIKROTIK / RADIUS] MOCK: Chamada para Servidor PPPoE: ATIVANDO LOGIN PARA O CLIENTE ${sub.userId}`);
  } else if (status === "CANCELLED") {
    console.log(`\n[MIKROTIK / RADIUS] MOCK: Chamada para Servidor PPPoE: BLOQUEANDO LOGIN PARA O CLIENTE ${sub.userId}`);
  }

  res.json(sub);
});

// PUT /admin/tickets/:id - Resolve or Schedule Ticket
router.put("/tickets/:id", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, visitOptions } = req.body;
  
  const ticket = await prisma.ticket.update({
    where: { id: String(id) },
    data: { 
      status: status ? String(status) : "RESOLVED",
      visitOptions: visitOptions && Array.isArray(visitOptions) ? JSON.stringify(visitOptions) : undefined
    },
    include: { user: true }
  });

  if (status === "WAITING_USER") {
    console.log(`\n[EMAIL] MOCK: Chamada para envio de Email: "Ação Necessária - Escolha o horário da sua Visita Técnica" para ${(ticket as any).user?.email}`);
  }

  res.json(ticket);
});

export default router;
