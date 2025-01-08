import { Button } from "@/components/ui/button";
import { BookingProps } from "@/utils/schema";
import { FieldErrors } from "react-hook-form";

interface TimeProps {
    availableTimes: string[];
    selectedTime?: string;
    handleSelectedTime: (time: string) => void;
    errors: FieldErrors<BookingProps>;
}
export const Time = ({ availableTimes, selectedTime, handleSelectedTime, errors }: TimeProps) => {
    return (<>
        <div className="grid grid-cols-4 gap-4 sm:ml-4 items-center content-center">
            {availableTimes.length >= 1 ? availableTimes.map((time) => (
                <Button
                    type="button"
                    variant='outline'
                    className={`text-black rounded-lg bg-gray-100 hover:bg-gray-200 focus:bg-blue-600 focus:text-white dark:text-white ${selectedTime === time && 'bg-blue-600 dark:focus:bg-transparent text-white dark:border-2 dark:!border-slate-400'}`}
                    key={time}
                    onClick={() => handleSelectedTime(time)}
                >
                    {time}
                </Button>
            )) : <span className="whitespace-nowrap">No times available</span>}
        </div>
        {errors.dateTime && <span className="text-error">{errors.dateTime.message}</span>}
    </>
    )
}