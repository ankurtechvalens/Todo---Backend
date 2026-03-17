import {prisma} from '../config/prisma.js';

export const findUniqueUser = (userId) => {
    return prisma.user.findUnique({
    where: { id: userId },
  });
}

export const createTodo = (userId,data) => {
    return prisma.todo.create({
        data: {
          title: data.title,
          description: data.description ?? null,
          imageUrl: data.imageUrl ?? null,
          userId,
        },
      });
}

export const countTodos = (userId) => {
  return prisma.todo.count({
    where: { userId }
  });
};

export const getAllTodos = (userId,skip,limit,order,sortBy) => {
    return prisma.todo.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
        })
}

export const getAllTodosTotal = (userId) => {
    return prisma.todo.count({
      where: { userId },
    })
}


export const updateTodo = (userId, todoId, data) => {
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
}

export const deleteTodo = (todoId, userId) => {
  return prisma.todo.delete({
      where: {
        id: todoId,
        userId
      }
    });
}