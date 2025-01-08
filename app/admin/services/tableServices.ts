export const getSearchParams = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    // Getting searchParams and returning the values
    const currSearchParams = await searchParams;
    const page = currSearchParams.page ?? '1'; // if 'page' in params otherwise default '1'
    const per_page = currSearchParams.per_page ?? '10'; // if 'per_page' in params otherwise default '10'
    const date = currSearchParams.date ?? ''; // if 'date' in params otherwise default ''

    const start = (Number(page) - 1) * Number(per_page); // Calculate start of the page 0, 5, 10...
    const end = start + Number(per_page); // Calculate end of the page 5, 10 ,15...
    return { page, per_page, start, end, date }
}