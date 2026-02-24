import * as paymentService from "../services/payment.service.js";

export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(
      req.user.id,
      999 // fixed premium price for now
    );

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    const payment = await paymentService.verifyPayment(paymentId);

    res.json({
      message: "User upgraded to PREMIUM",
      payment
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);
    res.json(payments);
  } catch (error) {
    next(error);
  }
};