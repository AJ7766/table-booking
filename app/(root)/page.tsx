import { getBookedTimesForAllDates } from "./actions/formActions";
import { BookingForm } from "./components/bookingForm";

export default async function Home() {
  const bookedTimesData = await getBookedTimesForAllDates();
  return (
    <main className="h-full flex pt-10">
      <BookingForm bookedTimes={bookedTimesData} />
    </main>
  );
}
