/*
  Warnings:

  - The `specialDrop` column on the `bosses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bosses" DROP COLUMN "specialDrop",
ADD COLUMN     "specialDrop" BOOLEAN NOT NULL DEFAULT false;
