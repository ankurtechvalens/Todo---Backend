import { prisma } from "../config/prisma.js";

export const createPayment = (data) => {
  return prisma.payment.create({ data });
};

export const updatePaymentStatus = (id, status) => {
  return prisma.payment.update({
    where: { id },
    data: { status }
  });
};

export const findPaymentById = (id) => {
  return prisma.payment.findUnique({ where: { id } });
};

export const findPaymentsByUser = (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

export const verifyPaymentAndUpgradeUser = async (paymentId) => {
  return prisma.$transaction(async (tx) => {

    // 1. Update payment status
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "SUCCESS" }
    });

    // 2. Get PREMIUM role
    const premiumRole = await tx.role.findUnique({
      where: { name: "PREMIUM" }
    });

    if (!premiumRole) {
      throw new Error("PREMIUM role not found");
    }

    // 3. Update user with roleId
    await tx.user.update({
      where: { id: payment.userId },
      data: {
        roleId: premiumRole.id
      }
    });

    return payment;
  });
};