import _sequelize from "sequelize";
const { Model } = _sequelize;

export default class UserSession extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        refreshTokenHash: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        userAgent: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        ipAddress: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },

        expiresAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        tableName: "UserSession",
        timestamps: true,
      }
    );
  }
}