import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentsList } from "@/components/students/StudentsList";
import { GroupManagement } from "@/components/students/GroupManagement";
import { CreateStudent } from "@/components/students/CreateStudent";
import { GroupScheduling } from "@/components/students/GroupScheduling";

export default function StudentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Students Management</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <Tabs defaultValue="students" className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <TabsList className="flex w-full space-x-2 p-2">
              <TabsTrigger 
                value="students"
                className="flex-1 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Students List
              </TabsTrigger>
              <TabsTrigger 
                value="create"
                className="flex-1 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Create Student
              </TabsTrigger>
              <TabsTrigger 
                value="groups"
                className="flex-1 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Group Management
              </TabsTrigger>
              <TabsTrigger 
                value="scheduling"
                className="flex-1 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Group Scheduling
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
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