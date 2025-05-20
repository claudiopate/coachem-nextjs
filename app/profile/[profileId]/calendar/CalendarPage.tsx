"use client";
import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TodayLessonsSidebar from "@/components/calendar/TodayLessonsSidebar";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/context/profile/ProfileProvider";
import { useState } from "react";
import { EventInput } from "@fullcalendar/core";

interface CalendarEvent extends EventInput {
  extendedProps: {
    type: "individual" | "group";
    coach: string;
    participants: Array<{
      id: string;
      name: string;
    }>;
    location?: string;
  };
}

interface CalendarPageProps {
  params: {
    profileId: string;
  };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { profileId } = params;
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { profile, loading, error } = useProfile();

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    openModal();
  };

  const handleLessonUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-gray-500">
        Profile not found
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <PageBreadcrumb pageTitle="Lessons" />
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Calendar section */}
        <div className="md:w-3/5 w-full">
          <Calendar 
            profileId={profileId} 
            selectedEvent={selectedEvent}
            isModalOpen={isOpen}
            onModalClose={closeModal}
            onEventClick={handleEventClick}
            onLessonUpdate={handleLessonUpdate}
          />
        </div>
        {/* Today's lessons list */}
        <div className="md:w-2/5 w-full">
          <TodayLessonsSidebar 
            profileId={profileId} 
            onEventClick={handleEventClick}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
} 