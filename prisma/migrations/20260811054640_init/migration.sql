-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'INTERVIEWED', 'SELECTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "interestedFields" TEXT[],
    "hasPastExperience" BOOLEAN NOT NULL,
    "pastExperience" TEXT,
    "previousWorkLinks" TEXT[],
    "reasonForJoining" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "clubKnowledge" TEXT NOT NULL,
    "resumePath" TEXT,
    "interviewPresented" BOOLEAN NOT NULL DEFAULT false,
    "interviewRating" INTEGER,
    "interviewNotes" TEXT,
    "applicationStatus" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_applicationId_key" ON "Applicant"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_rollNumber_key" ON "Applicant"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
