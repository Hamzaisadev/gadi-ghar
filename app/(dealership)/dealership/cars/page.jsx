import DealerCarList from "./_components/DealerCarList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Cars | Dealership",
  description: "Manage your dealership inventory",
};

export default function DealershipCarsPage() {
  return <DealerCarList />;
}


