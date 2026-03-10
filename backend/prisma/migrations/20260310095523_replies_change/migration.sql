-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "replyToPostId" INTEGER;

-- CreateIndex
CREATE INDEX "Post_replyToPostId_idx" ON "Post"("replyToPostId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_replyToPostId_fkey" FOREIGN KEY ("replyToPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
