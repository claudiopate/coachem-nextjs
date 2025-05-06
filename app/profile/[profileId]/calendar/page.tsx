import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Lessons Calender"
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Lessons" />
      <Calendar />
    </div>
  );
}
