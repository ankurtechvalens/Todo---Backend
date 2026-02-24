import { prisma } from "../config/prisma.js";
import * as paymentRepository from "../repositories/payment.repository.js";

export const createPayment = async (userId, amount) => {
  return paymentRepository.createPayment({
    userId,
    amount,
    provider: "MANUAL",
    status: "PENDING"
  });
};

export const verifyPayment = async (paymentId) => {

  return prisma.$transaction(async (tx) => {

    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "SUCCESS" }
    });

    await tx.user.update({
      where: { id: payment.userId },
      data: { role: "PREMIUM" }
    });

    return payment;
  });

};

export const getUserPayments = (userId) => {
  return paymentRepository.findPaymentsByUser(userId);
};