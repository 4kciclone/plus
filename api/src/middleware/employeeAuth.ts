import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "plus-super-secret-key";

export interface EmployeeAuthRequest extends Request {
  employeeId?: string;
  role?: string;
}

export const employeeAuthMiddleware = (allowedRoles: string[]) => {
  return async (req: EmployeeAuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };

      if (!allowedRoles.includes("ANY") && !allowedRoles.includes(decoded.role) && decoded.role !== "ADMIN") {
        res.status(403).json({ error: "Acesso negado. Seu perfil não tem permissão para esta área." });
        return;
      }

      req.employeeId = decoded.id;
      req.role = decoded.role;
      next();
    } catch (err) {
      res.status(401).json({ error: "Token de funcionário inválido ou expirado." });
    }
  };
};
