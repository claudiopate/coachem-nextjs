"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Availability {
  startDate: Date | null;
  endDate: Date | null;
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
}

export function CreateStudent() {
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState("");
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const handleAddAvailability = () => {
    setAvailabilities([
      ...availabilities,
      {
        startDate: null,
        endDate: null,
        dayOfWeek: [],
        startTime: "09:00",
        endTime: "10:00"
      }
    ]);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const updateAvailability = (index: number, field: keyof Availability, value: any) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = {
      ...newAvailabilities[index],
      [field]: value
    };
    setAvailabilities(newAvailabilities);
  };

  const formatTimeForDB = (timeStr: string): string => {
    // Convert time string (HH:mm) to a simple time string
    return `${timeStr}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          level,
          coachId: params.profileId,
          availability: availabilities.map(a => ({
            dayOfWeek: a.dayOfWeek,
            startTime: formatTimeForDB(a.startTime),
            endTime: formatTimeForDB(a.endTime),
            startDate: a.startDate ? format(a.startDate, 'yyyy-MM-dd') : null,
            endDate: a.endDate ? format(a.endDate, 'yyyy-MM-dd') : null,
          }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create student");
      }

      toast({
        title: "Success",
        description: "Student created successfully",
      });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setLevel("");
      setAvailabilities([]);
    } catch (error) {
      console.error("Error creating student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Availability</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAvailability}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </div>

          {availabilities.map((availability, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !availability.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {availability.startDate ? (
                              format(availability.startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={availability.startDate || undefined}
                            onSelect={(date) =>
                              updateAvailability(index, "startDate", date)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !availability.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {availability.endDate ? (
                              format(availability.endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={availability.endDate || undefined}
                            onSelect={(date) =>
                              updateAvailability(index, "endDate", date)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={availability.startTime}
                        onChange={(e) =>
                          updateAvailability(index, "startTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={availability.endTime}
                        onChange={(e) =>
                          updateAvailability(index, "endTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day.value}
                            type="button"
                            variant={availability.dayOfWeek.includes(day.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newDays = availability.dayOfWeek.includes(day.value)
                                ? availability.dayOfWeek.filter((d) => d !== day.value)
                                : [...availability.dayOfWeek, day.value];
                              updateAvailability(index, "dayOfWeek", newDays);
                            }}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAvailability(index)}
                  className="ml-4"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Student"}
        </Button>
      </form>
    </Card>
  );
} 