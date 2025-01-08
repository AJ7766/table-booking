"use client"
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handleUpdateCancel } from "../../services/bookingHandlers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ToggleCancelDropdownItem({ id, canceled }: { id: number, canceled: boolean }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return (
        <DropdownMenuItem disabled={isPending} onClick={() =>
            startTransition(async () => {
                handleUpdateCancel(id, canceled);
                router.refresh()
            })
        }> {canceled ? 'Activate' : 'Cancel'}
        </DropdownMenuItem>
    )
}