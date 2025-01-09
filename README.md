## Short summary
-- It has dark / lightmode 😎
#User facing
-- Make a booking
-- Update their booking by entering their email again
-- A specific time in the day is limited to one table, which means only one person can book '01-02-2025 at 18.00' therefore I set the Date to @unique, for scalable purposes this can be adjusted
-- A user cant book a table if the time has past 'current time', example if current time is 18.32 the user cant book anything past 18.32
-- A user can only book 3 weeks ahead
#Admin facing
-- Logs in through a local account using Baisc Authentication, could make a Admin model in the database for scalable purposes
-- Cancel a booking, even tho if a table is booked it's already hidden on the client, toggling this won't really affect the client
-- Delete a booking, will make the deleted booking show up again on client
-- Pagination


## Install
npm install

## Start
npm run dev

## Login to Admin
"/admin" to login to admin dashboard

username: foodtel
password: foodtel