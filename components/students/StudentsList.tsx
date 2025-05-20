"use client";

import { useEffect, useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from 'next/navigation';
import { Mail, UserMinus, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  phone?: string;
  level?: string;
  preferredSport?: string;
  group?: {
    id: string;
    name: string;
    level?: string;
  };
  availability: {
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
    startDate?: string | null;
    endDate?: string | null;
  }[];
}

export function StudentsList() {
  const params = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentToDisconnect, setStudentToDisconnect] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/coach-profile/${params.profileId}`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const { data } = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [params.profileId]);

  const handleDisconnectStudent = async (student: Student) => {
    try {
      const response = await fetch(`/api/coach-profile/${params.profileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student.id),
      });

      if (!response.ok) throw new Error('Failed to disconnect student');

      toast({
        title: "Success",
        description: `${student.firstName} ${student.lastName} has been disconnected`,
      });

      // Refresh the students list
      fetchStudents();
    } catch (error) {
      console.error('Error disconnecting student:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect student",
      });
    }
  };

  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day - 1];
  };

  const filteredStudents = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return students.filter(student => 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTermLower) ||
      student.email?.toLowerCase().includes(searchTermLower)
    );
  }, [students, searchTerm]);

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="w-full max-w-md">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          // Actual student cards
          filteredStudents.map((student) => (
            <Card key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12 bg-blue-100">
                  <AvatarImage src={student.image} />
                  <AvatarFallback className="text-blue-600 font-medium">
                    {student.firstName[0]}{student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {student.firstName} {student.lastName}
                      </h3>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                          <AlertDialogHeader className="bg-white dark:bg-gray-900">
                            <AlertDialogTitle className="text-xl text-gray-900 dark:text-gray-100">Disconnetti Studente</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                              Sei sicuro di voler disconnettere <span className="font-medium text-gray-900 dark:text-gray-200">{student.firstName} {student.lastName}</span>? Questa azione non può essere annullata.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3">
                            <AlertDialogCancel className="mt-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                              Annulla
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDisconnectStudent(student)}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                            >
                              Disconnetti
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {student.group && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {student.group.name}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    {student.availability && student.availability.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Availability</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {student.availability.map((slot, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {slot.dayOfWeek.map(day => getDayName(day)[0]).join(',')} {slot.startTime}-{slot.endTime}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No students found matching your search.
          </p>
        </div>
      )}
    </div>
  );
} 