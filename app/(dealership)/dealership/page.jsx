"use client";
import DealerOverviewPage from "./_components/DealerOverviewPage";

export const metadata = {
  title: "Dashboard | Dealership",
  description: "Dealership dashboard overview",
};

export default async function DealershipAdminPage({ searchParams }) {
  // Get dealershipId from URL params if it exists (for admin view)
  const resolvedSearchParams = await searchParams;
  const dealershipId = resolvedSearchParams?.dealershipId || null;
  
  return <DealerOverviewPage dealershipId={dealershipId} />;
}
