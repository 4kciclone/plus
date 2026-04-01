import { Router, Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { employeeAuthMiddleware, EmployeeAuthRequest } from "../middleware/employeeAuth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "plus-super-secret-key";

// --- AUTH ---
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Hack for demo since we haven't built a UI to register employees yet
  if (email === "admin@plusinternet.com.br" && password === "admin123") {
    let employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      employee = await prisma.employee.create({
        data: { name: "Super Admin", email, password: await bcrypt.hash(password, 10), role: "ADMIN" }
      });
    }
    
    const token = jwt.sign({ id: employee.id, role: employee.role }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: { name: employee.name, email: employee.email, role: employee.role } });
    return;
  }

  const employee = await prisma.employee.findUnique({ where: { email } });
  if (!employee || !(await bcrypt.compare(password, employee.password))) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ id: employee.id, role: employee.role }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, user: { name: employee.name, email: employee.email, role: employee.role } });
});


// --- EMPLOYEE CRUD ---
router.get("/employees", employeeAuthMiddleware(["ADMIN", "SUPPORT"]), async (req: EmployeeAuthRequest, res: Response) => {
  const employees = await prisma.employee.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: "asc" }
  });
  res.json(employees);
});

router.post("/employees", employeeAuthMiddleware(["ADMIN"]), async (req: EmployeeAuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400).json({ error: "Campos obrigatórios: name, email, password, role" });
    return;
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.status(201).json(employee);
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: "Email já cadastrado." });
    } else {
      res.status(500).json({ error: "Erro ao cadastrar funcionário." });
    }
  }
});


// --- CRM MODULE ---
router.get("/crm", employeeAuthMiddleware(["ADMIN", "SUPPORT", "FINANCE"]), async (req: EmployeeAuthRequest, res: Response) => {
  try {
    // Avoid deeply nested Prisma includes which deadlock PgBouncer on Neon Free Tier
    const users = await prisma.user.findMany({
      include: { subscriptions: true },
    });
    
    const plans = await prisma.plan.findMany();
    const planMap = Object.fromEntries(plans.map(p => [p.id, p]));

    const usersData = users.map(u => ({
      ...u,
      subscriptions: u.subscriptions.map(s => ({
        ...s,
        plan: planMap[s.planId] || null,
        cancellation: null
      }))
    }));

    res.json(usersData);
  } catch (err: any) {
    console.error("CRM Endpoint Fatal Error:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.put("/subscriptions/:id", employeeAuthMiddleware(["ADMIN", "SUPPORT", "TECH"]), async (req: EmployeeAuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, installationDate, installationOptions } = req.body;
  
  try {
    const data: any = {};
    if (status) data.status = status;
    if (installationDate) data.installationDate = new Date(installationDate as string);
    if (installationOptions) {
      data.installationOptions = typeof installationOptions === 'string' ? installationOptions : JSON.stringify(installationOptions);
      data.status = 'AWAITING_SCHEDULE';
    }
    // Tech assignment
    const { assignedTechId, assignedTechName } = req.body;
    if (assignedTechId) data.assignedTechId = assignedTechId;
    if (assignedTechName) data.assignedTechName = assignedTechName;

    const updated = await prisma.subscription.update({
      where: { id: id as string },
      data
    });
    res.json({ success: true, subscription: updated, message: "Atualizado com sucesso." });
  } catch (err: any) {
    console.error("PUT /subscriptions/:id error:", err);
    res.status(500).json({ error: "Erro ao atualizar assinatura." });
  }
});

router.post("/cancellations", employeeAuthMiddleware(["ADMIN", "SUPPORT"]), async (req: EmployeeAuthRequest, res: Response) => {
  const { subscriptionId, reason } = req.body;
  
  // Create cancellation, calculate fake fine
  const fine = Math.floor(Math.random() * 300) + 100;
  
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "CANCELLED" }
  });

  const cancellation = await prisma.cancellation.create({
    data: { subscriptionId, reason, fineAmount: fine }
  });
  
  res.json({ success: true, cancellation, message: "Regra de bloqueio no MikroTik disparada (Mock)." });
});


// --- TICKETING MODULE (Kanban) ---
router.get("/tickets", employeeAuthMiddleware(["ADMIN", "SUPPORT", "TECH"]), async (req: EmployeeAuthRequest, res: Response) => {
  const tickets = await prisma.ticket.findMany({
    include: { user: { select: { name: true, address: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(tickets);
});


// --- FINANCE MODULE ---
router.get("/finance", employeeAuthMiddleware(["ADMIN", "FINANCE"]), async (req: EmployeeAuthRequest, res: Response) => {
  const invoices = await prisma.invoice.findMany({
    include: { user: { select: { name: true, cpf: true } } },
    orderBy: { dueDate: "asc" }
  });
  res.json(invoices);
});

export default router;
