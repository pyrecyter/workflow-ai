/* eslint-disable @next/next/no-img-element */
import { IEvent } from "@/types/events";
import Link from "next/link";
import { getEvent } from "./actions";
import { capitalizeWords } from "@/utils/textFormatter";

export default async function EventDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const event: IEvent = await getEvent(params.id);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Event not found.</p>
      </div>
    );
  }

  const defaultImageUrl = "/events.png";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <div className="relative mb-6">
        <img
          src={event.imageUrl || defaultImageUrl}
          alt={event.name}
          className="w-full h-80 object-cover rounded-lg"
        />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        {capitalizeWords(event.name)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-gray-500 mr-3"
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
          <p className="text-lg text-gray-700">{event.venue}</p>
        </div>
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-gray-500 mr-3"
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
          <p className="text-lg text-gray-700">{event.date}</p>
        </div>
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-gray-500 mr-3"
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
          <p className="text-lg text-gray-700">{event.time}</p>
        </div>
      </div>
      <div className="prose max-w-none text-gray-800 mb-6">
        <p>{event.description}</p>
      </div>
      {event.contacts && event.contacts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Contacts</h2>
          <div className="flex flex-wrap gap-3">
            {event.contacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact}`}
                className="bg-blue-100 text-blue-800 text-md font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition duration-200"
              >
                {contact}
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
        {event.mapLink && (
          <a
            href={event.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 mr-2"
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
            className="flex-1 text-center bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-purple-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M9 9V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2l2 2v-2h2a2 2 0 002-2V9a2 2 0 002-2h-2z"
              ></path>
            </svg>
            Buy Tickets
          </a>
        )}
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          &larr; Back to all events
        </Link>
      </div>
    </div>
  );
}
