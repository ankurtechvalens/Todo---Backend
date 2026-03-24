import _sequelize from "sequelize";
const { Model } = _sequelize;

export default class Developer extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: "User",
            key: "id",
          },
        },

        apiKey: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        apiSecretHash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        maskedApiSecret: {
            type: DataTypes.STRING,
            allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "Developer",
        schema: "public",
        timestamps: true,

        hooks: {
          beforeUpdate(instance) {
            if (instance.changed("apiKey")) {
              throw new Error("API Key cannot be modified");
            }

            if (instance.changed("apiSecretHash")) {
              throw new Error("API Secret cannot be modified directly");
            }
          },
        },

        indexes: [
          {
            name: "Developer_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "Developer_apiKey_key",
            unique: true,
            fields: [{ name: "apiKey" }],
          },
          {
            name: "Developer_userId_key",
            unique: true,
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}