-- DropIndex
DROP INDEX IF EXISTS "Applicant_rollNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_cycleId_rollNumber_key" ON "Applicant"("cycleId", "rollNumber");
