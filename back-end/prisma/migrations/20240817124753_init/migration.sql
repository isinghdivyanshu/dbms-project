-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('DAY_SCHOLAR', 'GIRLS_HOSTEL', 'BOYS_HOSTEL');

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "teamname" TEXT NOT NULL,
    "inOutStatus" BOOLEAN NOT NULL,
    "inOutUpdateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accommodationType" "AccommodationType" NOT NULL DEFAULT 'DAY_SCHOLAR',
    "block" VARCHAR(15),

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventParticipantId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToManager" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToEventParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_username_key" ON "Manager"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventname_key" ON "Event"("eventname");

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_regno_key" ON "EventParticipant"("regno");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToManager_AB_unique" ON "_EventToManager"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToManager_B_index" ON "_EventToManager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToEventParticipant_AB_unique" ON "_EventToEventParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToEventParticipant_B_index" ON "_EventToEventParticipant"("B");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_eventParticipantId_fkey" FOREIGN KEY ("eventParticipantId") REFERENCES "EventParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToManager" ADD CONSTRAINT "_EventToManager_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToManager" ADD CONSTRAINT "_EventToManager_B_fkey" FOREIGN KEY ("B") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventParticipant" ADD CONSTRAINT "_EventToEventParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventParticipant" ADD CONSTRAINT "_EventToEventParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "EventParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
