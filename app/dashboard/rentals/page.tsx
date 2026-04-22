import RentalsClient from "./RentalsClient";

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;
  const initialCity = params.city || "";

  return <RentalsClient initialCity={initialCity} />;
}
