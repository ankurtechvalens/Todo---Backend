import { getCache, setCache, deleteByPattern } from "../utils/cache.js";
import { io } from "../server.js";
import * as todoRepository from '../repositorySequalize/todo.repository.js'
import cloudinary from "../config/cloundinary.js";
import { sendPushNotification } from "./notification.service.js";

export const createTodo = async (userId, data, file) => {

  if (!data.title) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await todoRepository.findUniqueUser(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // BASIC user limit
  if (user.role === "BASIC") {

    const count = await todoRepository.countTodos(userId);

    if (count >= 10) {
      const error = new Error(
        "Basic users can create only 10 todos. Upgrade to premium."
      );
      error.statusCode = 403;
      throw error;
    }
  }

  let imageUrl = null;

  if (file) {

    if (user.role !== "PREMIUM") {
      const error = new Error("Upgrade to premium to upload images");
      error.statusCode = 403;
      throw error;
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "todos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    imageUrl = result.secure_url;
  }

  const todo = await todoRepository.createTodo(userId, {
    ...data,
    imageUrl
  });

  await deleteByPattern(`todos:${userId}:*`);

  if (user?.fcmToken) {
    await sendPushNotification(
      user.fcmToken,
      "New Todo Created",
      `Task: ${data.title}`
    );
  }

  io.to(userId).emit("todo:created", todo);

  return todo;
};

export const getUserTodos = async ({
  userId,
  page,
  limit,
  sortBy,
  order,
  search,
}) => {

  const cacheKey = `todos:${userId}:${page}:${limit}:${sortBy}:${order}:${search || ""}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("⚡Serving from Redis");
    return cachedData;
  }

  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    todoRepository.getAllTodos(userId, skip, limit, order, sortBy, search),
    todoRepository.getAllTodosTotal(userId, search),
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

  const deleted = await todoRepository.deleteTodo(todoId, userId);

  // Clear cache
  await deleteByPattern(`todos:${userId}:*`);
  
  io.to(userId).emit("todo:deleted", deleted.id);

  return deleted;
};
