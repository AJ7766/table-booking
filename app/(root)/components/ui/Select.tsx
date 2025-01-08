import { Label } from "@/components/ui/label";
import { Select as SelectForm, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingProps } from "@/utils/schema";
import { FieldErrors, UseFormWatch } from "react-hook-form";

interface SelectProps {
    watch: UseFormWatch<BookingProps>;
    handleValue: (key: keyof BookingProps, value: BookingProps[keyof BookingProps]) => void;
    errors: FieldErrors<BookingProps>;
}

export const Select = ({ watch, handleValue, errors }: SelectProps) => {
    return <div>
        <Label>Guests</Label>
        {/* Watch is like a reference in react-hook-form */}
        <SelectForm
            value={typeof watch('guests') === 'undefined' ? undefined : watch('guests').toString()}
            onValueChange={(value) => handleValue('guests', Number(value))}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select the amount of guests" />
            </SelectTrigger>
            <SelectContent>
                {/* Empty Array of 8 */}
                {[...Array(8).keys()].map((i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} Guest{(i + 1) > 1 ? "s" : ""}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectForm>
        {errors.guests && <span className="text-error">{errors.guests.message}</span>}
    </div>
}