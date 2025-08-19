-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('youth', 'employer', 'admin', 'verifier');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('unemployed', 'employed', 'self_employed');

-- CreateEnum
CREATE TYPE "public"."SkillLevel" AS ENUM ('beginner', 'intermediate', 'expert');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('applied', 'shortlisted', 'rejected');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YouthProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bio" TEXT,
    "jobStatus" "public"."JobStatus" NOT NULL,
    "profilePictureUrl" TEXT,
    "jobReadinessScore" DOUBLE PRECISION,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Education" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "degree" TEXT,
    "fieldOfStudy" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canonicalName" TEXT,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileSkill" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "public"."SkillLevel" NOT NULL,
    "yearsExperience" INTEGER DEFAULT 0,

    CONSTRAINT "ProfileSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT,
    "revenueEstimate" DOUBLE PRECISION,
    "registrationStatus" TEXT,
    "needsSupport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requiredSkills" JSONB,
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "salaryRange" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL,
    "score" DOUBLE PRECISION,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillDemand" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "demandCount" INTEGER NOT NULL,

    CONSTRAINT "SkillDemand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationReminder" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reminderSentAt" TIMESTAMP(3),
    "nextDueAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT,

    CONSTRAINT "VerificationReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "YouthProfile_userId_key" ON "public"."YouthProfile"("userId");

-- CreateIndex
CREATE INDEX "YouthProfile_location_idx" ON "public"."YouthProfile"("location");

-- CreateIndex
CREATE INDEX "YouthProfile_jobStatus_idx" ON "public"."YouthProfile"("jobStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "public"."Skill"("name");

-- CreateIndex
CREATE INDEX "ProfileSkill_skillId_idx" ON "public"."ProfileSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileSkill_profileId_skillId_key" ON "public"."ProfileSkill"("profileId", "skillId");

-- CreateIndex
CREATE INDEX "Job_postedAt_idx" ON "public"."Job"("postedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_profileId_key" ON "public"."Application"("jobId", "profileId");

-- CreateIndex
CREATE INDEX "SkillDemand_skillId_periodStart_periodEnd_idx" ON "public"."SkillDemand"("skillId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "VerificationReminder_profileId_nextDueAt_idx" ON "public"."VerificationReminder"("profileId", "nextDueAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "public"."PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "public"."PasswordResetToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."YouthProfile" ADD CONSTRAINT "YouthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileSkill" ADD CONSTRAINT "ProfileSkill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileSkill" ADD CONSTRAINT "ProfileSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Business" ADD CONSTRAINT "Business_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillDemand" ADD CONSTRAINT "SkillDemand_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationReminder" ADD CONSTRAINT "VerificationReminder_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."YouthProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
