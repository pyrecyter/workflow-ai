'use client';

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
  const defaultImageUrl = '/events.png';

  console.log('Event Image URL:', event.imageUrl);
  console.log('Default Image URL:', defaultImageUrl);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={event.imageUrl || defaultImageUrl} alt={event.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
        <p className="text-gray-600 text-sm mb-1"><strong>Venue:</strong> {event.venue}</p>
        <p className="text-gray-600 text-sm mb-1"><strong>Date:</strong> {event.date}</p>
        <p className="text-gray-600 text-sm mb-2"><strong>Time:</strong> {event.time}</p>
        <p className="text-gray-700 text-base mb-4 line-clamp-3">{event.description}</p>

        {event.contacts && event.contacts.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm font-medium">Contacts:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {event.contacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact}`}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-blue-200"
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
              className="flex-1 text-center bg-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-600 transition duration-200"
            >
              View Map
            </a>
          )}
          {event.ticketLink && (
            <a
              href={event.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-purple-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-600 transition duration-200"
            >
              Buy Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
}