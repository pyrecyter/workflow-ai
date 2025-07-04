
'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useSnackbar } from '@/context/SnackbarContext';
import { revalidateEvents } from '@/app/api/events/actions';

interface CreateEventModalProps {
  onClose: () => void;
  eventToEdit?: {
    _id: string;
    name: string;
    venue: string;
    date: string;
    time: string;
    description: string;
    mapLink?: string;
    ticketLink?: string;
    imageUrl?: string;
    contacts: string[];
  };
  onSuccess?: () => void; // Callback for success (create or edit)
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
    </button>
  );
}

export default function CreateEventModal({ onClose, eventToEdit, onSuccess }: CreateEventModalProps) {
  const [contacts, setContacts] = useState<string>('');
  const { showSnackbar } = useSnackbar();

  const isEditing = !!eventToEdit;

  useEffect(() => {
    if (eventToEdit) {
      setContacts(eventToEdit.contacts.join(', '));
    }
  }, [eventToEdit]);

  const handleSubmit = async (formData: FormData) => {
    const eventData = {
      name: formData.get('name'),
      venue: formData.get('venue'),
      date: formData.get('date'),
      time: formData.get('time'),
      description: formData.get('description'),
      mapLink: formData.get('mapLink'),
      ticketLink: formData.get('ticketLink'),
      imageUrl: formData.get('imageUrl'),
      contacts: contacts.split(',').map(c => c.trim()).filter(c => c.length > 0),
    };

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    let res;
    if (isEditing) {
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
    } else {
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
    }

    if (res.ok) {
      showSnackbar(isEditing ? 'Event updated successfully!' : 'Event created successfully!', 'success');
      revalidateEvents(); // Revalidate events list
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      const { message } = await res.json();
      showSnackbar(message || (isEditing ? 'Failed to update event.' : 'Failed to create event.'), 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name *</label>
            <input type="text" id="name" name="name" defaultValue={eventToEdit?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue *</label>
            <input type="text" id="venue" name="venue" defaultValue={eventToEdit?.venue} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
              <input type="date" id="date" name="date" defaultValue={eventToEdit?.date} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time *</label>
              <input type="time" id="time" name="time" defaultValue={eventToEdit?.time} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea id="description" name="description" rows={3} defaultValue={eventToEdit?.description} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
          </div>
          <div>
            <label htmlFor="contacts" className="block text-sm font-medium text-gray-700">Contacts (comma-separated numbers) *</label>
            <input
              type="text"
              id="contacts"
              name="contacts"
              value={contacts}
              onChange={(e) => setContacts(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              placeholder="e.g., 1234567890, 0987654321"
            />
          </div>
          <div>
            <label htmlFor="mapLink" className="block text-sm font-medium text-gray-700">Map Link</label>
            <input type="url" id="mapLink" name="mapLink" defaultValue={eventToEdit?.mapLink} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="ticketLink" className="block text-sm font-medium text-gray-700">Ticket Link</label>
            <input type="url" id="ticketLink" name="ticketLink" defaultValue={eventToEdit?.ticketLink} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="url" id="imageUrl" name="imageUrl" defaultValue={eventToEdit?.imageUrl} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <SubmitButton isEditing={isEditing} />
          <button
            type="button"
            onClick={onClose}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
