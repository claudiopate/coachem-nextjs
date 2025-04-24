"use client";
import React from "react";
import { ChevronDownIcon } from "@/icons";
import ComponentCard from "./ComponentCard";
import Select from "./Select";
import Label from "./Label";

export default function SelectInputs() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Select Inputs">
      <div className="space-y-6">
        <div>
          <Label>Select Input</Label>
         <div className="relative">
           <Select
            options={options}
            placeholder="Select Option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
        </div>
      </div>
    </ComponentCard>
  );
}
