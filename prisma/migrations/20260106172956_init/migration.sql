-- CreateEnum
CREATE TYPE "BossType" AS ENUM ('RARE', 'LEGACY', 'UNIQUE');

-- CreateTable
CREATE TABLE "bosses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teleportPoint" TEXT NOT NULL,
    "type" "BossType" NOT NULL,
    "respawnHours" DOUBLE PRECISION NOT NULL,
    "deathTime" TIMESTAMP(3),
    "reporter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bosses_pkey" PRIMARY KEY ("id")
);
