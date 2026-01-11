import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import config from "@/config";
import User from "@/models/user";

type JwtPayload = {
    sub: string;
    iat: number;
    exp: number;
};

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; role: "operator" | "traveller" };
        }
    }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.accessToken;

    if (!token) {
        res.status(401).json({ code: "Authentication Error", message: "Missing access token" });
        return;
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
        res.status(401).json({ code: "Authentication Error", message: "Invalid or expired token" });
        return;
    }

    const user = await User.findById(decoded.sub).select("role").lean().exec();
    if (!user) {
        res.status(401).json({ code: "Authentication Error", message: "Invalid token user" });
        return;
    }

    req.user = { id: decoded.sub, role: user.role };
    next();
};

export default requireAuth;
