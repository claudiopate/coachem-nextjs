import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard page',
  }

export default function Dashboard() {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-12">
            <div className="space-y-6">
              <ComponentCard title="Schedule for the day">
                <BasicTableOne />
              </ComponentCard>
            </div>
          </div>
        </div>
      )
}
