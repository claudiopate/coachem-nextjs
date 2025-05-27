"use client";
import Calendar from "@/components/calendar/Calendar";
import MobileCalendar from "@/components/calendar/MobileCalendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TodayLessonsSidebar from "@/components/calendar/TodayLessonsSidebar";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/context/profile/ProfileProvider";
import { useState, useEffect } from "react";
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    openModal();
  };

  const handleLessonUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100dvh]">
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
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-zinc-900">
      <div className="flex-none px-4 pt-safe">
        <PageBreadcrumb pageTitle="Lessons" />
      </div>
      
      <div className="flex-1 overflow-auto px-4 pb-safe">
        <div className={`h-full flex ${isMobileView ? 'flex-col' : 'flex-row'} gap-6`}>
          {/* Calendar section */}
          <div className={`${isMobileView ? 'flex-none' : 'flex-1'}`}>
            {isMobileView ? (
              <MobileCalendar 
                profileId={profileId}
                onDateSelect={setSelectedDate}
              />
            ) : (
              <Calendar 
                profileId={profileId} 
                selectedEvent={selectedEvent}
                isModalOpen={isOpen}
                onModalClose={closeModal}
                onEventClick={handleEventClick}
                onLessonUpdate={handleLessonUpdate}
              />
            )}
          </div>
          {/* Today's/Selected day lessons list */}
          <div className={`${isMobileView ? 'flex-1 min-h-0' : 'w-[350px]'}`}>
            <TodayLessonsSidebar 
              profileId={profileId} 
              onEventClick={handleEventClick}
              refreshTrigger={refreshTrigger}
              selectedDate={isMobileView ? selectedDate : undefined}
              onLessonUpdate={handleLessonUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 