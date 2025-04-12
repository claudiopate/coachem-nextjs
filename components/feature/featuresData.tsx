// featuresData.ts
import { Feature } from "@/types/feature";
import { CalendarCheck, Users, MessageSquareText, BarChart, BellRing, CheckCircle } from "lucide-react";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: CalendarCheck,  // Lucide icon component
    title: "Smart Scheduling",
    description: "Easily plan and manage your lessons with drag & drop simplicity.",
  },
  {
    id: 2,
    icon: Users,  // Lucide icon component
    title: "Student Management",
    description: "Track presence, absences, and maintain full control over your class lists.",
  },
  {
    id: 3,
    icon: MessageSquareText,  // Lucide icon component
    title: "Instant Notifications",
    description: "Keep your clients updated with real-time alerts for changes or news.",
  },
  {
    id: 4,
    icon: BellRing,  // Lucide icon component
    title: "Attendance Tracking",
    description: "Never miss a session—monitor and log who shows up and who doesn't.",
  },
  {
    id: 5,
    icon: BarChart,  // Lucide icon component
    title: "Progress Insights",
    description: "Let your students see their training evolution with powerful data visuals.",
  },
  {
    id: 6,
    icon: CheckCircle,  // Lucide icon component
    title: "Ready-to-Use & Flexible",
    description: "Plug & play. Coachem adapts to your workflow, not the other way around.",
  },
];

export default featuresData;
