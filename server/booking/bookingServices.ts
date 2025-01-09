import { DateTime } from "luxon";

export const filterDatesService = async (date?: string | string[]) => {
    let filters: { gte: Date; lt: Date } | undefined;

    if (date) {
        const selectedDate = new Date(Array.isArray(date) ? date[0] : date);
        if (isNaN(selectedDate.getTime())) {
            throw new Error(`Invalid date format: ${date}`);
        }

        const swedishDate = DateTime.fromJSDate(selectedDate, { zone: 'utc' })
            .setZone('Europe/Stockholm', { keepLocalTime: false });

        // Set the start of the day (00:00) in the Swedish time zone
        const startOfDay = swedishDate.startOf('day').toJSDate();

        // Set the end of the day (23:59:59.999) in the Swedish time zone
        const endOfDay = swedishDate.endOf('day').toJSDate();

        filters = {
            gte: startOfDay,
            lt: endOfDay,
        };
    }
    return filters;
}