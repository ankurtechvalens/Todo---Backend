import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Payment extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "INR"
    },
    status: {
      type: DataTypes.ENUM("PENDING","SUCCESS","FAILED"),
      allowNull: false,
      defaultValue: "PENDING"
    },
    provider: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    orderId: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Payment',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Payment_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Payment_userId_idx",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
  }
}
