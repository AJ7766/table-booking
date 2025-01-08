"use server"

import { BookingProps } from "@/utils/schema";
import { getBookingsController, postBookingController, updateBookingController } from "@/server/booking/bookingControllers";

export const handleSubmitBooking = async (data: BookingProps) => {
    return await postBookingController(data);
}

export const handleGetBookings = async () => {
    return await getBookingsController();
}

export const handleUpdateBooking = async (data: BookingProps) => {
    return await updateBookingController(data);
}