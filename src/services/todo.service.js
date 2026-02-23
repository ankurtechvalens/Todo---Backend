import {prisma} from "../config/prisma.js";

export const createTodo = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Premium restriction
  if (data.imageUrl && user.role !== "PREMIUM") {
    const error = new Error(
      "Upgrade to premium to add image in your todo"
    );
    error.statusCode = 403;
    throw error;
  }

  return prisma.todo.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      userId,
    },
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
      id: todoId,
      userId
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