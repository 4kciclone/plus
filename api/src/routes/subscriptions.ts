import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /subscriptions — subscribe to a plan with address + payment info
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    planId: z.string().uuid(),
    cep: z.string().min(8).max(10),
    houseNumber: z.string().min(1),
    reference: z.string().optional(),
    paymentMethod: z.enum(["PIX", "BOLETO"]),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { planId, cep, houseNumber, reference, paymentMethod } = result.data;
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    res.status(404).json({ error: "Plano não encontrado." });
    return;
  }

  // Cancel any existing active subscription
  await prisma.subscription.updateMany({
    where: { userId: req.userId, status: { in: ["ACTIVE", "PENDING_INSTALL"] } },
    data: { status: "CANCELLED" },
  });

  const subscription = await prisma.subscription.create({
    data: {
      userId: req.userId as string,
      planId,
      cep,
      houseNumber,
      reference: reference || null,
      paymentMethod,
      status: "PENDING_INSTALL", // awaiting team to schedule installation
      installationDate: null,
      installationTime: null,
    },
    include: { plan: true },
  });

  // Generate first invoice
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  const pixCode = paymentMethod === "PIX"
    ? `00020126580014BR.GOV.BCB.PIX0136plus-internet@pix.com.br5204000053039865802BR5925PLUS MULTIPLAYER INTERNET6009Valenca62070503***6304${Math.random().toString(16).slice(2, 6).toUpperCase()}`
    : null;

  await prisma.invoice.create({
    data: {
      userId: req.userId as string,
      amount: plan.price,
      dueDate,
      pixCode,
      status: "PENDING",
    },
  });

  // Notify company
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[NOVA ASSINATURA]`);
  console.log(`  Cliente: ${user?.name} (${user?.email})`);
  console.log(`  Plano: ${plan.name} — R$ ${plan.price.toFixed(2)}/mês`);
  console.log(`  Endereço: CEP ${cep}, nº ${houseNumber}${reference ? ` (Ref: ${reference})` : ""}`);
  console.log(`  Pagamento: ${paymentMethod}`);
  console.log(`  Status: AGUARDANDO INSTALAÇÃO`);
  console.log(`  → Equipe precisa agendar data de instalação`);
  console.log(`${"=".repeat(60)}\n`);

  res.status(201).json(subscription);
});

// GET /subscriptions/my — My subscriptions
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.userId },
    include: { plan: true },
    orderBy: { startDate: "desc" },
  });
  res.json(subscriptions);
});

// PUT /subscriptions/:id/schedule — Client picks an installation slot
router.put("/:id/schedule", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { chosenSlot } = req.body;

  if (!chosenSlot) {
    res.status(400).json({ error: "Slot não informado." });
    return;
  }

  try {
    // Parse the chosen slot: "09/04 09h-12h" -> date + time range
    const parts = (chosenSlot as string).split(" ");
    const datePart = parts[0]; // "09/04"
    const timePart = parts[1] || ""; // "09h-12h"

    const updated = await prisma.subscription.update({
      where: { id: id as string },
      data: {
        status: "SCHEDULED",
        installationTime: chosenSlot as string,
      },
    });
    res.json({ success: true, subscription: updated });
  } catch (err: any) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Erro ao agendar instalação." });
  }
});

export default router;
