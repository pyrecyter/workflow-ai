import MyEventCard from '@/components/MyEventCard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

async function getMyEvents() {
  noStore(); // Opt-out of data caching for this fetch
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login'); // Redirect if not authenticated
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/my-events`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Failed to fetch my events');
  }

  return res.json();
}

export default async function MyEventsPage() {
  let events = [];
  let error: string | null = null;

  try {
    events = await getMyEvents();
  } catch (err: any) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event: any) => (
            <MyEventCard
              key={event._id}
              event={event}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">You haven't created any events yet.</p>
        )}
      </div>
    </div>
  );
}