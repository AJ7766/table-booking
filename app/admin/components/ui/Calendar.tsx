"use client"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarX } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const Calendar = () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const router = useRouter()

    useEffect(() => {
        // if no date is selected, remove the 'date' query parameter from the URL
        // else we push the new date to the params and push to re-fetch
        if (date === undefined) {
            const currentSearchParams = new URLSearchParams(window.location.search);
            currentSearchParams.delete("date");
            router.push(`?${currentSearchParams.toString()}`);
            return;
        }
        const currentSearchParams = new URLSearchParams(window.location.search);
        currentSearchParams.set("date", date.toString());
        router.push(`?${currentSearchParams.toString()}`);
    }, [date, router])

    return <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className="dark:outline-none outline outline-1 outline-slate-300">Date</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <CalendarX
                className="rounded-md border"
                mode="single"
                selected={date}
                onSelect={setDate}
            />
        </PopoverContent>
    </Popover>
}