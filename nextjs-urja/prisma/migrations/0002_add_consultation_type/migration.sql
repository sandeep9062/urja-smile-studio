-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('VIDEO', 'PHYSICAL');

-- AlterTable: Add consultationType and videoRoomId to appointments
ALTER TABLE "appointments" ADD COLUMN "consultationType" "ConsultationType" NOT NULL DEFAULT 'PHYSICAL';
ALTER TABLE "appointments" ADD COLUMN "videoRoomId" TEXT;