import models from "../models/index.js";
const { UserSession } = models;

export const createSession = (data) => {
  return UserSession.create(data);
};

export const findSessionByHash = (hash) => {
  return UserSession.findOne({
    where: {
      refreshTokenHash: hash,
      isActive: true,
    },
  });
};

export const deactivateSession = (hash) => {
  console.log("deactivating session", hash)
  return UserSession.update(
    { isActive: false },
    {
      where: { refreshTokenHash: hash },
    }
  );
};