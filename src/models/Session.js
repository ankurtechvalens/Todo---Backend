export default (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT, // JWT or session token
      allowNull: false,
    },
    device: {
      type: DataTypes.STRING, // "Chrome Windows", "iPhone"
    },
    ip: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  });

  return Session;
};