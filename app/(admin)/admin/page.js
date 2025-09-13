import PageWrapper from "@/components/utils/pageWrapper";
import React from "react";

export const metadata = {
  title: "Admin | Gadi Ghar",
  description: "Admin dashboard for managing cars and test drives",
};

const AdminPage = () => {
  return (
    <PageWrapper className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to the admin dashboard. Use the navigation to manage your dealership.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Cars Management</h2>
            <p className="text-gray-600 mb-4">View and manage your car inventory</p>
            <a href="/admin/cars" className="text-blue-600 hover:underline">
              Go to Cars →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Dealerships</h2>
            <p className="text-gray-600 mb-4">Manage dealership applications and settings</p>
            <a href="/admin/dealerships" className="text-blue-600 hover:underline">
              Go to Dealerships →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 mb-4">Configure admin settings and preferences</p>
            <a href="/admin/settings" className="text-blue-600 hover:underline">
              Go to Settings →
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminPage;
