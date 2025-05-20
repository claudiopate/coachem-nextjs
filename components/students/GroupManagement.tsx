"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  level?: string;
  availability: {
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
  }[];
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [newGroupName, setNewGroupName] = useState('');

  const createNewGroup = () => {
    if (!newGroupName.trim()) return;
    
    setGroups(prev => [...prev, {
      id: crypto.randomUUID(),
      name: newGroupName,
      students: []
    }]);
    setNewGroupName('');
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    // Handle moving between unassigned and groups
    if (sourceId === 'unassigned') {
      const student = unassignedStudents[source.index];
      const newUnassigned = [...unassignedStudents];
      newUnassigned.splice(source.index, 1);
      setUnassignedStudents(newUnassigned);

      if (destId !== 'unassigned') {
        setGroups(prev => prev.map(group => {
          if (group.id === destId) {
            return {
              ...group,
              students: [...group.students, student]
            };
          }
          return group;
        }));
      }
    } else {
      // Handle moving between groups
      const sourceGroup = groups.find(g => g.id === sourceId);
      const student = sourceGroup?.students[source.index];

      if (!student) return;

      setGroups(prev => prev.map(group => {
        if (group.id === sourceId) {
          const newStudents = [...group.students];
          newStudents.splice(source.index, 1);
          return { ...group, students: newStudents };
        }
        if (group.id === destId) {
          return {
            ...group,
            students: [...group.students, student]
          };
        }
        return group;
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Input
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={createNewGroup}>Create Group</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Students</CardTitle>
            </CardHeader>
            <Droppable droppableId="unassigned">
              {(provided) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] bg-gray-50 rounded-lg p-4"
                >
                  {unassignedStudents.map((student, index) => (
                    <Draggable
                      key={student.id}
                      draggableId={student.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 mb-2 rounded shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{student.firstName} {student.lastName}</p>
                              {student.level && (
                                <Badge variant="outline" className="mt-1">
                                  Level: {student.level}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          {groups.map(group => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {group.students.length} / 4 students
                </p>
              </CardHeader>
              <Droppable droppableId={group.id}>
                {(provided) => (
                  <CardContent
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] bg-gray-50 rounded-lg p-4"
                  >
                    {group.students.map((student, index) => (
                      <Draggable
                        key={student.id}
                        draggableId={student.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-2 rounded shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{student.firstName} {student.lastName}</p>
                                {student.level && (
                                  <Badge variant="outline" className="mt-1">
                                    Level: {student.level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 