"use client";

import { useTransition } from "react";
import { updateBooking } from "../_lib/actions";
import SpinnerMini from "./SpinnerMini";

export default function UpdateBookingForm({ booking, maxCapacity, editId }) {
  const [isPending, startTransition] = useTransition();

  const { observations, numGuests } = booking;

  function handleUpdateBooking(formData) {
    startTransition(async () => {
      await updateBooking(formData);
    });
  }

  return (
    <form
      action={handleUpdateBooking}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          defaultValue={numGuests || ""}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          required
        >
          <option value="" key="">
            Select number of guests...
          </option>
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="observations">
          Anything we should know about your stay?
        </label>
        <textarea
          name="observations"
          defaultValue={observations || ""}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <input type="hidden" name="bookingId" value={editId} />

      <button
        disabled={isPending}
        className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 flex items-center justify-center gap-3 self-end rounded-sm"
      >
        {!isPending ? "Update reservation" : <SpinnerMini />}
      </button>
    </form>
  );
}
