import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentsList } from "@/components/students/StudentsList";
import { GroupManagement } from "@/components/students/GroupManagement";
import { CreateStudent } from "@/components/students/CreateStudent";
import { GroupScheduling } from "@/components/students/GroupScheduling";

export default function StudentsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Students Management</h1>
      
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students List</TabsTrigger>
          <TabsTrigger value="create">Create Student</TabsTrigger>
          <TabsTrigger value="groups">Group Management</TabsTrigger>
          <TabsTrigger value="scheduling">Group Scheduling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students">
          <StudentsList />
        </TabsContent>
        
        <TabsContent value="create">
          <CreateStudent />
        </TabsContent>
        
        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>
        
        <TabsContent value="scheduling">
          <GroupScheduling />
        </TabsContent>
      </Tabs>
    </div>
  );
} 