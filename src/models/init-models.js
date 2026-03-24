import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Payment from  "./Payment.js";
import _Permission from  "./Permission.js";
import _Role from  "./Role.js";
import _RolePermission from  "./RolePermission.js";
import _Todo from  "./Todo.js";
import _User from  "./User.js";
import __prisma_migrations from  "./_prisma_migrations.js";
import _Developer from "./Developer.js";
import _UserSession from "./UserSession.js";

export default function initModels(sequelize) {
  const Payment = _Payment.init(sequelize, DataTypes);
  const Permission = _Permission.init(sequelize, DataTypes);
  const Role = _Role.init(sequelize, DataTypes);
  const RolePermission = _RolePermission.init(sequelize, DataTypes);
  const Todo = _Todo.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);
  const _prisma_migrations = __prisma_migrations.init(sequelize, DataTypes);
  const Developer = _Developer.init(sequelize, DataTypes);
  const UserSession = _UserSession.init(sequelize, DataTypes);

  Permission.belongsToMany(Role, { as: 'roleId_Roles', through: RolePermission, foreignKey: "permissionId", otherKey: "roleId" });
  Role.belongsToMany(Permission, { as: 'permissionId_Permissions', through: RolePermission, foreignKey: "roleId", otherKey: "permissionId" });
  RolePermission.belongsTo(Permission, { as: "permission", foreignKey: "permissionId"});
  Permission.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "permissionId"});
  RolePermission.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "roleId"});
  User.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(User, { as: "Users", foreignKey: "roleId"});
  Payment.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Payment, { as: "Payments", foreignKey: "userId"});
  Todo.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Todo, { as: "Todos", foreignKey: "userId"});
  Developer.belongsTo(User, { foreignKey: "userId" });
  User.hasOne(Developer, { foreignKey: "userId" });
  UserSession.belongsTo(User, { foreignKey: "userId" });
  UserSession.belongsTo(User, { foreignKey: "userId" });


return {
  Payment,
  Permission,
  Role,
  RolePermission,
  Todo,
  User,
  Developer,
  UserSession,
  _prisma_migrations,
};
}
