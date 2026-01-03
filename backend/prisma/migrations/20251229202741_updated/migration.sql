/*
  Warnings:

  - You are about to drop the column `content` on the `Retweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "quotedPostId" INTEGER;

-- AlterTable
ALTER TABLE "Retweet" DROP COLUMN "content";

-- CreateIndex
CREATE INDEX "Post_quotedPostId_idx" ON "Post"("quotedPostId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_quotedPostId_fkey" FOREIGN KEY ("quotedPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
