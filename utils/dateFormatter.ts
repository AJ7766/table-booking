import { DateTime } from "luxon";

export const formatSwedishDateTime = (date: Date) => {
    // Altering date to Swedish timezone
    const swedishDateTime = DateTime.fromJSDate(date).setZone('Europe/Stockholm');
    return swedishDateTime.toISO();
};

export const formatDateTime = (date: Date, selectedTime: string) => {
    // Joining Date and the selectedTime into a date-obj
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const shallowDate = new Date(date);
    shallowDate.setHours(hours, minutes, 0, 0);

    return shallowDate;
};

export const formatDateTimeReadable = (date: Date) => {
    // Create a Date object in UTC
    const swedishDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }));

    // Format the date in Swedish locale
    const time = new Intl.DateTimeFormat('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(swedishDate);

    const dateStr = new Intl.DateTimeFormat('sv-SE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(swedishDate);

    return `${time} - ${dateStr}`;
};