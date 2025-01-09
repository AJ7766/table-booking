"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { handleSubmitBooking, handleUpdateBooking } from "../services/formHandlers";
import { BookingProps, bookingSchema } from "@/utils/schema";
import { formatDateTime } from "@/utils/dateFormatter";
import { filteredTimes } from "../services/formServices";
import { Input } from "./ui/Input";
import { Calendar } from "./ui/Calendar";
import { Select } from "./ui/Select";
import { Time } from "./ui/Time";
import { Messages } from "./ui/Messages";
import { Submit } from "./ui/Submit";

const times = [
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export const BookingForm = ({ bookedTimes }: { bookedTimes: Date[] }) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>(times[0]);
    const [updateBooking, setUpdateBooking] = useState(false);
    const [message, setMessage] = useState('');

    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<BookingProps>({
        resolver: zodResolver(bookingSchema),
    });

    useEffect(() => {
        if (date && selectedTime) {
            setValue("dateTime", formatDateTime(date, selectedTime));
        }
    }, [date, selectedTime, setValue]);

    // We filter to get the availableTimes to render
    const availableTimes = filteredTimes(times, bookedTimes, date);

    const handleValue = (key: keyof BookingProps, value: BookingProps[keyof BookingProps]) => {
        setValue(key, value)
    }

    const handleDate = (date: Date) => {
        setDate(date);
    }

    const handleSelectedTime = (time: string) => {
        setSelectedTime(time);
    }

    const submitBooking = async (data: BookingProps) => {
        // Sending a server request to process submited data
        setMessage('')
        const { message, success } = await handleSubmitBooking(data);
        setMessage(message);
        if (message === 'You already have a booking. Would you like to update your booking?') {
            setUpdateBooking(true);
            return;
        }
        else if (!success) {
            return;
        }
        resetForm();
    };

    const submitUpdate = async (data: BookingProps) => {
        // Sending a server request to process submited data
        setMessage('')
        const { message, success } = await handleUpdateBooking(data);
        setMessage(message);

        if (!success)
            return;

        setUpdateBooking(false);
        resetForm();
    }

    const onCancelUpdate = async () => {
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
            <Input
                label="Name"
                register={register}
                name="name"
                placeholder="Your Name"
                error={errors.name?.message}
            />
            <Input
                label="Email"
                register={register}
                name="email"
                placeholder="Your Email"
                error={errors.email?.message}
            />
            <Select
                watch={watch}
                handleValue={handleValue}
                errors={errors}
            />
            <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-4">
                <Calendar
                    date={date}
                    handleDate={handleDate}
                />
                <Time
                    availableTimes={availableTimes}
                    selectedTime={selectedTime}
                    handleSelectedTime={handleSelectedTime}
                    errors={errors}
                />
            </div>
            {message && <Messages message={message} />}
            <Submit updateBooking={updateBooking} handleSubmit={handleSubmit} submitUpdate={submitUpdate} onCancelUpdate={onCancelUpdate} />
        </form>
    );
};