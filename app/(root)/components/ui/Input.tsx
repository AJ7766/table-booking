import { Input as FormInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingProps } from "@/utils/schema";
import { UseFormRegister } from "react-hook-form";

interface InputProps {
    label: string;
    name: keyof BookingProps;
    placeholder: string;
    error?: string;
    register: UseFormRegister<BookingProps>;
}

export const Input = ({ label, register, name, placeholder, error }: InputProps) => (
    <div>
        <Label>{label}</Label>
        <FormInput {...register(name)} placeholder={placeholder} />
        {error && <span className="text-error">{error}</span>}
    </div>
);