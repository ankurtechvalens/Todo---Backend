import * as todoService from "../../services/todo.service.js";

export const createTodo = async (req, res, next) => {
  try {
    const todo = await todoService.createTodo(req.user.id, req.body, req.file);
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