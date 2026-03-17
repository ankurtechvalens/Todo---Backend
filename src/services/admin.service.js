import * as adminRepository from "../repositories/admin.repository.js";

export const getAllUsers = async () => {
  return adminRepository.getAllUsers();
};

export const getUserTodos = async (userId) => {
  return adminRepository.getUserTodos(userId);
};

export const deleteUser = async (userId) => {
  return adminRepository.deleteUser(userId);
};