"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CarList = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.PreventDefault();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cars</h1>
          <p className="text-muted-foreground">Manage your car inventory</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => router.push("/admin/cars/create")}
        >
          <Plus className="h-4 w-4" />
          Add New Car
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search for a car"
                className="pl-9 w-full sm:w-60 border-2"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarList;
