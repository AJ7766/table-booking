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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreVertical } from "lucide-react"
import { CalendarFilter, DeleteDropdownItem, ToggleDropdownItem } from "./components/bookingComponents"
import { getBookings, getSearchParams } from "./components/bookingActions"
import { formatDateTimeReadable } from "@/utils/dateFormatter"

const PaginationControlls = async ({
    page,
    per_page,
    hasPrevPage,
    hasNextPage
}: {
    page: string | string[],
    per_page: string | string[],
    hasPrevPage: boolean,
    hasNextPage: boolean
}) => {
    const prevPage = Number(page) > 1 ? Number(page) - 1 : 1;
    const nextPage = Number(page) + 1;
    return (
        <Pagination>
            <PaginationContent>
                {hasPrevPage &&
                    <PaginationItem>
                        <PaginationPrevious href={`?page=${prevPage}&per_page=${per_page}`} />
                    </PaginationItem>
                }
                {hasPrevPage &&
                    <PaginationItem>
                        <PaginationLink href={`?page=${prevPage}&per_page=${per_page}`}>{Number(page) - 1}</PaginationLink>
                    </PaginationItem>
                }
                <PaginationItem>
                    <PaginationLink className="bg-gray-100 dark:bg-transparent dark:!border dark:!border-slate-600">{page}</PaginationLink>
                </PaginationItem>
                {hasNextPage &&
                    <PaginationItem>
                        <PaginationLink href={`?page=${nextPage}&per_page=${per_page}`}>{Number(page) + 1}</PaginationLink>
                    </PaginationItem>
                }
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                {hasNextPage &&
                    <PaginationItem>
                        <PaginationNext href={`?page=${nextPage}&per_page=${per_page}`} />
                    </PaginationItem>
                }
            </PaginationContent>
        </Pagination>
    )
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { page, per_page, start, end, date } = await getSearchParams({ searchParams })
    const { bookings, totalBookings } = await getBookings(start, end, date); // Slicing bookings per page 0-5, 5-10...
    return (
        <main className="h-full w-full grid grid-cols-1 pt-10 md:px-10 px-0">
            <Table className="space-y-4 md:m-auto mx-4 my-4 overflow-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead><CalendarFilter /></TableHead>
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
                                        <ToggleDropdownItem id={booking.id} canceled={booking.canceled}/>
                                        <DeleteDropdownItem id={booking.id}/>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {bookings.length < 1 &&
                        <TableRow>
                            <TableCell>No bookings found</TableCell>
                        </TableRow>
                    }
                </TableBody>
                <TableFooter>
                </TableFooter>
            </Table >
            <PaginationControlls
                page={page}
                per_page={per_page}
                hasPrevPage={start > 1}
                hasNextPage={end < totalBookings}
            />
        </main>
    )
}
