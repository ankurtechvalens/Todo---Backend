import models from "../models/index.js";

const {Developer} = models;
export const createDeveloperApp = async (data) => {
  return Developer.create(data);
};

export const findByUserId = async (userId) => {
  return Developer.findOne({ where: { userId } });
};

export const findByApiKey = async (apiKey) => {
  return Developer.findOne({ where: { apiKey } });
};

export const deleteByUserId = async (userId) => {
  return Developer.destroy({
    where: { userId },
  });
};