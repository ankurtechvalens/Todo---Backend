import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import * as controller from "../../controllers/v2/developer.controller.js";

const router = express.Router();

router.get("/", authMiddleware, controller.getKeysInfo);
router.post("/generate", authMiddleware, controller.generateKeys);
router.post("/regenerate", authMiddleware, controller.regenerateKeys);

export default router;