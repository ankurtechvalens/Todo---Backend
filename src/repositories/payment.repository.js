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