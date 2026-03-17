import express from "express";
import { googleLogin } from "../../controllers/v2/googleAuth.controller.js";
import { linkedInCallback } from "../../controllers/v2/linkedin.controller.js";
import { verifyEmail } from "../../controllers/v2/user.controllers.js";

const router = express.Router();

router.get("/verify-email", verifyEmail);
router.post("/google", googleLogin);
router.get("/linkedin/callback", linkedInCallback);
router.get("/github/callback", linkedInCallback);

export default router;