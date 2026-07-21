import { getBooking, getCabin } from "@/app/_lib/data-service";
import UpdateBookingForm from "@/app/_components/UpdateBookingForm";

export default async function Page({ params }) {
  const booking = await getBooking(params.editId);
  const { cabinId } = booking;

  const cabin = await getCabin(cabinId);
  const { maxCapacity } = cabin;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Booking #{params.editId}
      </h2>

      <UpdateBookingForm
        booking={booking}
        maxCapacity={maxCapacity}
        editId={params.editId}
      />
    </div>
  );
}
