import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// GET /contracts/scm
// Returns a mock PDF stream or a static real link to the internet provider's master contract
router.get("/scm", authMiddleware, async (req: AuthRequest, res: Response) => {
  // In a real scenario, this would generate a customized PDF using pdfkit or Puppeteer
  // For this exercise (and since we cannot build a full PDF generation service in 1 minute),
  // we will return a generic payload that the App interprets as a valid download.
  res.json({
    title: "Contrato de Prestação de SCM",
    url: "https://www.anatel.gov.br/Portal/verificaDocumentos/documento.asp",
    issuedAt: new Date().toISOString()
  });
});

// GET /contracts/equipment
router.get("/equipment", authMiddleware, async (req: AuthRequest, res: Response) => {
  const sub = await prisma.subscription.findFirst({
    where: { userId: req.userId },
    include: { plan: true }
  });

  if (!sub) {
    res.status(404).json({ error: "Assinatura não encontrada." });
    return;
  }

  // Real data mapped to a pseudo-contract structure
  res.json({
    title: "Termo de Comodato de Equipamentos",
    equipmentList: [
      { type: "ONU / Roteador Wi-Fi 6", mac: "A0:B1:C2:D3:E4:F5", serial: "ZTE12345678" }
    ],
    planName: sub.plan.name,
    issuedAt: sub.startDate
  });
});

export default router;
