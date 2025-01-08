export const filteredTimes = (times: string[], bookedTimes: Date[], date?: Date) => {
    return times.filter((time) => {
        const currentTime = new Date();
        // Compare the time in the current date with the current time
        const [hour, minute] = time.split(":");
        const selectedTime = date ? date : new Date();
        selectedTime.setHours(Number(hour), Number(minute), 0, 0); // Set the time for the selected day
        // Check if the selected time is already booked
        const isBooked = bookedTimes.some((bookingDate) => {
            // Compare the date part of the booking time with selected date
            const bookingDateOnly = bookingDate.toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD'
            const selectedDateOnly = selectedTime.toISOString().split('T')[0]; // Extract selected date in 'YYYY-MM-DD'

            if (bookingDateOnly === selectedDateOnly) {
                // If dates match, compare times
                return bookingDate.getTime() === selectedTime.getTime();
            }
            return false;
        });
        // Only include times that are not booked and are in the future
        return !isBooked && selectedTime > currentTime;
    });
}
