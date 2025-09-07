import PageWrapper from "@/components/utils/pageWrapper";

export const metadata = {
  title: {
    default: "Dealership",
    template: "%s | Dealership | Gadi Ghar",
  },
};

export default function DealershipGroupLayout({ children }) {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </PageWrapper>
  );
}


