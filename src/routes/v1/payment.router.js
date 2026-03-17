import express from "express";
import * as paymentController from "../../controllers/v1/payment.controllers.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, paymentController.createPayment);
router.post("/verify", authMiddleware, paymentController.verifyPayment);
router.get("/my", authMiddleware, paymentController.getMyPayments);

export default router;