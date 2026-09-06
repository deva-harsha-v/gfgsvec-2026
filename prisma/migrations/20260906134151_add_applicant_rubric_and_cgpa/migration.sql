/*
  Warnings:

  - You are about to drop the column `interviewRating` on the `Applicant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SuitabilityStatus" AS ENUM ('YES', 'NO', 'UNDECIDED');

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "interviewRating",
ADD COLUMN     "attendanceScannedAt" TIMESTAMP(3),
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "cgpa" DOUBLE PRECISION,
ADD COLUMN     "interviewNonTechnicalRating" INTEGER,
ADD COLUMN     "interviewSlot" TEXT,
ADD COLUMN     "interviewTechnicalRating" INTEGER,
ADD COLUMN     "ratingCommunication" INTEGER,
ADD COLUMN     "ratingConfidence" INTEGER,
ADD COLUMN     "ratingGrowthMindset" INTEGER,
ADD COLUMN     "ratingLeadership" INTEGER,
ADD COLUMN     "ratingProblemSolving" INTEGER,
ADD COLUMN     "ratingTeamFit" INTEGER,
ADD COLUMN     "ratingTechnicalSkills" INTEGER,
ADD COLUMN     "suitableForNonTechnical" "SuitabilityStatus",
ADD COLUMN     "suitableForTechnical" "SuitabilityStatus";
