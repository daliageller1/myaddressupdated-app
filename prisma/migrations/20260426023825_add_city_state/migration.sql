-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "lastReminderSent" TIMESTAMP(3),
ADD COLUMN     "newCity" TEXT,
ADD COLUMN     "newState" TEXT,
ADD COLUMN     "oldCity" TEXT,
ADD COLUMN     "oldState" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExp" TIMESTAMP(3);
