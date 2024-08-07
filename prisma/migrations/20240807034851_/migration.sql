-- CreateTable
CREATE TABLE "DailyQuestionGroup" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "dailyQuestionGroupId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestionGroup_day_key" ON "DailyQuestionGroup"("day");

-- CreateIndex
CREATE INDEX "DailyQuestionGroup_day_idx" ON "DailyQuestionGroup"("day");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_dailyQuestionGroupId_fkey" FOREIGN KEY ("dailyQuestionGroupId") REFERENCES "DailyQuestionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
