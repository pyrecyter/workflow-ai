import { IEvent } from "@/types/events";

export async function getEvent(id: string): Promise<IEvent> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }
  return res.json();
}
