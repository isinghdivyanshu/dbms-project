/*
  Warnings:

  - You are about to drop the column `accommodationType` on the `EventParticipant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccomodationType" AS ENUM ('DAY_SCHOLAR', 'GIRLS_HOSTEL', 'BOYS_HOSTEL');

-- AlterTable
ALTER TABLE "EventParticipant" DROP COLUMN "accommodationType",
ADD COLUMN     "accomodationType" "AccomodationType" NOT NULL DEFAULT 'DAY_SCHOLAR';

-- DropEnum
DROP TYPE "AccommodationType";
