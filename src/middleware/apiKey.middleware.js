import bcrypt from "bcrypt";
import * as repo from "../repositorySequalize/developer.repository.js";

export const apiAuthMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const apiSecret = req.headers["x-api-secret"];

  if (!apiKey || !apiSecret) {
    return res.status(401).json({ message: "Missing API credentials" });
  }

  const app = await repo.findByApiKey(apiKey);

  if (!app) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const valid = await bcrypt.compare(apiSecret, app.apiSecretHash);

  if (!valid) {
    return res.status(403).json({ message: "Invalid API secret" });
  }

  req.user = { id: app.userId };
  next();
};