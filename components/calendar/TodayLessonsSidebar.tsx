"use client";
import React, { useEffect, useState, useRef } from "react";
import { EventInput } from "@fullcalendar/core";
import { createClient } from "@/utils/supabase/client";
import DeleteConfirmationModal from './DeleteConfirmationModal';

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

interface TodayLessonsSidebarProps {
  profileId: string;
  onEventClick?: (event: CalendarEvent) => void;
  refreshTrigger?: number;
  onLessonUpdate?: () => void;
}

function isLessonToday(start: Date, end: Date) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  // Lesson overlaps with today if it starts before end of today and ends after start of today
  return start <= endOfDay && end >= startOfDay;
}

export default function TodayLessonsSidebar({ profileId, onEventClick, refreshTrigger, onLessonUpdate }: TodayLessonsSidebarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<CalendarEvent | null>(null);
  const initialFetchDone = useRef(false);
  const supabase = createClient();

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Authentication error');
        return;
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const res = await fetch(`/api/profile/${user.id}/lessons?start=${encodeURIComponent(startOfDay.toISOString())}&end=${encodeURIComponent(endOfDay.toISOString())}`, {
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
    fetchLessons();
  }, [profileId, refreshTrigger]);

  // Filter lessons that overlap with today and sort by start time
  const todaysLessons = events
    .filter(ev => {
      const start = new Date(ev.start as string);
      const end = new Date(ev.end as string);
      return isLessonToday(start, end);
    })
    .sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event); // Debug log
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleDeleteClick = async (event: React.MouseEvent, lesson: CalendarEvent) => {
    event.stopPropagation(); // Prevent event bubbling to parent button
    setLessonToDelete(lesson);
  };

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Authentication error');
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
      
      // Notify parent about the update
      if (onLessonUpdate) {
        onLessonUpdate();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError('Errore durante l\'eliminazione della lezione');
    } finally {
      setLessonToDelete(null);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-4 border border-gray-100 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-4">Lezioni di oggi</h2>
      {loading ? (
        <div className="text-gray-400 text-sm">Caricamento...</div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : todaysLessons.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">Nessuna lezione per oggi</div>
      ) : (
        <ul className="space-y-3">
          {todaysLessons.map((lesson, idx) => (
            <div 
              key={lesson.id || idx} 
              className="w-full text-left flex flex-col gap-1 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/40 shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-colors relative group"
              onClick={() => handleEventClick(lesson)}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${lesson.extendedProps.type === 'group' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {lesson.extendedProps.type === 'group' ? 'Gruppo' : 'Individuale'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(lesson.start as string).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(lesson.end as string).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={(e) => handleDeleteClick(e, lesson)}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="font-medium text-gray-900 dark:text-white/90 truncate">{lesson.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                👨‍🏫 {lesson.extendedProps.coach}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {lesson.extendedProps.type === 'group' ? '👥 Partecipanti: ' : '👤 Studente: '}
                <span className="font-medium">{lesson.extendedProps.participants.map((p) => p.name).join(', ')}</span>
              </div>
            </div>
          ))}
        </ul>
      )}

      <DeleteConfirmationModal
        isOpen={!!lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleDeleteConfirm}
        lessonTitle={lessonToDelete?.title || ''}
      />
    </div>
  );
} 