"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  level?: string;
  availability: {
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
  }[];
}

export function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={student.image} />
                  <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  {student.level && (
                    <Badge variant="outline" className="mt-1">
                      Level: {student.level}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Availability</h4>
                <div className="space-y-1">
                  {student.availability.map((slot, index) => (
                    <div key={index} className="text-sm">
                      {slot.dayOfWeek.map(day => getDayName(day)).join(', ')}:{' '}
                      {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 