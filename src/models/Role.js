import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Role extends Model {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'Role',
    schema: 'public',
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
    indexes: [
      {
        name: "Role_name_idx",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "Role_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "Role_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
