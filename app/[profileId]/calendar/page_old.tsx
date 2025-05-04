'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useState } from 'react';
import { bookings as Booking } from '@prisma/client';

export default function Lessons() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    profileId: '',
    organizationId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'individuale',
    status: 'pending',
  });

  const handleDateClick = (arg: DateClickArg) => {
    const selectedDate = arg.dateStr.split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: selectedDate,
    }));
    setModalVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: Booking = {
      id: String(Date.now()),
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      status: formData.status,
      profileId: formData.profileId,
      organizationId: formData.organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBookings([...bookings, newBooking]);
    setModalVisible(false);
  };

  const events = bookings.map(b => {
    const start = new Date(`${b.date.toISOString().split('T')[0]}T${b.startTime}`);
    const end = new Date(`${b.date.toISOString().split('T')[0]}T${b.endTime}`);

    return {
      id: b.id,
      title: b.type,
      start: start.toISOString(),
      end: end.toISOString(),
    };
  });

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center sm:text-left">Calendario Lezioni</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={false}
        events={events}
        dateClick={handleDateClick}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        height="auto"
      />

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Nuovo Appuntamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm">ID Studente</label>
                <input
                  type="text"
                  value={formData.profileId}
                  onChange={e => setFormData({ ...formData, profileId: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm">ID Organizzazione</label>
                <input
                  type="text"
                  value={formData.organizationId}
                  onChange={e => setFormData({ ...formData, organizationId: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm">Ora inizio</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm">Ora fine</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm">Tipo</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="individuale">Individuale</option>
                  <option value="doppio">Doppio</option>
                  <option value="prova">Lezione Prova</option>
                </select>
              </div>

              <div>
                <label className="block text-sm">Stato</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="pending">In attesa</option>
                  <option value="confirmed">Confermata</option>
                  <option value="cancelled">Annullata</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="text-gray-600 hover:underline"
                  onClick={() => setModalVisible(false)}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
