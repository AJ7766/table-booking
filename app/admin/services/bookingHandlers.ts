"use server"

import { deleteBookingController, getFilteredBookingsController, updateCancelController } from "@/server/booking/bookingControllers";

interface FilteredBookingProps {
    start: number;
    end: number;
    date?: string | string[];
}

export const handleGetFilteredBookings = async ({ start, end, date }: FilteredBookingProps) => {
    const { bookings, totalBookings } = await getFilteredBookingsController({ start, end, date });
    return { bookings, totalBookings }
}

export const handleUpdateCancel = async (id: number, canceled: boolean) => {
    return await updateCancelController(id, canceled);
}

export const handleDelete = async (id: number) => {
    return await deleteBookingController(id);
}