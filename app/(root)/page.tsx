import { BookingForm } from "./components/BookingFormX";
import { handleGetBookings } from "./services/formHandlers";

export default async function Home() {
  const bookedTimesData = await handleGetBookings();
  return (
    <main className="h-full flex pt-10">
      <BookingForm bookedTimes={bookedTimesData} />
    </main>
  );
}
