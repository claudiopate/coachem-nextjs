"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentsList } from "@/components/students/StudentsList";
import { GroupManagement } from "@/components/students/GroupManagement";
import { CreateStudent } from "@/components/students/CreateStudent";
import { GroupScheduling } from "@/components/students/GroupScheduling";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    { id: "students", label: "Students List" },
    { id: "create", label: "Create Student" },
    { id: "groups", label: "Group Management" },
    { id: "scheduling", label: "Group Scheduling" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Students Management</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Select */}
          <div className="block sm:hidden border-b border-gray-200 dark:border-gray-700 p-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map(tab => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700">
            <TabsList className="flex w-full p-2">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="students" className="mt-0">
              <StudentsList />
            </TabsContent>
            
            <TabsContent value="create" className="mt-0">
              <CreateStudent />
            </TabsContent>
            
            <TabsContent value="groups" className="mt-0">
              <GroupManagement />
            </TabsContent>
            
            <TabsContent value="scheduling" className="mt-0">
              <GroupScheduling />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 