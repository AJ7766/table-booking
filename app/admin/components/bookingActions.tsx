"use server"

import { prisma } from "@/lib/prisma";

export const getSearchParams = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    // Getting searchparams and returning the values
    const currSearchParams = await searchParams;
    const page = currSearchParams.page ?? '1'; // Get searchParams OR default to page 1 
    const per_page = currSearchParams.per_page ?? '10'; // -||- Default to 10 items per page
    const date = currSearchParams.date ?? '';

    const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10...
    const end = start + Number(per_page); // 5, 10, 15...
    return { page, per_page, start, end, date }
}

export const getBookings = async (start: number, end: number, date?: string | string[]) => {
    const filters: { dateTime?: { gte: Date; lt: Date } } = {};

    if (date) {
        const selectedDate = new Date(Array.isArray(date) ? date[0] : date);
        if (isNaN(selectedDate.getTime())) {
            throw new Error(`Invalid date format: ${date}`);
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        filters.dateTime = {
            gte: startOfDay,
            lt: endOfDay,
        };
    }
    const [bookings, totalBookings] = await Promise.all([
        prisma.booking.findMany({
            where: filters,
            skip: start,
            take: end - start,
            orderBy: {
                dateTime: 'asc',
            },
        }),
        prisma.booking.count()
    ]);

    return { bookings: bookings, totalBookings }
}

export const toggleBooking = async (id: number, canceled: boolean) => {
    try {
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                canceled: !canceled,
            },
        });

        return updatedBooking;
    } catch (error) {
        console.error("Error canceling booking:", error);
        throw new Error("Failed to cancel booking");
    }
}

export const deleteBooking = async (id: number) => {
    try {
        const booking = await prisma.booking.delete({
            where: { id },
        });

        return booking;
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw new Error("Failed to deleting booking");
    }
}