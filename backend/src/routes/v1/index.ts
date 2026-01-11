import { Router } from "express";

import auth from "@/routes/v1/auth";
import users from "@/routes/v1/users";
import admin from "@/routes/v1/admin";
import destinations from "@/routes/v1/destinations";
import trips from "@/routes/v1/trips";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);
router.use("/destinations", destinations);
router.use("/trips", trips);

export default router;
