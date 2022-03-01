/*
  Warnings:

  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `groupId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "userId" BIGINT NOT NULL,
ALTER COLUMN "groupId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "groupId" BIGINT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
