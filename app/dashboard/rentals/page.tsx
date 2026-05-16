import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import RentalsClient from "./RentalsClient";

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;

  let initialCity = params.city || "";

  // If city not passed in, use move destination
  if (!initialCity) {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    const user = getUserFromToken(token);

    if (user?.userId) {
      const move =
        await prisma.move.findFirst({
          where: {
            userId: user.userId.toString(),
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (
        move?.newCity &&
        move?.newState
      ) {
        initialCity =
          `${move.newCity}, ${move.newState}`;
      }
    }
  }

  return (
    <RentalsClient
      initialCity={initialCity}
    />
  );
}
