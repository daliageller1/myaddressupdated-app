import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      name: "Sarah Johnson",
      company: "Coldwell Banker",
      phone: "(555) 123-4567",
      rating: 4.8,
    },
  ]);
}
