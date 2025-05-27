import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
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

interface MobileCalendarProps {
  profileId: string;
  onDateSelect: (date: Date) => void;
}

export default function MobileCalendar({ profileId, onDateSelect }: MobileCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMonthEvents = async (month: Date) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Authentication error');
        return;
      }

      const start = startOfMonth(month);
      const end = endOfMonth(month);
      
      const res = await fetch(`/api/profile/${user.id}/lessons?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch lessons');
      const data = await res.json();
      
      setEvents(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setError('Errore nel caricamento delle lezioni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthEvents(currentMonth);
  }, [currentMonth, profileId]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const hasEventsOnDay = (day: Date) => {
    return events.some(event => {
      const eventStart = parseISO(event.start);
      return isSameDay(eventStart, day);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-4 border border-gray-100 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: it })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const hasEvents = hasEventsOnDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square p-1 text-sm rounded-full relative
                ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}
                ${hasEvents && !isSelected ? 'font-bold' : ''}
              `}
            >
              {format(day, 'd')}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {loading && <div className="text-center mt-4 text-gray-500">Caricamento...</div>}
      {error && <div className="text-center mt-4 text-red-500">{error}</div>}
    </div>
  );
} 