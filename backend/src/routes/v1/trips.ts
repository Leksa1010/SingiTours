import { Router } from "express";
import { body, param, query } from "express-validator";

import requireAuth from "@/middleware/requireAuth";
import requireRole from "@/middleware/requireRole";
import validationError from "@/middleware/validationError";
import { uploadCover } from "@/middleware/uploadCover";

import {
    listTrips, getTripBySlug, createTrip, updateTrip, deleteTrip
} from "@/controllers/v1/trips";

const router = Router();

// Public
router.get(
    "/",
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    validationError,
    listTrips
);

router.get("/:slug", getTripBySlug);

// Operator CRUD
router.post(
    "/",
    requireAuth,
    requireRole("operator"),
    uploadCover.single("cover"),
    body("title").notEmpty().isString().trim().isLength({ max: 120 }),
    body("destination").notEmpty().isMongoId(),
    body("price").notEmpty().isFloat({ min: 0 }),
    body("startsAt").notEmpty().isISO8601(),
    body("endsAt").notEmpty().isISO8601(),
    body("description").optional().isString().trim().isLength({ max: 5000 }),
    validationError,
    createTrip
);

router.patch(
    "/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId(),
    uploadCover.single("cover"),
    body("title").optional().isString().trim().isLength({ max: 120 }),
    body("destination").optional().isMongoId(),
    body("price").optional().isFloat({ min: 0 }),
    body("startsAt").optional().isISO8601(),
    body("endsAt").optional().isISO8601(),
    body("description").optional().isString().trim().isLength({ max: 5000 }),
    validationError,
    updateTrip
);

router.delete(
    "/:id",
    requireAuth,
    requireRole("operator"),
    param("id").isMongoId(),
    validationError,
    deleteTrip
);

export default router;
