import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import LoginMessage from "@/app/_components/LoginMessage";
import { auth } from "@/app/_lib/auth";

async function Reservation({ cabin }) {
  const session = await auth();

  // Через Promise.all, чтобы не ожидать выполнения запросов поочередно.
  // Так запросы выполняются параллельно и общее время ожидания равно самому долгому запросу.
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="grid grid-cols-2 max-h-[400px]">
      <DateSelector
        settings={settings}
        cabin={cabin}
        bookedDates={bookedDates}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session?.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
