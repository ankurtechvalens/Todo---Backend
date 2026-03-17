import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ Use repository instead of prisma
    const user = await userRepository.findUserWithPermissionsById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const permissions = user.role.permissions.map(
      (rp) => rp.permission.name
    );

    req.user = {
      id: user.id,
      role: user.role.name,
      permissions
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;