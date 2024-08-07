/*
  Warnings:

  - Added the required column `month` to the `DailyQuestionGroup` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `DailyQuestionGroup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "DailyQuestionGroup_day_idx";

-- DropIndex
DROP INDEX "DailyQuestionGroup_day_key";

-- AlterTable
ALTER TABLE "DailyQuestionGroup" ADD COLUMN     "month" INTEGER NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "month_day" ON "DailyQuestionGroup"("month", "day");
