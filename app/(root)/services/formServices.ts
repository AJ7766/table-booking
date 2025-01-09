import { DateTime } from "luxon";

export const filteredTimes = (times: string[], bookedTimes: Date[], date?: Date) => {
    return times.filter((time) => {
        const currentTime = DateTime.now().setZone('Europe/Stockholm');
        const [hour, minute] = time.split(":");
        const selectedTime = date ? date : currentTime.toJSDate();
        
        selectedTime.setHours(Number(hour), Number(minute), 0, 0);
        
        const isBooked = bookedTimes.some((bookingDate) => {
            const bookingDateOnly = bookingDate.toISOString().split('T')[0];
            const selectedDateOnly = selectedTime.toISOString().split('T')[0];

            if (bookingDateOnly === selectedDateOnly) {
                return bookingDate.getTime() === selectedTime.getTime();
            }
            return false;
        });
        const selectedDateTime = DateTime.fromJSDate(selectedTime).setZone('Europe/Stockholm');
        return !isBooked && selectedDateTime > currentTime;
    });
}
