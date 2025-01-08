/*
  Warnings:

  - A unique constraint covering the columns `[dateTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_dateTime_key" ON "Booking"("dateTime");
