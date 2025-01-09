export const formatDateTime = (date: Date, selectedTime: string) => {
    // Joining Date and the selectedTime into a date-obj
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const shallowDate = new Date(date);
    shallowDate.setHours(hours, minutes, 0, 0);

    return shallowDate;
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