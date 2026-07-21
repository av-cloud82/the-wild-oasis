"use server";

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(prevState, formData) {
  const session = await auth();

  if (!session) throw Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (nationalID) {
    const regex = /^[a-zA-Z0-9]{6,12}$/;
    if (!regex.test(nationalID))
      return { message: "You need to provide a valid NationalID" };
  }

  const updateData = { nationality, countryFlag, nationalID };

  const guestId = session.user.guestId;
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You need to be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thank-you");
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const guestBookings = (await getBookings(session.user.guestId)) || [];
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  const bookingId = Number(formData.get("bookingId"));
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You cannot update this booking");

  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function deleteBooking(bookingId) {
  const session = await auth();

  if (!session) throw new Error("You must log into your account");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You cannot delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
