import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreVertical } from "lucide-react"
import {  formatDateTimeReadable } from "@/utils/dateFormatter"
import { Pagination } from "./components/ui/Pagination"
import { getSearchParams } from "./services/tableServices"
import { handleGetFilteredBookings } from "./services/bookingHandlers"
import { ToggleCancelDropdownItem } from "./components/ui/ToggleCancelDropdownItem"
import { DeleteDropdownItem } from "./components/ui/DeleteDropdownItem"
import { Calendar } from "./components/ui/Calendar"

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    // We get searchParams if they exist, then we pass the values to get handled to get the bookings and totalBookings
    const { page, per_page, start, end, date } = await getSearchParams({ searchParams })
    const { bookings, totalBookings } = await handleGetFilteredBookings({ start, end, date });

    return (
        <>
            <main className="h-full w-full flex flex-col md:gap-5 gap-1 justify-center pt-10 md:px-10 px-0">
                <h1 className="md:m-0 text-xl mx-4 mt-4 mb-0">Bookings</h1>
                <div className="overflow-x-auto overflow-y-hidden">
                    <Table className="space-y-4 md:m-auto mx-4 my-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Guests</TableHead>
                                <TableHead><Calendar /></TableHead>
                                <TableHead>Canceled</TableHead>
                                <TableHead>Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="whitespace-nowrap">{booking.name}</TableCell>
                                    <TableCell className="whitespace-nowrap">{booking.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{booking.guests}</TableCell>
                                    <TableCell className="whitespace-nowrap">{formatDateTimeReadable(booking.dateTime)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{booking.canceled ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical />
                                                <span className="sr-only">Actions</span>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <ToggleCancelDropdownItem id={booking.id} canceled={booking.canceled} />
                                                <DeleteDropdownItem id={booking.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                        </TableFooter>
                    </Table >
                    {bookings.length < 1 && <div className="m-5">No bookings found</div>}
                </div>
                <Pagination
                    page={page}
                    per_page={per_page}
                    hasPrevPage={start > 1}
                    hasNextPage={end < totalBookings}
                />
            </main>
        </>
    )
}
