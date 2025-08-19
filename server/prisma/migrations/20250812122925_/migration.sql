-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerificationExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_emailVerificationToken_idx" ON "public"."User"("emailVerificationToken");

-- CreateIndex
CREATE INDEX "User_resetToken_idx" ON "public"."User"("resetToken");
