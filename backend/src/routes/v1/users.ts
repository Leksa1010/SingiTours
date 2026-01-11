import {Router} from "express";
import {body} from "express-validator";

import requireAuth from "@/middleware/requireAuth";
import requireRole from "@/middleware/requireRole";
import validationError from "@/middleware/validationError";

import {getMe, updateMe, deleteMe} from "@/controllers/v1/users/me";

const router = Router();

router.get("/me", requireAuth, requireRole("traveller"), getMe);

router.patch(
    "/me",
    requireAuth,
    requireRole("traveller"),
    body("firstName").optional().isString().trim().isLength({max: 20}),
    body("lastName").optional().isString().trim().isLength({max: 20}),
    body("socialLinks.website").optional().isString().trim().isLength({max: 80}),
    body("socialLinks.facebook").optional().isString().trim().isLength({max: 80}),
    body("socialLinks.linkedin").optional().isString().trim().isLength({max: 80}),
    body("socialLinks.instagram").optional().isString().trim().isLength({max: 80}),
    body("socialLinks.x").optional().isString().trim().isLength({max: 80}),
    body("socialLinks.youtube").optional().isString().trim().isLength({max: 80}),
    validationError,
    updateMe
);

router.delete("/me", requireAuth, requireRole("traveller"), deleteMe);

export default router;
