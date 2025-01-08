"use server"

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { BookingFormData, bookingSchema } from "@/utils/schema";
import { formatDateTimeReadable } from "@/utils/dateFormatter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const getBookedTimesForAllDates = async (): Promise<Date[]> => {
    try {
        const bookings = await prisma.booking.findMany({
            select: {
                dateTime: true,
            },
        });
        return bookings.map((booking) => booking.dateTime)
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching booked times:", error.stack);
        } else {
            console.error("Error fetching booked times:", error);
        }
        throw new Error("Error fetching booked times");
    }
};

export const submitBookingAction = async (data: BookingFormData) => {
    try {
        const result = bookingSchema.safeParse(data);
        if (!result.success)
            throw new Error("Validation failed: " + result.error.errors.map(e => e.message).join(', '));

        const { name, email, guests, dateTime } = result.data;

        const booking = await prisma.booking.create({
            data: {
                name,
                email,
                guests: Number(guests),
                dateTime: new Date(dateTime),
            },
        });

        return { message: `Successfully booked a table at ${formatDateTimeReadable(dateTime)}`, booking: booking }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: 'You already have a booking. Would you like to update your booking?', booking: null };
            }
        }

        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.errors);
            return { message: 'Invalid input data.', booking: null };
        }

        return { message: 'An error occurred.', booking: null };
    }
};

export const updateBookingAction = async (data: BookingFormData) => {
    try {
        const result = bookingSchema.safeParse(data);
        if (!result.success)
            throw new Error("Validation failed: " + result.error.errors.map(e => e.message).join(', '));

        const { name, email, guests, dateTime } = result.data;
        const booking = await prisma.booking.upsert({
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
        });
        return { message: `Successfully booked a table at ${formatDateTimeReadable(dateTime)}`, booking: booking }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: 'You already have a booking. Would you like to update your booking?', booking: null };
            }
        }

        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.errors);
            return { message: 'Invalid input data.', booking: null };
        }

        return { message: 'An error occurred.', booking: null };
    }
};


export const PaginationControls = async ({
    page,
    per_page,
    hasPrevPage,
    hasNextPage
}: {
    page: string | string[],
    per_page: string | string[],
    hasPrevPage: boolean,
    hasNextPage: boolean
}) => {
    const prevPage = Number(page) > 1 ? Number(page) - 1 : 1;
    const nextPage = Number(page) + 1;
    return (
        <>
            <div className="lg:w-1100 md:w-4/5 w-full space-x-1 md:m-auto mx-4 my-4">
                {hasPrevPage &&
                    <Link href={`?page=${prevPage}&per_page=${per_page}`}>
                        <Button>Previous</Button>
                    </Link>
                }
                {hasNextPage &&
                    <Link href={`?page=${nextPage}&per_page=${per_page}`}>
                        <Button>Next</Button>
                    </Link>
                }
            </div>
        </>
    )
}