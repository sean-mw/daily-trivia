/*
  Warnings:

  - A unique constraint covering the columns `[month,day]` on the table `DailyQuestionGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_dailyQuestionGroupId_fkey";

-- DropIndex
DROP INDEX "month_day";

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestionGroup_month_day_key" ON "DailyQuestionGroup"("month", "day");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_dailyQuestionGroupId_fkey" FOREIGN KEY ("dailyQuestionGroupId") REFERENCES "DailyQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
