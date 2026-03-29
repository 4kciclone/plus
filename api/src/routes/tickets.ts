import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /tickets — open a support ticket
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    subject: z.string().min(5),
    message: z.string().min(10),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { subject, message } = result.data;

  const ticket = await prisma.ticket.create({
    data: { userId: req.userId as string, subject, message, status: "OPEN" },
  });

  // Notify company
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  console.log(`[NOTIFICAÇÃO] Novo chamado aberto por ${user?.name}: "${subject}" - Status: ABERTO`);

  res.status(201).json(ticket);
});

// GET /tickets/my — My tickets
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(tickets);
});

// GET /tickets/:id — Get a specific ticket
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const ticket = await prisma.ticket.findFirst({
    where: { id: req.params.id as string, userId: req.userId as string },
  });
  if (!ticket) {
    res.status(404).json({ error: "Chamado não encontrado." });
    return;
  }
  res.json(ticket);
});

// PATCH /tickets/:id/close — Close a ticket
router.patch("/:id/close", authMiddleware, async (req: AuthRequest, res: Response) => {
  const ticket = await prisma.ticket.findFirst({
    where: { id: req.params.id as string, userId: req.userId as string },
  });
  if (!ticket) {
    res.status(404).json({ error: "Chamado não encontrado." });
    return;
  }

  const updated = await prisma.ticket.update({
    where: { id: req.params.id as string },
    data: { status: "RESOLVED" },
  });
  res.json(updated);
});

// PUT /tickets/:id/visit - Customer chooses a technical visit slot
router.put("/:id/visit", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { visitScheduled } = req.body;

  const ticket = await prisma.ticket.findFirst({
    where: { id: req.params.id as string, userId: req.userId as string }
  });
  if (!ticket) {
    res.status(404).json({ error: "Chamado não encontrado." });
    return;
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: req.params.id as string },
    data: { status: "SCHEDULED", visitScheduled: String(visitScheduled) },
  });

  console.log(`\n[AGENDA] MOCK: Sistema Operacional: Visita técnica agendada para o cliente no chamado ${id} para o horário: ${visitScheduled}`);

  res.json(updatedTicket);
});

export default router;
