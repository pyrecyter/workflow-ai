'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Snackbar from '@/components/Snackbar';

interface CreateEventModalProps {
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create Event'}
    </button>
  );
}

export default function CreateEventModal({ onClose }: CreateEventModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contacts, setContacts] = useState<string>('');

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      setSuccess('Event created successfully!');
      // Optionally close modal after a short delay or on success
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      const { message } = await res.json();
      setError(message || 'Failed to create event.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create New Event</h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name *</label>
            <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue *</label>
            <input type="text" id="venue" name="venue" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
              <input type="date" id="date" name="date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time *</label>
              <input type="time" id="time" name="time" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea id="description" name="description" rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
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
            <input type="url" id="mapLink" name="mapLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="ticketLink" className="block text-sm font-medium text-gray-700">Ticket Link</label>
            <input type="url" id="ticketLink" name="ticketLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
          </div>
          <SubmitButton />
          <button
            type="button"
            onClick={onClose}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </form>
        {error && <Snackbar message={error} type="error" onClose={() => setError(null)} />}
        {success && <Snackbar message={success} type="success" onClose={() => setSuccess(null)} />}
      </div>
    </div>
  );
}