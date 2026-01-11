import type { Request, Response, NextFunction } from "express";

const requireRole = (role: "operator" | "traveller") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ code: "Authentication Error", message: "Not authenticated" });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ code: "Authorization Error", message: "Insufficient privileges" });
            return;
        }
        next();
    };
};

export default requireRole;
