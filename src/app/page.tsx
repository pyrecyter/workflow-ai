
import EventsList from '@/components/EventsList';

export default async function FeedPage() {
  return (
    <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
      <EventsList />
    </div>
  );
}
