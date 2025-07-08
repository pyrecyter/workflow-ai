/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import { capitalizeWords } from "@/utils/textFormatter";

interface EventCardProps {
  event: {
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
}

export default function EventCard({ event }: EventCardProps) {
  const defaultImageUrl = "/events.png";
  const router = useRouter();
  const { user } = useUser();

  console.log("Event Image URL:", event.imageUrl);
  console.log("Default Image URL:", defaultImageUrl);

  const handleCardClick = () => {
    if (user) {
      router.push(`/dashboard/${event._id}`);
    } else {
      router.push(`/events/${event._id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={event.imageUrl || defaultImageUrl}
        alt={event.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {capitalizeWords(event.name)}
          </h3>
          <div className="space-y-1 text-gray-600 text-sm mb-2">
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {event.venue}
            </p>
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              {event.date}
            </p>
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {event.time}
            </p>
          </div>
          <p className="text-gray-700 text-base mb-4 line-clamp-3">
            {event.description}
          </p>
        </div>

        <div className="mt-auto">
          {event.contacts && event.contacts.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.134-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                Contacts:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {event.contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-blue-200 transition duration-200 flex items-center"
                  >
                    {contact}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            {event.mapLink && (
              <a
                href={event.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center bg-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-600 transition duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                View Map
              </a>
            )}
            {event.ticketLink && (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center bg-purple-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-600 transition duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M9 9V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2l2 2v-2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2z"
                  ></path>
                </svg>
                Buy Tickets
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
