import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET /plans — list all plans
router.get("/", async (_req: Request, res: Response) => {
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  res.json(plans);
});

// GET /plans/:id
router.get("/:id", async (req: Request, res: Response) => {
  const plan = await prisma.plan.findUnique({ where: { id: req.params.id as string } });
  if (!plan) {
    res.status(404).json({ error: "Plano não encontrado." });
    return;
  }
  res.json(plan);
});

export default router;
