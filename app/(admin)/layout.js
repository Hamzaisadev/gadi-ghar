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
  const admin = await getAdmin();

  if (!admin.authorized) {
    return <NotAdmin />;
  }
  return (
    <PageWrapper>
      <div className="min-h-screen ">
        <NavbarServer isAdminPage={true} />
        <div className="flex h-full w-56 md:mt-12 mt-16 flex-col top-20 fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-56 pt-[80px]  h-full">{children}</main>
      </div>
    </PageWrapper>
  );
}
