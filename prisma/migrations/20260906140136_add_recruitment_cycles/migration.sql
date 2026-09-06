-- CreateEnum
CREATE TYPE "RecruitmentCycleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'SINGLE_SELECT', 'MULTI_SELECT', 'CHECKBOX', 'FILE_UPLOAD', 'RATING');

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "cycleId" TEXT,
ADD COLUMN     "responses" JSONB,
ALTER COLUMN "hasPastExperience" SET DEFAULT false,
ALTER COLUMN "reasonForJoining" DROP NOT NULL,
ALTER COLUMN "reasonForJoining" SET DEFAULT '',
ALTER COLUMN "contribution" DROP NOT NULL,
ALTER COLUMN "contribution" SET DEFAULT '',
ALTER COLUMN "clubKnowledge" DROP NOT NULL,
ALTER COLUMN "clubKnowledge" SET DEFAULT '';

-- CreateTable
CREATE TABLE "RecruitmentCycle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "posterImageUrl" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "status" "RecruitmentCycleStatus" NOT NULL DEFAULT 'DRAFT',
    "opensAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "fieldType" "FieldType" NOT NULL,
    "options" TEXT[],
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruitmentCycle_slug_key" ON "RecruitmentCycle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormField_cycleId_fieldKey_key" ON "FormField"("cycleId", "fieldKey");

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "RecruitmentCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "RecruitmentCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
