import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Permission extends Model {
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
    }
  }, {
    sequelize,
    tableName: 'Permission',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Permission_name_idx",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "Permission_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "Permission_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
