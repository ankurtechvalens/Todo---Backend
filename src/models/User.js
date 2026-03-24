import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class User extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    googleId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedinId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    githubId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Role',
        key: 'id'
      }
    },
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    verificationTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "User_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "User_githubId_key",
        unique: true,
        fields: [
          { name: "githubId" },
        ]
      },
      {
        name: "User_googleId_key",
        unique: true,
        fields: [
          { name: "googleId" },
        ]
      },
      {
        name: "User_linkedinId_key",
        unique: true,
        fields: [
          { name: "linkedinId" },
        ]
      },
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "User_roleId_idx",
        fields: [
          { name: "roleId" },
        ]
      },
    ]
  });
  }
}
