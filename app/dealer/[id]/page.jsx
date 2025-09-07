import { db } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const dealer = await db.dealershipInfo.findUnique({ where: { id: params.id } });
  return {
    title: dealer ? `${dealer.name} | Dealer` : "Dealer",
    description: dealer ? `View ${dealer.name} inventory and details` : "Dealer profile",
  };
}

export default async function PublicDealerPage({ params }) {
  const dealership = await db.dealershipInfo.findUnique({
    where: { id: params.id },
    include: { cars: true, workingHours: { orderBy: { dayOfWeek: "asc" } } },
  });

  if (!dealership) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">Dealer not found</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{dealership.name}</h1>
        <p className="text-muted-foreground">{dealership.address}</p>
        <p className="text-muted-foreground">{dealership.phone} • {dealership.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {dealership.workingHours.map((h) => (
            <div key={h.id} className="flex items-center justify-between">
              <span className="capitalize">{h.dayOfWeek.toLowerCase()}</span>
              <span className="text-muted-foreground">{h.isOpen ? `${h.openTime} - ${h.closeTime}` : "Closed"}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dealership.cars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative h-40 w-full bg-muted">
              {car.images?.[0] ? (
                <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill className="object-cover" />
              ) : null}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{car.make} {car.model}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {car.year} • PKR {Number(car.minPrice).toLocaleString()} - {Number(car.maxPrice).toLocaleString()}
            </CardContent>
          </Card>
        ))}
        {dealership.cars.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">No cars listed yet.</CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


