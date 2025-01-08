import { DateTime } from "luxon";

export const formatSwedishDateTime = (date: Date) => {
    // Altering date to Swedish timezone
    const swedishDateTime = DateTime.fromJSDate(date).setZone('Europe/Stockholm');
    return swedishDateTime.toJSDate();
};

export const formatDateTime = (date: Date, selectedTime: string) => {
    // Joining Date and the selectedTime into a newDateObj
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const shallowDate = new Date(date);
    shallowDate.setHours(hours, minutes, 0, 0);

    return formatSwedishDateTime(shallowDate);
};

export const formatDateTimeReadable = (date: Date) => {
    // Converting Date into readable string
    return new Intl.DateTimeFormat('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date) + ' - ' + new Intl.DateTimeFormat('sv-SE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}