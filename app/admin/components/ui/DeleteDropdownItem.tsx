"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handleDelete } from "../../services/bookingHandlers";

export function DeleteDropdownItem({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return (
        <DropdownMenuItem className="hover:!bg-red-500 hover:!text-white" disabled={isPending} onClick={() =>
            startTransition(async () => {
                handleDelete(id);
                router.refresh()
            })
        }> Delete
        </DropdownMenuItem>
    )
}