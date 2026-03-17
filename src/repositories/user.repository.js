import { prisma } from "../config/prisma.js";

/*
  Helper: Get BASIC role id
*/
const getBasicRoleId = async () => {
  const role = await prisma.role.findUnique({
    where: { name: "BASIC" }
  });

  if (!role) {
    throw new Error("BASIC role not found in database");
  }

  return role.id;
};


/*
  Find user by email (used in login)
*/
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: true
    }
  });
};


/*
  Find user by id (used internally)
*/
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      role: true
    }
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

  return prisma.user.create({
    data: {
      ...data,
      roleId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: { name: true }
      }
    }
  });
};


/*
  Create user via Google OAuth
*/
export const createUserByGoogle = async (data) => {

  const roleId = await getBasicRoleId();

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      googleId: data.sub,
      roleId
    }
  });
};


/*
  Create user via LinkedIn OAuth
*/
export const createUserByLinkedIn = async (data) => {

  const roleId = await getBasicRoleId();

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      linkedinId: data.sub,
      roleId
    }
  });
};

export const createUserByGithub = async (data) => {
  const roleId = await getBasicRoleId();

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      githubId: data.githubId,
      roleId
    }
  });
};

/*
  Update user by id
*/
export const updateUserById = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};


/*
  Update user's role
*/
export const updateUserRole = async (userId, roleId) => {

  return prisma.user.update({
    where: { id: userId },
    data: { roleId },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: { name: true }
      }
    }
  });
};

export const updateUserRoleFunc = (roleId, id) => {
  return prisma.user.update({
      where:{ id: Number(id)},
      data:{ roleId }
    });
}
/*
  Update user safely (without returning sensitive data)
*/
export const updateUserSafe = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: { name: true }
      }
    }
  });
};


/*
  Get user safely
*/
export const findUserSafeById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: { name: true }
      }
    }
  });
};


/*
  Update refresh token (hashed token)
*/
export const updateRefreshToken = async (userId, token) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token }
  });
};


/*
  Clear refresh token on logout
*/
export const clearRefreshToken = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });
};

export const saveEmailVerificatioToken = (userId, emailVerificationHashed) => {
  return prisma.user.update({
        where: {
          id: userId
        },
        data: {
          verificationToken: emailVerificationHashed,
          verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
}

export const findUserByEmailToken = (emailVerificationHashed) => {
  return prisma.user.findFirst({
    where: {
      verificationToken: emailVerificationHashed,
      verificationTokenExpiry: {
        gte: new Date(),
      },
    },
  });
}

export const updateUserDataForEmailLink = (userId) => {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });
}

export const findUserWithPermissionsById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });
};