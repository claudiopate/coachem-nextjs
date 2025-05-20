"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

interface Group {
  id: string;
  name: string;
  students: {
    id: string;
    firstName: string;
    lastName: string;
    availability: {
      dayOfWeek: number[];
      startTime: string;
      endTime: string;
    }[];
  }[];
}

interface ScheduleConfig {
  startDate: Date;
  endDate: Date;
  frequency: 'weekly' | 'biweekly';
  duration: number; // in minutes
}

export function GroupScheduling() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    startDate: new Date(),
    endDate: new Date(),
    frequency: 'weekly',
    duration: 60
  });

  const findBestTimeSlots = (group: Group) => {
    // Combine all students' availability
    const availabilityMap = new Map<string, number>();
    
    group.students.forEach(student => {
      student.availability.forEach(slot => {
        slot.dayOfWeek.forEach(day => {
          const key = `${day}-${slot.startTime}`;
          availabilityMap.set(key, (availabilityMap.get(key) || 0) + 1);
        });
      });
    });

    // Sort time slots by number of available students
    const sortedSlots = Array.from(availabilityMap.entries())
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count === group.students.length); // Only perfect matches

    return sortedSlots.map(([key]) => {
      const [day, time] = key.split('-');
      return { day: parseInt(day), time };
    });
  };

  const handleScheduleSubmit = async () => {
    if (!selectedGroup) return;
    
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) return;

    const bestSlots = findBestTimeSlots(group);
    // TODO: Implement API call to create lessons
  };

  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Group Lessons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Group</label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.students.length} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedGroup && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Calendar
                    mode="single"
                    selected={scheduleConfig.startDate}
                    onSelect={(date) => date && setScheduleConfig(prev => ({ ...prev, startDate: date }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Calendar
                    mode="single"
                    selected={scheduleConfig.endDate}
                    onSelect={(date) => date && setScheduleConfig(prev => ({ ...prev, endDate: date }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select
                    value={scheduleConfig.frequency}
                    onValueChange={(value: 'weekly' | 'biweekly') => 
                      setScheduleConfig(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={scheduleConfig.duration}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min={30}
                    step={15}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Best Available Time Slots</label>
                <div className="grid grid-cols-1 gap-2">
                  {groups.find(g => g.id === selectedGroup)?.students.map(student => (
                    <Card key={student.id}>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{student.firstName} {student.lastName}</span>
                          <div className="flex gap-1">
                            {student.availability.map((slot, index) => (
                              <Badge key={index} variant="outline">
                                {slot.dayOfWeek.map(day => getDayName(day)[0]).join(',')} {slot.startTime}-{slot.endTime}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button onClick={handleScheduleSubmit} className="w-full">
                Schedule Lessons
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 