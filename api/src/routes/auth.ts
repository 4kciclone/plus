import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /auth/register
router.post("/register", async (req, res: Response) => {
  const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    cpf: z.string().min(11).max(14),
    password: z.string().min(6),
    address: z.string().optional(),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { name, email, cpf, password, address } = result.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { cpf }] } });
  if (existing) {
    res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, cpf, password: hashed, address },
  });

  // Notify company (email hook placeholder)
  console.log(`[NOTIFICAÇÃO] Novo cadastro: ${name} <${email}>`);

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// POST /auth/login
router.post("/login", async (req, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "E-mail ou senha inválidos." });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, cpf: true, address: true, role: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado." });
    return;
  }
  res.json(user);
});

// PATCH /auth/password
router.patch("/password", authMiddleware, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { currentPassword, newPassword } = result.data;
  
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    res.status(401).json({ error: "Senha atual incorreta." });
    return;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.userId },
    data: { password: hashed },
  });

  res.json({ success: true, message: "Senha atualizada com sucesso." });
});

export default router;
