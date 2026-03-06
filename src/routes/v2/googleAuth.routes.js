import express from "express";
import { googleLogin } from "../../controllers/v2/googleAuth.controller.js";

const router = express.Router();

router.post("/google", googleLogin);

export default router;