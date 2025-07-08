import EventCard from "@/components/EventCard";
import { IEvent } from "@/types/events";

async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return res.json();
}

export default async function EventsList() {
  const events = await getEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length > 0 ? (
        events.map((event: IEvent) => (
          <EventCard key={event._id} event={event} />
        ))
      ) : (
        <p className="text-center text-gray-600 col-span-full">
          No events found.
        </p>
      )}
    </div>
  );
}
