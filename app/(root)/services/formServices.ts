import { DateTime } from 'luxon';

export const filteredTimes = (times: string[], bookedTimes: Date[], date?: Date) => {
    return times.filter((time) => {
        const currentTime = DateTime.now().setZone('Europe/Stockholm'); // Get current time in Swedish time zone
        
        // Compare the time in the current date with the current time
        const [hour, minute] = time.split(":");
        
        // If a date is provided, use it; otherwise, use the current date
        const selectedTime = date ? DateTime.fromJSDate(date).setZone('Europe/Stockholm') : currentTime;
        
        // Set the time for the selected day (using the Swedish timezone)
        selectedTime.set({ hour: Number(hour), minute: Number(minute) });

        // Check if the selected time is already booked
        const isBooked = bookedTimes.some((bookingDate) => {
            // Convert the booking date to Swedish time zone (Europe/Stockholm)
            const bookingDateTime = DateTime.fromJSDate(bookingDate).setZone('Europe/Stockholm');
            
            // Compare only the date part (ignore time zone differences for the date)
            const bookingDateOnly = bookingDateTime.toISODate(); // Get 'YYYY-MM-DD'
            const selectedDateOnly = selectedTime.toISODate();   // Get 'YYYY-MM-DD'

            if (bookingDateOnly === selectedDateOnly) {
                // If dates match, compare times
                return bookingDateTime.toMillis() === selectedTime.toMillis();
            }
            return false;
        });

        // Only include times that are not booked and are in the future
        return !isBooked && selectedTime > currentTime;
    });
}
