-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC';
