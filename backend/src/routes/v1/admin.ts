import { Router } from "express";
import { param } from "express-validator";

import requireAuth from "@/middleware/requireAuth";
import requireRole from "@/middleware/requireRole";
import validationError from "@/middleware/validationError";

import { listTravellers, getTravellerById, deleteTravellerById } from "@/controllers/v1/admin/users";

const router = Router();

router.get("/users", requireAuth, requireRole("operator"), listTravellers);

router.get(
    "/users/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId().withMessage("Invalid user id"),
    validationError,
    getTravellerById
);

router.delete(
    "/users/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId().withMessage("Invalid user id"),
    validationError,
    deleteTravellerById
);

export default router;
