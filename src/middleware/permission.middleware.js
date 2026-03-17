export const requirePermission = (permission) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    console.log("User permissions:", req.user.permissions);
    console.log("Required permission:", permission);

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: "Permission denied"
      });
    }

    next();
  };
};