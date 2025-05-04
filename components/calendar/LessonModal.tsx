"use client";

import { useState } from "react";
import { Modal } from "../ui/modal";
import Select, { MultiValue } from "react-select";

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
  selectedEvent: boolean;
  profiles: { id: string; name: string }[]; // Lista dei profili
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
  profiles,
}) => {
  const [lessonType, setLessonType] = useState<"single" | "group">("single");
  // SINGLE: deve supportare selezioni multiple → array
  const [selectedProfiles, setSelectedProfiles] = useState<MultiValue<any>>([]);

  // GROUP: deve supportare una sola selezione → oggetto singolo o null
  const [selectedProfileGroup, setSelectedProfileGroup] = useState<any | null>(null); 

  // Reset dei campi extra
  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setSelectedProfiles([]);
    setSelectedProfileGroup(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Plan your next big moment: schedule or edit an event to stay on
            track
          </p>
        </div>

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
                  value="single"
                  checked={lessonType === "single"}
                  onChange={() => setLessonType("single")}
                  className="mr-2"
                />
                Single
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
                Select Profile
              </label>
              <Select
                isMulti
                value={selectedProfiles}
                onChange={setSelectedProfiles}
                options={profiles.map((profile) => ({
                  value: profile.id,
                  label: profile.name,
                }))}
                className="w-full"
                isClearable
                closeMenuOnSelect={false}
              />
            </div>
          )}

          {lessonType === "group" && (
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Profiles
              </label>
              <Select
                isMulti={false}
                value={selectedProfileGroup}
                onChange={setSelectedProfileGroup}
                options={profiles.map((profile) => ({
                  value: profile.id,
                  label: profile.name,
                }))}
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
            onClick={onClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            type="button"
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            {selectedEvent ? "Update Changes" : "Add Event"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LessonModal;
