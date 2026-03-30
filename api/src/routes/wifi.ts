import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// PATCH /wifi
router.patch("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    ssid: z.string().min(3),
    password: z.string().min(8),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { ssid, password } = result.data;

  // Find user's active subscription
  const sub = await prisma.subscription.findFirst({
    where: { userId: req.userId, status: "ACTIVE" },
  });

  if (!sub) {
    res.status(404).json({ error: "Nenhuma assinatura ativa encontrada para gerenciar o Wi-Fi." });
    return;
  }

  // Update Wi-Fi settings in the Database (which would sync to GenieACS in production)
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { wifiSsid: ssid, wifiPassword: password },
  });

  // Simulated TR-069 provisioning delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 1500));

  res.json({ success: true, message: "Parâmetros de Wi-Fi provisionados com sucesso." });
});

// GET /wifi
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const sub = await prisma.subscription.findFirst({
    where: { userId: req.userId, status: "ACTIVE" },
    select: { wifiSsid: true, wifiPassword: true }
  });

  if (!sub) {
    res.status(404).json({ error: "Assinatura não encontrada." });
    return;
  }

  res.json({ ssid: sub.wifiSsid, password: sub.wifiPassword });
});

export default router;
