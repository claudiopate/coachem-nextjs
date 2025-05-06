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
import { useModal } from "@/hooks/useModal";
import RoleBasedAccess from "../auth/RoleBasedAccess";
import { useAuthRole } from "@/context/auth/AuthRoleProvider";
import LessonModal from "./LessonModal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    profiles?: any[];
    type?: "single" | "group";
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [lessonType, setLessonType] = useState<"single" | "group">("single");
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedProfilesGroup, setSelectedProfilesGroup] = useState<any[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { role } = useAuthRole();

  // Mock profili
  const profiles = [
    { id: "1", name: "Mario Rossi" },
    { id: "2", name: "Luca Bianchi" },
    { id: "3", name: "Anna Verdi" },
  ];

  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const formatDateForLocalInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();

    const startDate = selectInfo.start ? new Date(selectInfo.start) : new Date();
    const endDate = selectInfo.end ? new Date(selectInfo.end) : startDate;

    setEventStartDate(formatDateForLocalInput(startDate));
    setEventEndDate(formatDateForLocalInput(endDate));

    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const extended = event.extendedProps;

    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);

    const startDate = event.start ? new Date(event.start) : new Date();
    const endDate = event.end ? new Date(event.end) : startDate;

    setEventStartDate(formatDateForLocalInput(startDate));
    setEventEndDate(formatDateForLocalInput(endDate));
    setEventLevel(extended.calendar);
    setLessonType(extended.type || "single");

    if (extended.type === "group") {
      setSelectedProfilesGroup(extended.profiles || []);
    } else {
      setSelectedProfile(extended.profiles?.[0] || null);
    }

    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    const selectedProfiles =
      lessonType === "single" ? (selectedProfile ? [selectedProfile] : []) : selectedProfilesGroup;

    const newEvent: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate,
      allDay: true,
      extendedProps: {
        calendar: eventLevel,
        type: lessonType,
        profiles: selectedProfiles,
      },
    };

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === selectedEvent.id ? newEvent : event))
      );
    } else {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setSelectedEvent(null);
    setLessonType("single");
    setSelectedProfile(null);
    setSelectedProfilesGroup([]);
  };

  const isCoach = role === "coach";

  const customButtons = isCoach
    ? {
        addEventButton: {
          text: "Add Event +",
          click: openModal,
        },
      }
    : undefined;
  const headerLeft = `prev,next${isCoach ? " addEventButton" : ""}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <RoleBasedAccess allowedRoles={["coach"]}>
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: headerLeft,
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={customButtons}
          />
        </div>
        <LessonModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleAddOrUpdateEvent}
          selectedEvent={!!selectedEvent}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventStartDate={eventStartDate}
          setEventStartDate={setEventStartDate}
          eventEndDate={eventEndDate}
          setEventEndDate={setEventEndDate}
        />
      </RoleBasedAccess>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase() || "default"}`;
  const profiles = eventInfo.event.extendedProps.profiles;
  const names = profiles?.map((p: any) => p.name).join(", ");

  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
      {names && <div className="text-xs text-gray-500 ml-1">{names}</div>}
    </div>
  );
};

export default Calendar;
