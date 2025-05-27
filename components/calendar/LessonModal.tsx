"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Select, { MultiValue } from "react-select";
import { createClient } from "@/utils/supabase/client";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventStartDate: string;
  setEventStartDate: (date: string) => void;
  eventEndDate: string;
  setEventEndDate: (date: string) => void;
  onSubmit: () => void;
  selectedEvent: CalendarEvent | null;
  lessonType: "single" | "group";
  setLessonType: (type: "single" | "group") => void;
  selectedProfiles: Array<{ id: string; name: string }>;
  setSelectedProfiles: (profiles: Array<{ id: string; name: string }>) => void;
  selectedProfileGroup: Array<{ id: string; name: string }>;
  setSelectedProfileGroup: (profiles: Array<{ id: string; name: string }>) => void;
  onDelete?: () => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  extendedProps: {
    type: "individual" | "group";
    coach: string;
    participants: Array<{ id: string; name: string }>;
  };
}

const LessonModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  setEventTitle,
  eventStartDate,
  setEventStartDate,
  eventEndDate,
  setEventEndDate,
  onSubmit,
  selectedEvent,
  lessonType,
  setLessonType,
  selectedProfiles,
  setSelectedProfiles,
  selectedProfileGroup,
  setSelectedProfileGroup,
  onDelete
}) => {
  
  const supabase = createClient();  
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [profileOptions, setProfileOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [groupOptions, setGroupOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError('No user available');
          return;
        }

        if (lessonType === "single") {
          const res = await fetch(`/api/coach-profile/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`
            }
          });
          
          if (!res.ok) {
            setError('Failed to fetch profiles');
            return;
          }
          
          const response = await res.json();
          const options = response.data.map((p: any) => ({
            value: p.id,
            label: `${p.firstName} ${p.lastName}`
          }));
          setProfileOptions(options);
        }
        else if (lessonType === "group") {
          const res = await fetch(`/api/coach-group/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`
            }
          });
          
          if (!res.ok) {
            setError('Failed to fetch groups');
            return;
          }
          
          const data = await res.json();
          const options = data.map((p: any) => ({
            value: p.id,
            label: p.name,
          }));
          setGroupOptions(options);
        }
      } catch (error) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonType]);

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setSelectedProfiles([]);
    setSelectedProfileGroup([]);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!eventTitle || !eventStartDate || !eventEndDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (lessonType === "single" && selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }
    
    if (lessonType === "group" && selectedProfileGroup.length === 0) {
      setError('Please select a group');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('No user available');
        return;
      }

      const newEvent = {
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
        title: eventTitle || (lessonType === "single" ? 
          `Individual Lesson with ${selectedProfiles[0]?.name}` :
          `Group Lesson: ${selectedProfileGroup[0]?.name}`),
        start: eventStartDate,
        end: eventEndDate,
        allDay: false,
        extendedProps: {
          type: lessonType === "single" ? "individual" : "group",
          coach: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
          participants: lessonType === "single" ? selectedProfiles : selectedProfileGroup
        }
      };

      const response = await fetch(`/api/profile/${user.id}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save lesson');
      }

      await onSubmit();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Lesson" : "Add New Lesson"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </p>
          </div>
          {selectedEvent && onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete lesson"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </label>
              <input
                id="event-title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Lesson Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="lesson-type"
                  value="individual"
                  checked={lessonType === "single"}
                  onChange={() => setLessonType("single")}
                  className="mr-2"
                />
                Individual
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="lesson-type"
                  value="group"
                  checked={lessonType === "group"}
                  onChange={() => setLessonType("group")}
                  className="mr-2"
                />
                Group
              </label>
            </div>
          </div>

          {lessonType === "single" && (
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Student
              </label>
              <Select
                isMulti={false}
                value={selectedProfiles.length > 0 ? { 
                  value: selectedProfiles[0].id, 
                  label: selectedProfiles[0].name 
                } : null}
                onChange={(selected) => {
                  if (selected) {
                    const selectedValue = selected as { value: string; label: string };
                    setSelectedProfiles([{
                      id: selectedValue.value,
                      name: selectedValue.label
                    }]);
                  } else {
                    setSelectedProfiles([]);
                  }
                }}
                options={profileOptions}
                className="w-full"
                isClearable
                isLoading={loading}
                placeholder="Select a student..."
                noOptionsMessage={() => "No students found"}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '44px',
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-color, #E5E7EB)',
                    fontSize: '16px',
                    '&:hover': {
                      borderColor: 'var(--border-hover-color, #D1D5DB)'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'var(--bg-color, white)',
                    border: '1px solid var(--border-color, #E5E7EB)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 9999
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: '40vh',
                    padding: '8px 0'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? 'var(--selected-bg, #4F46E5)' : 'transparent',
                    color: state.isSelected ? 'white' : 'inherit',
                    fontSize: '16px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: state.isSelected ? 'var(--selected-bg, #4F46E5)' : 'var(--hover-bg, #F3F4F6)'
                    },
                    '&:active': {
                      backgroundColor: 'var(--selected-bg, #4F46E5)',
                      color: 'white'
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: '16px',
                    color: 'inherit'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    fontSize: '16px',
                    color: 'var(--placeholder-color, #9CA3AF)'
                  }),
                  input: (base) => ({
                    ...base,
                    fontSize: '16px'
                  })
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: 'var(--primary-color, #4F46E5)',
                    primary75: 'var(--primary-color-75, #6366F1)',
                    primary50: 'var(--primary-color-50, #818CF8)',
                    primary25: 'var(--primary-color-25, #C7D2FE)',
                    neutral0: 'var(--bg-color, white)',
                    neutral5: 'var(--hover-bg, #F3F4F6)',
                    neutral10: 'var(--hover-bg, #F3F4F6)',
                    neutral20: 'var(--border-color, #E5E7EB)',
                    neutral30: 'var(--border-hover-color, #D1D5DB)',
                    neutral40: 'var(--placeholder-color, #9CA3AF)',
                    neutral50: 'var(--placeholder-color, #9CA3AF)',
                    neutral60: 'var(--text-color, #4B5563)',
                    neutral70: 'var(--text-color, #374151)',
                    neutral80: 'var(--text-color, #1F2937)',
                    neutral90: 'var(--text-color, #111827)'
                  }
                })}
              />
            </div>
          )}

          {lessonType === "group" && (
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Group
              </label>
              <Select
                isMulti={false}
                value={selectedProfileGroup.map(p => ({ value: p.id, label: p.name }))[0]}
                onChange={(selected) => {
                  if (selected) {
                    setSelectedProfileGroup([{
                      id: (selected as { value: string; label: string }).value,
                      name: (selected as { value: string; label: string }).label
                    }]);
                  } else {
                    setSelectedProfileGroup([]);
                  }
                }}
                options={groupOptions}
                className="w-full"
                isClearable
              />
            </div>
          )}

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter Start Date
            </label>
            <input
              id="event-start-date"
              type="datetime-local"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter End Date
            </label>
            <input
              id="event-end-date"
              type="datetime-local"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <button
            onClick={handleClose}
            type="button"
            disabled={loading}
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto"
          >
            {loading ? 'Saving...' : (selectedEvent ? "Update Changes" : "Add Event")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LessonModal;
