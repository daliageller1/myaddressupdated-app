import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
// import { getUserFromToken } from "@/lib/auth";
// import { cookies } from "next/headers";

export async function GET(req: Request) {

/*
  const token = cookies().get("token")?.value;
  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
*/

  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const move = await prisma.move.findFirst({
      where: { userId: decoded.userId },
      include: {
        checklist: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!move) {
      return NextResponse.json({ move: null });
    }

    return NextResponse.json({ move });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
