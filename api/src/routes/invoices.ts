import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /invoices/my — List my invoices
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId: req.userId },
    orderBy: { dueDate: "desc" },
  });
  res.json(invoices);
});

// GET /invoices/:id — Get specific invoice with PIX/boleto
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id as string, userId: req.userId as string },
  });
  if (!invoice) {
    res.status(404).json({ error: "Fatura não encontrada." });
    return;
  }

  // Add mock boleto code on the fly
  const boleto = `23790.00000 00000.000000 00000.000001 ${invoice.id.slice(0, 1).toUpperCase()} 00000000000${Math.round(invoice.amount * 100)}`;

  res.json({ ...invoice, boletoCode: boleto });
});

// POST /invoices/:id/pay — Mark invoice as paid (test/admin use)
router.post("/:id/pay", authMiddleware, async (req: AuthRequest, res: Response) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id as string, userId: req.userId as string },
  });
  if (!invoice) {
    res.status(404).json({ error: "Fatura não encontrada." });
    return;
  }
  if (invoice.status === "PAID") {
    res.status(400).json({ error: "Fatura já foi paga." });
    return;
  }

  const updated = await prisma.invoice.update({
    where: { id: req.params.id as string },
    data: { status: "PAID" },
  });
  res.json(updated);
});

export default router;
