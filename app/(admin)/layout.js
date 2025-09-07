import { getAdmin } from "@/app/actions/admin";
import React from "react";
import Header from "@/components/Header";
import NotAdmin from "./admin/_components/NotAdmin";
import Sidebar from "./admin/_components/Sidebar";
import NavbarServer from "@/components/NavbarServer";
import PageWrapper from "@/components/utils/pageWrapper";

export const metadata = {
  title: "Admin | Gadi Ghar",
  description: "Admin dashboard for managing cars and test drives",
};

export default async function AdminLayout({ children }) {
  // Only allow ADMIN role to access Admin area
  let admin;
  try {
    admin = await getAdmin();
  } catch (e) {
    return <NotAdmin />;
  }

  if (!admin?.authorized) {
    return <NotAdmin />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:ml-0 pb-20 md:pb-0 animate-fade-in">
            <div className="p-6 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
}
