-- AlterTable
ALTER TABLE "DailyQuestionGroup" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
