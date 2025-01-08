"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { submitBookingAction, updateBookingAction } from "../actions/formActions";
import { BookingFormData, bookingSchema } from "@/utils/schema";
import { formatDateTime } from "@/utils/dateFormatter";

const times = [
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export const BookingForm = ({ bookedTimes }: { bookedTimes: Date[] }) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>(times[0]);
    const [updateBooking, setUpdateBooking] = useState(false);
    const [message, setMessage] = useState('');

    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    useEffect(() => {
        if (date && selectedTime) {
            setValue("dateTime", formatDateTime(date, selectedTime));
            console.log(formatDateTime(date, selectedTime))
        }
    }, [date, selectedTime, setValue]);


    const availableTimes = times.filter((time) => {
        const currentTime = new Date();
        // Compare the time in the current date with the current time
        const [hour, minute] = time.split(":");
        const selectedTime = date ? date : new Date();
        selectedTime.setHours(Number(hour), Number(minute), 0, 0); // Set the time for the selected day
        // Check if the selected time is already booked
        const isBooked = bookedTimes.some((bookingDate) => {
            // Compare the date part of the booking time with selected date
            const bookingDateOnly = bookingDate.toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD'
            const selectedDateOnly = selectedTime.toISOString().split('T')[0]; // Extract selected date in 'YYYY-MM-DD'

            if (bookingDateOnly === selectedDateOnly) {
                // If dates match, compare times
                return bookingDate.getTime() === selectedTime.getTime();
            }
            return false;
        });
        // Only include times that are not booked and are in the future
        return !isBooked && selectedTime > currentTime;
    });


    const submitBooking = async (data: BookingFormData) => {
        setMessage('')
        const { message, booking } = await submitBookingAction(data);
        setMessage(message);
        if (message === 'You already have a booking. Would you like to update your booking?') {
            setUpdateBooking(true);
            return;
        }
        else if (!booking) {
            return;
        }
        resetForm();
    };

    const submitUpdate = async (data: BookingFormData) => {
        setMessage('')
        const { message, booking } = await updateBookingAction(data);
        setMessage(message);
        if (!booking)
            return;
        setUpdateBooking(false);
        resetForm();
    }

    const submitNo = async () => {
        setUpdateBooking(false);
        setMessage('');
        resetForm();
    }

    const resetForm = () => {
        setDate(new Date())
        setSelectedTime(times[0])
        reset({
            name: '',
            email: '',
            guests: 1,
            dateTime: new Date()
        });
    }

    return (
        <form onSubmit={handleSubmit(submitBooking)} className="lg:w-800 md:w-4/5 w-full space-y-4 md:m-auto mx-4 my-4">
            <div>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Your Name" />
                {errors.name && <span className="text-error">{errors.name.message}</span>}
            </div>
            <div>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="Your Email" />
                {errors.email && <span className="text-error">{errors.email.message}</span>}
            </div>
            <div>
                <Label>Guests</Label>
                <Select
                    value={typeof watch('guests') === 'undefined' ? undefined : watch('guests').toString()}
                    onValueChange={(value) => setValue('guests', Number(value))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the amount of guests" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(8).keys()].map((i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1} Guest{(i + 1) > 1 ? "s" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.guests && <span className="text-error">{errors.guests.message}</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-4">
                <Calendar mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={new Date()}
                    className="rounded-md border"
                    disabled={(selectedDate) => {
                        // Get today's date and normalize it to midnight
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // Calculate the fixed two weeks ahead from today
                        const threeWeeksAhead = new Date(today);
                        threeWeeksAhead.setDate(today.getDate() + 21);

                        // Normalize selectedDate to midnight for comparison
                        const normalizedSelectedDate = new Date(selectedDate);
                        normalizedSelectedDate.setHours(0, 0, 0, 0);

                        // Ensure only today and the next two weeks are selectable
                        return normalizedSelectedDate < today || normalizedSelectedDate > threeWeeksAhead;
                    }}
                />
                <div className="grid grid-cols-4 gap-4 sm:ml-4 items-center content-center">
                    {availableTimes.length > 1 ? availableTimes.map((time) => (
                        <Button
                            type="button"
                            variant='outline'
                            className={`text-black rounded-lg bg-gray-100 hover:bg-gray-200 focus:bg-slate-900 focus:text-white dark:text-white ${selectedTime === time && 'bg-slate-900 dark:focus:bg-transparent text-white dark:border-2 dark:!border-slate-400'}`}
                            key={time}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </Button>
                    )) : <span className="whitespace-nowrap">No times available</span>}
                </div>
                {errors.dateTime && <span className="text-error">{errors.dateTime.message}</span>}
            </div>
            {message && <div><span className="text-blue-600">{message}</span></div>}
            <div className="md:!mt-0 flex gap-1">
                {updateBooking ? <>
                    <Button
                        className="w-full bg-blue-600 dark:bg-blue-500 sm:w-auto sm:!mt-2"
                        onClick={handleSubmit(submitUpdate)}>
                        Update Booking
                    </Button>
                    <Button
                        className="w-full !bg-red-500 sm:w-auto sm:!mt-2"
                        type="button"
                        onClick={handleSubmit(submitNo)}>
                        No
                    </Button>
                </>
                    : <Button variant="outline" className="w-full sm:w-auto sm:!mt-2" type="submit">Book Table</Button>}
            </div>

        </form>
    );
};
