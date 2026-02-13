import {prisma} from "../config/prisma.js";

export const createTodo = async (userId, data) => {
  return prisma.todo.create({
    data: {
      title: data.title,
      description: data.description ?? null, // optional
      userId
    }
  });
};

export const getUserTodos = async (userId) => {
  return prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

export const updateTodo = async (userId, todoId, data) => {
  return prisma.todo.update({
    where: {
      id: todoId
    },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.completed !== undefined && { completed: data.completed })
    }
  });
};


export const deleteTodo = async (userId, todoId) => {
  return prisma.todo.delete({
    where: {
      id: todoId,
      userId
    }
  });
};