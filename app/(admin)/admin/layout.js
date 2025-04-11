import { getAdmin } from "@/app/actions/admin";
import React from "react";
import NotAdmin from "./_components/NotAdmin";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

const AdminPage = async () => {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return <NotAdmin />;
  }
  return (
    <div>
      <Header isAdminPage={true} />
    </div>
  );
};

export default AdminPage;
