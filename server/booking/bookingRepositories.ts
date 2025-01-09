import { prisma } from "@/lib/prisma";
import { BookingProps } from "@/utils/schema";

interface BookingPerPageProps {
    filters?: {
        gte: Date;
        lt: Date;
    };
    start: number;
    end: number;
}

export const getBookings = async () => {
    return await prisma.booking.findMany();
}

export const getBookingsPerPage = async ({ filters, start, end }: BookingPerPageProps) => {
    // We get get a range of bookings if there are filters passed in
    // Skip the start amount like first 20, 30...
    // We take the inbetween like 10-20, 20-30...
    return prisma.booking.findMany({
        where: filters ? {
            dateTime: {
                gte: filters.gte,
                lt: filters.lt,
            }
        } : undefined,
        skip: start,
        take: end - start,
        orderBy: {
            dateTime: 'asc',
        },
    });
}

export const getBookingsCount = async (filters?: {
    gte: Date,
    lt: Date
}) => {
    return prisma.booking.count({
        where: filters ? {
            dateTime: {
                gte: filters.gte,
                lt: filters.lt,
            },
        } : undefined,
    });
}

export const postBooking = async ({ data }: { data: BookingProps }) => {
    const { name, email, guests, dateTime } = data
    return await prisma.booking.create({
        data: {
            name,
            email,
            guests: Number(guests),
            dateTime: dateTime,
        },
    })
}

export const updateBooking = async ({ data }: { data: BookingProps }) => {
    const { name, email, guests, dateTime } = data;
    // Upsert to see if there is a existing email and updating it else create new
    return await prisma.booking.upsert({
        where: { email },
        update: {
            name,
            guests: Number(guests),
            dateTime: new Date(dateTime),
        },
        create: {
            name,
            email,
            guests: Number(guests),
            dateTime: new Date(dateTime),
        },
    })
}

export const updateCancel = async (id: number, canceled: boolean) => {
    return await prisma.booking.update({
        where: { id },
        data: {
            canceled: !canceled,
        },
    })
}

export const deleteBooking = async (id: number) => {
    return await prisma.booking.delete({
        where: { id },
    });
}