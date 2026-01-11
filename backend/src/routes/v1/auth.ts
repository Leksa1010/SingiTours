import { Router } from "express";
import { body } from "express-validator";

import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import logout from "@/controllers/v1/auth/logout";
import validationError from "@/middleware/validationError";
import User from "@/models/user";

const router = Router();

router.post(
    "/register",
    body("email")
        .trim().notEmpty().withMessage("Email is required")
        .isLength({ max: 50 }).withMessage("Email length must be shorter than 50 characters")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail()
        .custom(async (value) => {
            const exists = await User.exists({ email: value });
            if (exists) throw new Error("User already registered");
            return true;
        }),
    body("password")
        .notEmpty().withMessage("Password is required").bail()
        .isLength({ min: 8, max: 50 }).withMessage("Password must be 8 to 50 characters long")
        .isStrongPassword({ minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage("Password must include upper, lower, number and symbol"),
    validationError,
    register
);

router.post(
    "/login",
    body("email").trim().notEmpty().isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validationError,
    login
);

router.post("/logout", logout);

export default router;
