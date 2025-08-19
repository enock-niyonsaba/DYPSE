/*
  Warnings:

  - You are about to drop the column `nextDueAt` on the `VerificationReminder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `VerificationReminder` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `jobReadinessScore` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `lastVerifiedAt` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `YouthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `YouthProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,verificationId]` on the table `VerificationReminder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verificationId]` on the table `YouthProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employerProfileId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationId` to the `VerificationReminder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."VerificationReminder_profileId_nextDueAt_idx";

-- DropIndex
DROP INDEX "public"."YouthProfile_jobStatus_idx";

-- DropIndex
DROP INDEX "public"."YouthProfile_location_idx";

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "employerProfileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."VerificationReminder" DROP COLUMN "nextDueAt",
DROP COLUMN "status",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "verificationId" TEXT NOT NULL,
ALTER COLUMN "reminderSentAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."YouthProfile" DROP COLUMN "dob",
DROP COLUMN "jobReadinessScore",
DROP COLUMN "lastVerifiedAt",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "longitude",
DROP COLUMN "profilePictureUrl",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "verificationId" TEXT,
ALTER COLUMN "jobStatus" SET DEFAULT 'unemployed';

-- CreateTable
CREATE TABLE "public"."EmployerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactTitle" TEXT,
    "companySize" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "about" TEXT,
    "logo" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Verification" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "documentType" TEXT,
    "documentUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployerProfile_userId_key" ON "public"."EmployerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationReminder_profileId_verificationId_key" ON "public"."VerificationReminder"("profileId", "verificationId");

-- CreateIndex
CREATE UNIQUE INDEX "YouthProfile_verificationId_key" ON "public"."YouthProfile"("verificationId");

-- AddForeignKey
ALTER TABLE "public"."YouthProfile" ADD CONSTRAINT "YouthProfile_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "public"."Verification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmployerProfile" ADD CONSTRAINT "EmployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationReminder" ADD CONSTRAINT "VerificationReminder_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "public"."Verification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_employerProfileId_fkey" FOREIGN KEY ("employerProfileId") REFERENCES "public"."EmployerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
