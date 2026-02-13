import * as todoService from "../services/todo.service.js";

export const createTodo = async (req, res, next) => {
  try {

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // res.status(201).json({ id: Date.now(), // fake ID
    //   title,
    //   completed: false
    // });
    const todo = await todoService.createTodo(req.user.id, req.body);
    res.status(201).json(todo);
    
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getUserTodos(req.user.id);
    res.json(todos);
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
    res.json({ message: "Todo deleted" });
  } catch (error) {
    next(error);
  }
};
