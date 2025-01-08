import { Calendar as CalendarForm } from "@/components/ui/calendar";

interface CalendarProps {
    date?: Date;
    handleDate: (date: Date) => void;
}

export const Calendar = ({ date, handleDate }: CalendarProps) => {
    return (
        <CalendarForm
            mode="single"
            selected={date}
            onSelect={(selectedDate) => selectedDate && handleDate(selectedDate)}
            defaultMonth={new Date()}
            className="rounded-md border"
            disabled={(selectedDate) => {
                // Get todays date and set it to midnight
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Calculate the fixed 3 weeks ahead from today
                const threeWeeksAhead = new Date(today);
                threeWeeksAhead.setDate(today.getDate() + 21);

                // Set selected Date and set it to midnight
                selectedDate.setHours(0, 0, 0, 0);

                // Ensure only today and the next two weeks are selectable
                return selectedDate < today || selectedDate > threeWeeksAhead;
            }}
        />
    )
}