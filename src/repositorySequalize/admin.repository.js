import models from "../models/index.js";

const { User, Role, Todo } = models;

/*
  Get all users (with role)
*/
export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "email", "createdAt"],
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name"] // adjust if you want full role object
      }
    ]
  });
};

/*
  Get all todos of a user
*/
export const getUserTodos = async (userId) => {
  return await Todo.findAll({
    where: { userId }
  });
};

/*
  Delete user by id
*/
export const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();

  return true;
};