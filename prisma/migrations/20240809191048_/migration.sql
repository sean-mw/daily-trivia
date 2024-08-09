/*
  Warnings:

  - A unique constraint covering the columns `[day,month,year]` on the table `DailyQuestionGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyQuestionGroup_month_day_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestionGroup_day_month_year_key" ON "DailyQuestionGroup"("day", "month", "year");
