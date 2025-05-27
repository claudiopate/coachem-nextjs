"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { RoleBasedAccess } from "../auth/RoleBasedAccess";
import { useAuthRole } from "@/context/auth/AuthRoleProvider";
import LessonModal from "./LessonModal";
import { useProfile } from "@/context/profile/ProfileProvider";
import { createClient } from "@/utils/supabase/client";
import "./Calendar.module.css";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import '@/styles/calendar.css';

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

interface CalendarProps {
  profileId: string;
  onEventsLoaded?: (events: CalendarEvent[]) => void;
  selectedEvent?: CalendarEvent | null;
  isModalOpen?: boolean;
  onModalClose?: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  onLessonUpdate?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  profileId, 
  onEventsLoaded,
  selectedEvent: externalSelectedEvent,
  isModalOpen: externalIsModalOpen,
  onModalClose: externalOnModalClose,
  onEventClick: externalOnEventClick,
  onLessonUpdate
}) => {
  // Utility functions
  const pad = (n: number) => n.toString().padStart(2, '0');
  const toLocalISOString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [lessonType, setLessonType] = useState<"individual" | "group">("individual");
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedProfilesGroup, setSelectedProfilesGroup] = useState<any[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const lastFetchId = useRef(0);
  const { role } = useAuthRole();
  const { profile } = useProfile();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<CalendarEvent | null>(null);
  const [internalRefreshTrigger, setInternalRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Define headerLeft before using it
  const headerLeft = "prev,next";

  // Add mobile view state
  const [isMobileView, setIsMobileView] = useState(false);

  // Add effect to handle window resize
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

  // Customize mobile view settings
  const mobileSettings = {
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const },
        dayHeaderFormat: { weekday: 'short' as const },
        fixedWeekCount: false,
        showNonCurrentDates: false
      },
      timeGridWeek: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const },
        dayHeaderFormat: { weekday: 'short' as const, month: 'numeric' as const, day: 'numeric' as const },
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00'
      },
      timeGridDay: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const },
        dayHeaderFormat: { weekday: 'long' as const, month: 'numeric' as const, day: 'numeric' as const },
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00'
      }
    },
    buttonText: {
      today: 'Oggi',
      month: 'Mese',
      week: 'Sett.',
      day: 'Giorno'
    }
  };

  // Customize desktop view settings
  const desktopSettings = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const },
        dayHeaderFormat: { weekday: 'short' as const },
        fixedWeekCount: false
      },
      timeGridWeek: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const },
        dayHeaderFormat: { weekday: 'short' as const, month: 'numeric' as const, day: 'numeric' as const },
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00'
      },
      timeGridDay: {
        titleFormat: { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const },
        dayHeaderFormat: { weekday: 'long' as const, month: 'numeric' as const, day: 'numeric' as const },
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00'
      }
    },
    buttonText: {
      today: 'Oggi',
      month: 'Mese',
      week: 'Sett.',
      day: 'Giorno'
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetModalFields();
    // Notify parent if they're interested
    if (externalOnModalClose) {
      externalOnModalClose();
    }
  };

  const handleModalOpen = () => {
    console.log("Opening modal"); // Debug log
    setShowModal(true);
  };

  // Effect to handle external event selection
  useEffect(() => {
    if (externalSelectedEvent) {
      handleEventSelection(externalSelectedEvent);
    }
  }, [externalSelectedEvent]);

  const handleEventSelection = (event: CalendarEvent) => {
    setIsEditing(true);
    setSelectedEvent(event);
    setEventTitle(event.title || '');
    
    const startDate = typeof event.start === 'string' ? new Date(event.start) : 
                     event.start instanceof Date ? event.start : new Date();
    const endDate = typeof event.end === 'string' ? new Date(event.end) :
                   event.end instanceof Date ? event.end : startDate;
    
    setEventStartDate(toLocalISOString(startDate));
    setEventEndDate(toLocalISOString(endDate));
    setLessonType(event.extendedProps.type);
    
    if (event.extendedProps.type === "group") {
      setSelectedProfilesGroup(event.extendedProps.participants || []);
    } else {
      setSelectedProfile(event.extendedProps.participants[0] || null);
    }
    handleModalOpen();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const calendarEvent = event as unknown as CalendarEvent;
    
    if (externalOnEventClick) {
      externalOnEventClick(calendarEvent);
    }
    handleEventSelection(calendarEvent);
  };

  const computeRange = (range: {start: Date, end: Date}) => {
    const start = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
    const end = new Date(range.end.getFullYear(), range.end.getMonth() + 1, 0);
    return { start, end };
  };

  // Funzione di confronto tra due range
  const isSameRange = (a: {start: Date, end: Date} | null, b: {start: Date, end: Date} | null) => {
    if (!a || !b) return false;
    return a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime();
  };

  const fetchLessons = async (start: Date, end: Date) => {
    if (!profile) return;
    
    const currentFetchId = ++lastFetchId.current;
    
    try {
      setIsFetchingEvents(true);
      setError(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Authentication error: Unable to fetch user data');
        return;
      }

      let url = `/api/profile/${user.id}/lessons?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });

      if (currentFetchId !== lastFetchId.current) {
        return;
      }

      if (!response.ok) {
        setError(`Failed to fetch lessons: ${response.statusText}`);
        return;
      }

      const lessons: CalendarEvent[] = await response.json();
      
      if (currentFetchId !== lastFetchId.current) {
        return;
      }

      setEvents(lessons);
      
      if (onEventsLoaded) {
        onEventsLoaded(lessons);
      }
    } catch (error) {
      if (currentFetchId !== lastFetchId.current) {
        return;
      }
      setError('Failed to fetch lessons. Please try again later.');
    } finally {
      if (currentFetchId === lastFetchId.current) {
        setIsFetchingEvents(false);
      }
    }
  };

  // Add effect to handle refresh trigger
  useEffect(() => {
    if (profile && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const start = calendarApi.view.activeStart;
      const end = calendarApi.view.activeEnd;
      fetchLessons(start, end);
    }
  }, [internalRefreshTrigger, profile]);

  const handleDatesSet = (arg: { start: Date; end: Date; }) => {
    if (!profile) return;
    const range = computeRange({ start: arg.start, end: arg.end });
    fetchLessons(range.start, range.end);
  };

  // Normalize events: ensure start/end are local ISO strings and allDay is false
  const eventsForCalendar = events.map(ev => {
    let start: Date;
    let end: Date;
    if (typeof ev.start === 'string' || typeof ev.start === 'number') {
      start = new Date(ev.start);
    } else if (ev.start instanceof Date) {
      start = ev.start;
    } else {
      start = new Date();
    }
    if (typeof ev.end === 'string' || typeof ev.end === 'number') {
      end = new Date(ev.end);
    } else if (ev.end instanceof Date) {
      end = ev.end;
    } else {
      end = new Date(start.getTime() + 60 * 60 * 1000); // default 1h duration if missing
    }
    return {
      ...ev,
      start: toLocalISOString(start),
      end: toLocalISOString(end),
      allDay: false
    };
  });

  // Debug: log the events passed to FullCalendar
  if (typeof window !== 'undefined') {
    console.log('Events for FullCalendar:', eventsForCalendar);
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log("Date selected"); // Debug log
    setIsEditing(false);
    resetModalFields();

    const startDate = selectInfo.start ? new Date(selectInfo.start) : new Date();
    const endDate = selectInfo.end ? new Date(selectInfo.end) : startDate;

    setEventStartDate(toLocalISOString(startDate));
    setEventEndDate(toLocalISOString(endDate));

    handleModalOpen();
  };

  const handleAddOrUpdateEvent = async () => {
    if (!profile) return;

    const selectedProfiles =
      lessonType === "individual" ? (selectedProfile ? [selectedProfile] : []) : selectedProfilesGroup;

    const newEvent: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: eventTitle || (lessonType === "individual" ? 
        `Individual Lesson with ${selectedProfile?.name}` :
        `Group Lesson: ${selectedProfilesGroup[0]?.name}`),
      start: eventStartDate,
      end: eventEndDate,
      allDay: false,
      extendedProps: {
        type: lessonType,
        coach: `${profile.firstName} ${profile.lastName}`,
        participants: selectedProfiles
      },
    };

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('No user available');
        return;
      }

      const calendarApi = calendarRef.current?.getApi();
      const currentView = calendarApi?.view;
      const start = currentView?.activeStart;
      const end = currentView?.activeEnd;

      if (!start || !end) {
        setError('Could not determine current calendar range');
        return;
      }

      const endpoint = isEditing 
        ? `/api/profile/${user.id}/lessons/${selectedEvent?.id}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
        : `/api/profile/${user.id}/lessons?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        setError('Failed to save lesson');
        return;
      }

      const savedLesson = await response.json();

      if (isEditing) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === selectedEvent?.id ? savedLesson : event))
        );
      } else {
        setEvents((prevEvents) => [...prevEvents, savedLesson]);
      }

      // Call onLessonUpdate after successful update
      if (onLessonUpdate) {
        onLessonUpdate();
      }

      handleModalClose();
      resetModalFields();
    } catch (error) {
      setError('Failed to save lesson. Please try again.');
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate(toLocalISOString(new Date()));  // Set to current date/time
    setEventEndDate(toLocalISOString(new Date(Date.now() + 60 * 60 * 1000)));  // Set to current date/time + 1 hour
    setSelectedEvent(null);
    setLessonType("individual");
    setSelectedProfile(null);
    setSelectedProfilesGroup([]);
    setIsEditing(false);
  };

  const isCoach = role === "coach";

  const handleDeleteClick = async (event: CalendarEvent) => {
    setLessonToDelete(event);
    setShowModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete || !profile) return;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('No user available');
        return;
      }

      const response = await fetch(`/api/profile/${user.id}/lessons/${lessonToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      // Remove the deleted lesson from the state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== lessonToDelete.id));
      
      // Trigger a refresh
      setInternalRefreshTrigger(prev => prev + 1);
      
      // Call onLessonUpdate after successful deletion
      if (onLessonUpdate) {
        onLessonUpdate();
      }

      setLessonToDelete(null);
    } catch (error) {
      setError('Failed to delete lesson. Please try again.');
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const event = eventInfo.event;
    const extendedProps = event.extendedProps as CalendarEvent["extendedProps"];
    const startTime = event.start ? new Date(event.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '';
    const endTime = event.end ? new Date(event.end).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '';
    const isGroup = extendedProps.type === 'group';
    const participantsDisplay = isGroup 
      ? extendedProps.participants.map(p => p.name).join(", ")
      : extendedProps.participants[0]?.name;

    if (eventInfo.view.type === 'dayGridMonth') {
      return (
        <div className="relative group p-1">
          <div className="font-medium text-white truncate">{event.title}</div>
        </div>
      );
    }

    return (
      <div className="relative group p-1">
        <div className="font-medium text-white truncate">{event.title}</div>
        <div className="text-white text-xs">{startTime} - {endTime}</div>
        <div className="text-white text-xs truncate">{participantsDisplay}</div>
        {isCoach && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(event as unknown as CalendarEvent);
            }}
            className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/20 rounded"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col overflow-hidden">
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {error}
        </div>
      )}
      {!profile ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <>
          <div className={`custom-calendar flex-1 relative ${isMobileView ? 'fc-mobile-view' : ''}`}>
            {isFetchingEvents && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 text-sm text-gray-500 z-50">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                <span>Updating...</span>
              </div>
            )}
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={isMobileView ? "dayGridMonth" : "dayGridMonth"}
              {...(isMobileView ? mobileSettings : desktopSettings)}
              events={events}
              selectable={isCoach}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              datesSet={handleDatesSet}
              height="100%"
              expandRows={true}
              stickyHeaderDates={true}
              handleWindowResize={true}
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              nowIndicator={true}
              scrollTime={new Date().getHours() + ":00:00"}
              snapDuration="00:15:00"
              dayMaxEventRows={isMobileView ? 4 : true}
              moreLinkClick="day"
              eventDisplay="block"
              eventMinHeight={24}
              displayEventTime={true}
              displayEventEnd={true}
              eventBackgroundColor="var(--fc-event-bg-color)"
              eventBorderColor="var(--fc-event-border-color)"
              eventTextColor="var(--fc-event-text-color)"
            />
          </div>
          <RoleBasedAccess allowedRoles={["coach"]}>
            <LessonModal
              isOpen={showModal}
              onClose={handleModalClose}
              onSubmit={handleAddOrUpdateEvent}
              selectedEvent={isEditing}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              eventStartDate={eventStartDate}
              setEventStartDate={setEventStartDate}
              eventEndDate={eventEndDate}
              setEventEndDate={setEventEndDate}
              lessonType={lessonType === "individual" ? "single" : "group"}
              setLessonType={(type: "single" | "group") => setLessonType(type === "single" ? "individual" : "group")}
              selectedProfiles={selectedProfile ? [selectedProfile] : []}
              setSelectedProfiles={profiles => setSelectedProfile(profiles[0] || null)}
              selectedProfileGroup={selectedProfilesGroup}
              setSelectedProfileGroup={setSelectedProfilesGroup}
              onDelete={selectedEvent ? () => handleDeleteClick(selectedEvent) : undefined}
            />
          </RoleBasedAccess>
          <DeleteConfirmationModal
            isOpen={!!lessonToDelete}
            onClose={() => setLessonToDelete(null)}
            onConfirm={handleDeleteConfirm}
            lessonTitle={lessonToDelete?.title || ''}
          />
        </>
      )}
    </div>
  );
};

export default Calendar;
