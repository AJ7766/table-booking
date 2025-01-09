import { BookingProps } from "@/utils/schema";
import { deleteBooking, getBookings, getBookingsCount, getBookingsPerPage, postBooking, updateBooking, updateCancel } from "./bookingRepositories";
import { formatDateTimeReadable } from "@/utils/dateFormatter";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { formValidation } from "@/utils/validation";
import { filterDatesService } from "./bookingServices";

interface FilteredBookingProps {
    start: number;
    end: number;
    date?: string | string[];
}

interface BookingExtendedProps extends BookingProps {
    id: number;
    canceled: boolean
}

export const getBookingsController = async (): Promise<Date[]> => {
    try {
        const bookings = await getBookings();

        return bookings.map((booking) => booking.dateTime)
    } catch (error) {
        console.error("Unknown error fetching bookings", error instanceof Error && error.stack);
        throw new Error("Error fetching booked times");
    }
}

export const getFilteredBookingsController = async ({ start, end, date }: FilteredBookingProps): Promise<{ bookings: BookingExtendedProps[], totalBookings: number }> => {
// Get the filtered bookings per page and total bookings simultaneously using Promise.all
try {
        const filters = await filterDatesService(date);
        const [bookings, totalBookings] = await Promise.all([
            await getBookingsPerPage({
                filters,
                start,
                end,
            }), await getBookingsCount()
        ]);
        console.log("Bookings from filtered:", bookings)
        return { bookings: bookings, totalBookings }
    } catch (error) {
        console.error("Unknown error fetching filtered bookings", error instanceof Error && error.stack);
        throw new Error("Error fetching booked times");
    }
}

export const postBookingController = async (data: BookingProps) => {
    try {
        // In reality form validations should be in the middleware, but since this is not an API we do it at the start
        const result = await formValidation(data);

        await postBooking({ data: result.data })

        return { message: `Successfully booked a table at ${formatDateTimeReadable(result.data.dateTime)}`, success: true }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: 'You already have a booking. Would you like to update your booking?', success: false };
            }
        }

        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.errors);
            return { message: 'Invalid input data.', success: false };
        }

        console.error("Unknown error posting booking", error instanceof Error && error.stack);

        return { message: 'An error occurred.', success: false };
    }
}

export const updateBookingController = async (data: BookingProps) => {
    try {
        const result = await formValidation(data)

        await updateBooking({ data: result.data });
        return { message: `Successfully booked a table at ${formatDateTimeReadable(result.data.dateTime)}`, success: true }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { message: 'You already have a booking. Would you like to update your booking?', success: false };
            }
        }
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.errors);
            return { message: 'Invalid input data.', success: false };
        }

        console.error("Unknown error updating booking", error instanceof Error && error.stack);

        return { message: 'Unknown error updating booking', success: false };
    }
}

export const updateCancelController = async (id: number, canceled: boolean) => {
    try {
        const updatedBooking = await updateCancel(id, canceled);
        return updatedBooking;
    } catch (error) {
        console.error("Error canceling booking:", error);
        throw new Error("Failed to cancel booking");
    }
}

export const deleteBookingController = async (id: number) => {
    try {
        const response = await deleteBooking(id);
        return response;
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw new Error("Failed to deleting booking");
    }
}