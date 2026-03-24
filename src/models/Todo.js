import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Todo extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Todo',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Todo_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Todo_userId_idx",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
  }
}
