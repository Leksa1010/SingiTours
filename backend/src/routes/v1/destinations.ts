import { Router } from "express";
import { body, param } from "express-validator";

import requireAuth from "@/middleware/requireAuth";
import requireRole from "@/middleware/requireRole";
import validationError from "@/middleware/validationError";

import {
    createDestination, listDestinations, getDestination, updateDestination, deleteDestination
} from "@/controllers/v1/destinations";

const router = Router();

router.get("/", listDestinations);
router.get("/:id", param("id").isMongoId(), validationError, getDestination);

router.post(
    "/",
    requireAuth,
    requireRole("operator"),
    body("name").notEmpty().isString().trim().isLength({ max: 80 }),
    body("country").optional().isString().trim().isLength({ max: 80 }),
    body("description").optional().isString().trim().isLength({ max: 1000 }),
    validationError,
    createDestination
);

router.patch(
    "/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId(),
    body("name").optional().isString().trim().isLength({ max: 80 }),
    body("country").optional().isString().trim().isLength({ max: 80 }),
    body("description").optional().isString().trim().isLength({ max: 1000 }),
    validationError,
    updateDestination
);

router.delete(
    "/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId(),
    validationError,
    deleteDestination
);

export default router;
