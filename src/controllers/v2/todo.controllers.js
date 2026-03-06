import * as todoService from "../../services/todo.service.js";
import cloudinary from "../../config/cloundinary.js";

export const createTodo = async (req, res, next) => {
  try {
    const {
      title,
      description
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required test"
      });
    }

    let imageUrl = null;

    if (req.file) {
      console.log("Is Buffer?", Buffer.isBuffer(req.file.buffer));
      console.log("Buffer size (bytes):", req.file.buffer.length);
    }
    // If image is uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder: "todos"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }
  
    const todo = await todoService.createTodo(
      req.user.id, {
        title,
        description,
        imageUrl,
      }
    );

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = Math.min(parseInt(req.query.limit) || 10, 50);
    let sortBy = req.query.sortBy || "createdAt";
    let order = req.query.order || "desc";

    const result = await todoService.getUserTodos({
      userId: req.user.id,
      page,
      limit,
      sortBy,
      order,
    });

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const updated = await todoService.updateTodo(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    await todoService.deleteTodo(req.user.id, req.params.id);

    res.json({
      message: "Todo deleted"
    });
  } catch (error) {
    next(error);
  }
};