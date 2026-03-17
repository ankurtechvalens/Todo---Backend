import * as adminService from "../../services/admin.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserTodos = async (req, res, next) => {
  try {
    const todos = await adminService.getUserTodos(req.params.id);
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};