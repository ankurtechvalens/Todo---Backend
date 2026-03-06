import {prisma} from "../config/prisma.js";
import { getCache, setCache, deleteByPattern } from "../utils/cache.js";
import { io } from "../server.js";
import * as todoRepository from '../repositories/todo.repository.js'

export const createTodo = async (userId, data) => {

  const user = await todoRepository.findUniqueUser(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.imageUrl && user.role !== "PREMIUM") {
    const error = new Error(
      "Upgrade to premium to add image in your todo"
    );
    error.statusCode = 403;
    throw error;
  }

  const todo = await todoRepository.createTodo(userId,data);

  
  //Clear all cached todo lists of this user
  await deleteByPattern(`todos:${userId}:*`);
  
  // Emit event to all user devices
  io.to(userId).emit("todo:created", todo);

  return todo;
};

export const getUserTodos = async ({
  userId,
  page,
  limit,
  sortBy,
  order,
}) => {

  const cacheKey = `todos:${userId}:${page}:${limit}:${sortBy}:${order}`;

  // Check Cache First
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("⚡Serving from Redis");
    return cachedData;
  }

  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    todoRepository.getAllTodos(userId,skip,limit,order,sortBy),
    todoRepository.getAllTodosTotal(userId),
  ]);

  const result = {
    data: todos,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  // Store in Cache (TTL 60 seconds)
  await setCache(cacheKey, result, 60);

  return result;
};

export const updateTodo = async (userId, todoId, data) => {

  const updated = await todoRepository.updateTodo(userId, todoId, data);

  // 🔥 Clear cache
  await deleteByPattern(`todos:${userId}:*`);

  io.to(userId).emit("todo:updated", updated);
  
  return updated;
};


export const deleteTodo = async (userId, todoId) => {

  const deleted = await prisma.todo.delete({
    where: {
      id: todoId,
      userId
    }
  });

  
  // Clear cache
  await deleteByPattern(`todos:${userId}:*`);
  
  io.to(userId).emit("todo:deleted", deleted.id);

  return deleted;
};