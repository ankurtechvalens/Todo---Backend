import models from "../models/index.js";

const { Payment, User, Role, sequelize } = models;

/*
  Create payment
*/
export const createPayment = async (data) => {
  return await Payment.create(data);
};

/*
  Update payment status
*/
export const updatePaymentStatus = async (id, status) => {
  const [updatedRows] = await Payment.update(
    { status },
    { where: { id } }
  );

  if (updatedRows === 0) {
    throw new Error("Payment not found");
  }

  return true;
};

/*
  Find payment by ID
*/
export const findPaymentById = async (id) => {
  return await Payment.findByPk(id);
};

/*
  Find payments by user (latest first)
*/
export const findPaymentsByUser = async (userId) => {
  return await Payment.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]] // Prisma → orderBy
  });
};

/*
  Verify payment and upgrade user (TRANSACTION 🔥)
*/
export const verifyPaymentAndUpgradeUser = async (paymentId) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Update payment status
    const payment = await Payment.update(
      { status: "SUCCESS" },
      {
        where: { id: paymentId },
        returning: true, // PostgreSQL only (important)
        transaction
      }
    );

    if (payment[0] === 0) {
      throw new Error("Payment not found");
    }

    const updatedPayment = payment[1][0];

    // 2. Get PREMIUM role
    const premiumRole = await Role.findOne({
      where: { name: "PREMIUM" },
      transaction
    });

    if (!premiumRole) {
      throw new Error("PREMIUM role not found");
    }

    // 3. Update user role
    await User.update(
      { roleId: premiumRole.id },
      {
        where: { id: updatedPayment.userId },
        transaction
      }
    );

    // ✅ Commit transaction
    await transaction.commit();

    return updatedPayment;

  } catch (error) {
    // ❌ Rollback on error
    await transaction.rollback();
    throw error;
  }
};