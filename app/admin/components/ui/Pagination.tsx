import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Pagination as PaginationX } from "@/components/ui/pagination";

interface PaginationProps {
    page: string | string[];
    per_page: string | string[];
    hasPrevPage: boolean;
    hasNextPage: boolean;
}
export const Pagination = ({
    page,
    per_page,
    hasPrevPage,
    hasNextPage
}: PaginationProps) => {
    const prevPage = Number(page) > 1 ? Number(page) - 1 : 1;
    const nextPage = Number(page) + 1;
    return (
        <PaginationX>
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
        </PaginationX>
    )
}