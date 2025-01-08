import { Button } from "@/components/ui/button";
import { BookingProps } from "@/utils/schema";
import { UseFormHandleSubmit } from "react-hook-form";

interface SubmitProps {
    updateBooking: boolean;
    handleSubmit: UseFormHandleSubmit<BookingProps>;
    submitUpdate: (data: BookingProps) => void;
    onCancelUpdate: () => void;

}
export const Submit = ({ updateBooking, handleSubmit, submitUpdate, onCancelUpdate }: SubmitProps) => {
    return (
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
                    onClick={handleSubmit(onCancelUpdate)}>
                    No
                </Button>
            </>
                : <Button variant="outline" className="w-full sm:w-auto sm:!mt-2" type="submit">Book Table</Button>}
        </div>
    )
} 