import { hashPassword } from "./hash";
import { BookingProps, bookingSchema } from "./schema";

export const formValidation = async (data: BookingProps) => {
    const result = bookingSchema.safeParse(data);

    if (!result.success)
        throw new Error("Validation failed: " + result.error.errors.map(e => e.message).join(', '));

    return result;
}

export const isValidPassword = async (password: string, hashedPassword: string) => {
    // Comparing the passwords
    return (await hashPassword(password)) === hashedPassword
}