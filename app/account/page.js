import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  const userName = session.user.name.split(" ").at(0);

  return <h1>Welcom, {userName}</h1>;
}
