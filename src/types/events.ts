export interface IEvent {
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
  userId: string;
}
