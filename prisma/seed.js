import { prisma } from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {

  console.log("Seeding database...");

  // 1️⃣ Create Roles
  const roles = await prisma.role.createMany({
    data: [
      { name: "SUPER_ADMIN", isSystem: true },
      { name: "ADMIN", isSystem: true },
      { name: "BASIC", isSystem: true },
      { name: "PREMIUM", isSystem: true }
    ]
  });

  console.log("Roles created");


  // 2️⃣ Create Permissions
  const permissions = await prisma.permission.createMany({
    data: [
      { name: "users.read" },
      { name: "users.delete" },
      { name: "todos.read.any" },
      { name: "todos.create" },
      { name: "todos.delete" },
      { name: "roles.manage" },
      { name: "payments.read" }
    ]
  });

  console.log("Permissions created");


  // 3️⃣ Assign permissions to SUPER_ADMIN
  const superAdminRole = await prisma.role.findUnique({
    where: { name: "SUPER_ADMIN" }
  });

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {

    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        permissionId: permission.id
      }
    });

  }

  console.log("SUPER_ADMIN permissions assigned");


  // 4️⃣ Create Super Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@todo.com",
      password: hashedPassword,
      roleId: superAdminRole.id
    }
  });

  console.log("SUPER_ADMIN user created");

}

main()
  .then(() => {
    console.log("Seeding completed");
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });