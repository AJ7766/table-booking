"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatSwedishDateTime } from "@/utils/dateFormatter"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { deleteBooking, toggleBooking } from "./bookingActions"

export function ToggleDropdownItem({ id, canceled }: { id: number, canceled: boolean }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return (
        <DropdownMenuItem disabled={isPending} onClick={() =>
            startTransition(async () => {
                toggleBooking(id, canceled);
                router.refresh()
            })
        }> {canceled ? 'Activate' : 'Cancel'}
        </DropdownMenuItem>
    )
}

export function DeleteDropdownItem({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return (
        <DropdownMenuItem className="hover:!bg-red-500 hover:!text-white" disabled={isPending} onClick={() =>
            startTransition(async () => {
                deleteBooking(id);
                router.refresh()
            })
        }> Delete
        </DropdownMenuItem>
    )
}

export const CalendarFilter = () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const router = useRouter()

    useEffect(() => {
        if (date === undefined) {
            // If no date is selected, remove the 'date' query parameter from the URL
            const currentSearchParams = new URLSearchParams(window.location.search);
            currentSearchParams.delete("date"); // Remove the 'date' parameter
            router.push(`?${currentSearchParams.toString()}`, undefined);
            return;
        }
        const formattedDate = formatSwedishDateTime(date); // 'YYYY-MM-DD' format
        const currentSearchParams = new URLSearchParams(window.location.search);
        currentSearchParams.set("date", formattedDate.toString());
        console.log(currentSearchParams)
        router.push(`?${currentSearchParams.toString()}`, undefined);
    }, [date, router])

    return <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className="dark:outline-none outline outline-1 outline-slate-300">Date</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <Calendar
                className="rounded-md border"
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                    if (selectedDate === date) {
                        setDate(undefined);
                    } else {
                        setDate(selectedDate);
                    }
                }}
            />
        </PopoverContent>
    </Popover>
}