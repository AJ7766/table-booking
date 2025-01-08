import { z } from "zod";

export type BookingProps = z.infer<typeof bookingSchema>;

export const bookingSchema = z.object({
    name: z.string().min(1, "Name is required").max(25, "Name cannot be longer than 25 characters"),
    email: z.string().email("Invalid email address").max(254, "Email cannot be longer than 254 characters"),
    guests: z
        .number()
        .min(1, "At least 1 guest is required")
        .max(8, "Maximum 8 guests"),
    dateTime: z
        .date()
        .refine((date) => date.getTime() > Date.now(), "Date and time must be in the future")
        .refine((date) => !isNaN(date.getTime()), "Invalid date")
});
