import crypto from "crypto";
import bcrypt from "bcrypt";
import * as repo from "../repositorySequalize/developer.repository.js";

export const generateKeys = async (userId) => {
  const apiKey = "todo_pk_" + crypto.randomBytes(16).toString("hex");
  const apiSecret = "todo_sk_" + crypto.randomBytes(32).toString("hex");

  const hash = await bcrypt.hash(apiSecret, 10);

  const last4 = apiSecret.slice(-4);
  const masked = "************" + last4;

  await repo.createDeveloperApp({
    userId,
    apiKey,
    apiSecretHash: hash,
    maskedApiSecret: masked, // ✅ store masked
  });

  return {
    apiKey,
    apiSecret,
  };
};

export const getDeveloperApp = async (userId) => {
  return repo.findByUserId(userId);
};

export const regenerateKeys = async (userId) => {
  // delete old keys
  await repo.deleteByUserId(userId);

  // generate new keys
  return generateKeys(userId);
};
