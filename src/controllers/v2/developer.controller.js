import * as service from "../../services/developer.service.js";

export const generateKeys = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existing = await service.getDeveloperApp(userId);

    if (existing) {
      return res.status(400).json({
        message: "Keys already generated. Regenerate if needed."
      });
    }

    const data = await service.generateKeys(userId);

    res.json({
      message: "Keys generated successfully",
      data
    });

  } catch (err) {
    next(err);
  }
};

export const getKeysInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const app = await service.getDeveloperApp(userId);

    if (!app) {
      return res.json({ hasKeys: false });
    }

    res.json({
        hasKeys: true,
        apiKey: app.apiKey,
        maskedApiSecret: app.maskedApiSecret,
    });
  } catch (err) {
    next(err);
  }
};clea

export const regenerateKeys = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await service.regenerateKeys(userId);

    res.json({
      message: "Keys regenerated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};