import express from "express";

import {
  deleteToken,
  notifyAll,
  notifyUser,
  saveToken,
} from "../controllers/push.Controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/token", protect, saveToken);
router.delete("/token", protect, deleteToken);

router.post("/notify-all", protect, notifyAll);
router.post("/notify-user/:userId", protect, notifyUser);

export default router;
