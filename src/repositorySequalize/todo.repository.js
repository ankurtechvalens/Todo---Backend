import models from "../models/index.js";

const { User, Todo } = models;

/*
  Find user by ID
*/
export const findUniqueUser = async (userId) => {
  return await User.findByPk(userId);
};

/*
  Create todo
*/
export const createTodo = async (userId, data) => {

  return await Todo.create({
    title: data.title,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
    userId
  });
};

/*
  Count todos
*/
export const countTodos = async (userId) => {
  return await Todo.count({
    where: { userId }
  });
};

/*
  Get all todos (pagination + sorting)
*/
import { Op } from "sequelize";

export const getAllTodos = async (
  userId,
  skip,
  limit,
  order,
  sortBy,
  search
) => {
  return Todo.findAll({
    where: {
      userId,
      ...(search && {
        title: {
          [Op.like]: `%${search}%`,
        },
      }),
    },
    offset: skip,
    limit,
    order: [[sortBy || "createdAt", order || "DESC"]],
  });
};

/*
  Total todos count
*/
export const getAllTodosTotal = async (userId, search) => {
  return Todo.count({
    where: {
      userId,
      ...(search && {
        title: {
          [Op.like]: `%${search}%`,
        },
      }),
    },
  });
};

/*
  Update todo (with user ownership check)
*/
export const updateTodo = async (userId, todoId, data) => {
  const [updatedRows] = await Todo.update(
    {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.completed !== undefined && { completed: data.completed })
    },
    {
      where: {
        id: todoId,
        userId
      }
    }
  );

  if (updatedRows === 0) {
    throw new Error("Todo not found or unauthorized");
  }

  return true;
};

/*
  Delete todo (with user ownership check)
*/
export const deleteTodo = async (todoId, userId) => {
  const deletedRows = await Todo.destroy({
    where: {
      id: todoId,
      userId
    }
  });

  if (deletedRows === 0) {
    throw new Error("Todo not found or unauthorized");
  }

  return true;
};