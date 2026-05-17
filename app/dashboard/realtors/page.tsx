import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import RealtorsClient from "./RealtorsClient";

export default async function RealtorsPage() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;

  const user = getUserFromToken(token);

  let city = "";

  if (user?.userId) {
    const move =
      await prisma.move.findFirst({
        where: {
          userId: String(user.userId),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (move) {
      city =
        `${move.newCity}, ${move.newState}`;
    }
  }

  return (
    <RealtorsClient
      defaultCity={city}
    />
  );
}
