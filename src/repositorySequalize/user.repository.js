import { Op } from "sequelize";
import models from "../models/index.js";

const { User, Role, Permission, RolePermission } = models;

/*
  Helper: Get BASIC role id
*/
const getBasicRoleId = async () => {
  const role = await Role.findOne({
    where: { name: "BASIC" },
  });

  if (!role) {
    throw new Error("BASIC role not found in database");
  }

  return role.id;
};

/*
  Find user by email
*/
export const findUserByEmail = async (email) => {
  return User.findOne({
    where: { email },
    include: [{ model: Role, as: "role" }],
  });
};

/*
  Find user by id
*/
export const findUserById = async (id) => {
  return User.findOne({
    where: { id },
    include: { model: Role, as: "role" },
  });
};

/*
  Create normal user
*/
export const createUser = async (data) => {
  let roleId = data.roleId;

  if (!roleId) {
    roleId = await getBasicRoleId();
  }

  const user = await User.create({
    ...data,
    roleId,
  });

  return await User.findByPk(user.id, {
    attributes: ["id", "name", "email"],
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name"],
      },
    ],
  });
};

/*
  OAuth users
*/
export const createUserByGoogle = async (data) => {
  const roleId = await getBasicRoleId();

  const user = await User.create({
    email: data.email,
    name: data.name,
    googleId: data.sub,
    roleId,
  });

  return await findUserSafeById(user.id);
};

export const createUserByLinkedIn = async (data) => {
  const roleId = await getBasicRoleId();

  const user = await User.create({
    email: data.email,
    name: data.name,
    linkedinId: data.sub,
    roleId,
  });

  return await findUserSafeById(user.id);
};

export const createUserByGithub = async (data) => {
  const roleId = await getBasicRoleId();

  const user = await User.create({
    email: data.email,
    name: data.name,
    githubId: data.sub,
    roleId,
  });

  return await findUserSafeById(user.id);
};

/*
  Update role
*/
export const updateUserRole = async (userId, roleId) => {
  await User.update({ roleId }, { where: { id: userId } });

  return findUserSafeById(userId);
};

export const updateUserRoleFunc = async (roleId, id) => {
  return User.update(
    { roleId },
    { where: { id: Number(id) } }
  );
};

/*
  Update user safely
*/
export const updateUserSafe = async (id, data) => {
  await User.update(data, { where: { id } });

  return findUserSafeById(id);
};

/*
  Get user safe
*/
export const findUserSafeById = async (id) => {
  return User.findByPk(id, {
    attributes: ["id", "name", "email"],
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name"],
      },
    ],
  });
};

/*
  EMAIL VERIFICATION
*/
export const saveEmailVerificationToken = async (userId, token) => {
  return User.update(
    {
      verificationToken: token,
      verificationTokenExpiry: new Date(
        Date.now() + 60 * 60 * 1000
      ),
    },
    { where: { id: userId } }
  );
};

export const findUserByEmailToken = async (token) => {
  return User.findOne({
    where: {
      verificationToken: token,
      verificationTokenExpiry: {
        [Op.gte]: new Date(),
      },
    },
  });
};

export const updateUserDataForEmailLink = async (userId) => {
  return User.update(
    {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
    { where: { id: userId } }
  );
};

/*
  Permissions
*/
export const findUserWithPermissionsById = async (id) => {
  return User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "role",
        include: [
          {
            model: RolePermission,
            as: "permissions",
            include: [
              {
                model: Permission,
                as: "permission",
              },
            ],
          },
        ],
      },
    ],
  });
};

/*
  FCM TOKEN
*/
export const saveFcmTok = (userId, token) => {
  return User.update(
    { fcmToken: token },
    { where: { id: userId } }
  );
};