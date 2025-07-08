"use client";

import EventCard from "./EventCard";
import { useState } from "react";
import CreateEventModal from "./CreateEventModal";
import { revalidateMyEvents } from "@/app/(dashboard)/my-events/actions";
import ConfirmationModal from "./ConfirmationModal";
import { useSnackbar } from "@/hooks/useSnackbar";
import { IEvent } from "@/types/events";

interface MyEventCardProps {
  event: IEvent;
}

export default function MyEventCard({ event }: MyEventCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setIsConfirmModalOpen(false); // Close confirmation modal

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      showSnackbar("Event deleted successfully!", "success");
      revalidateMyEvents(); // Revalidate data after successful delete
    } else {
      const { message } = await res.json();
      showSnackbar(
        `Failed to delete event: ${message || "Unknown error"}`,
        "error"
      );
    }
  };

  const handleEditSuccess = () => {
    revalidateMyEvents(); // Revalidate data after successful edit
  };

  return (
    <div className="relative">
      <EventCard event={event} />
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Edit Event"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
          </svg>
        </button>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Delete Event"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isEditModalOpen && (
        <CreateEventModal
          onClose={() => setIsEditModalOpen(false)}
          eventToEdit={event} // Pass the event data for editing
          onSuccess={handleEditSuccess}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this event?"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
}
