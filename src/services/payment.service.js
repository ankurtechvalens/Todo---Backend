import { prisma } from "../config/prisma.js";
import * as paymentRepository from "../repositorySequalize/payment.repository.js";

export const createPayment = async (userId, amount) => {
  return paymentRepository.createPayment({
    userId,
    amount,
    provider: "MANUAL",
    status: "PENDING"
  });
};

export const verifyPayment = async (paymentId) => {
  return paymentRepository.verifyPaymentAndUpgradeUser(paymentId);
};

export const getUserPayments = (userId) => {
  return paymentRepository.findPaymentsByUser(userId);
};