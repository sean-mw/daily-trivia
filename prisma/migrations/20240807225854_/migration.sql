/*
  Warnings:

  - Added the required column `year` to the `DailyQuestionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyQuestionGroup" ADD COLUMN     "year" INTEGER NOT NULL;
