import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class RolePermission extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Role',
        key: 'id'
      }
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Permission',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'RolePermission',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "RolePermission_permissionId_idx",
        fields: [
          { name: "permissionId" },
        ]
      },
      {
        name: "RolePermission_pkey",
        unique: true,
        fields: [
          { name: "roleId" },
          { name: "permissionId" },
        ]
      },
      {
        name: "RolePermission_roleId_idx",
        fields: [
          { name: "roleId" },
        ]
      },
    ]
  });
  }
}
