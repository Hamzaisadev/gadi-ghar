import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Team | Dealership",
  description: "Manage your team members",
};

export default function TeamComingSoonPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <p className="text-lg font-medium">Coming soon</p>
            <p className="text-muted-foreground">Team management will be available shortly.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


