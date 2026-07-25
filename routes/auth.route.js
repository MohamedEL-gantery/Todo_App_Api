import express from "express";
import { login, refresh, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
