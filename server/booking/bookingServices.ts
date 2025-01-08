export const filterDatesService = async (date?: string | string[]) => {
    let filters: { gte: Date; lt: Date } | undefined;

    if (date) {
        const selectedDate = new Date(Array.isArray(date) ? date[0] : date);
        if (isNaN(selectedDate.getTime())) {
            throw new Error(`Invalid date format: ${date}`);
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        filters = {
            gte: startOfDay,
            lt: endOfDay,
        };
    }
    return filters;
}