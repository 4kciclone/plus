import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /notifications
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  // Fetch specific user notifications AND global broadcast notifications (where userId is null)
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: req.userId },
        { userId: null }
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  res.json(notifications);
});

// PATCH /notifications/:id/read
router.patch("/:id/read", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const notification = await prisma.notification.findUnique({ where: { id: id as string } });
  if (!notification) {
    res.status(404).json({ error: "Notificação não encontrada" });
    return;
  }

  // Allow marking read if it belongs to user OR if it's a global notification
  if (notification.userId !== req.userId && notification.userId !== null) {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  await prisma.notification.update({
    where: { id: id as string },
    data: { read: true }
  });

  res.json({ success: true });
});

export default router;
