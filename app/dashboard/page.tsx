export const dynamic = "force-dynamic";
export const revalidate = 0;

import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  console.log("🔥 DASHBOARD SERVER RUNNING");

  return <DashboardClient />;
}
