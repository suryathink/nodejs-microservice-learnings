export type EventType = "Deposit" | "Withdraw";

export interface Event {
  accountId: string;
  eventType: EventType;
  amount: number;
}
 
class EventStore {
  private events: Array<Event> = [];

  addEvent(event: Event): boolean {
    this.events.push(event);
    return true;
  }

  getEvent(accountId: string) {
    return this.events.filter((event) => event.accountId === accountId);
  }

  getAllEvents(): Event[] {
    return this.events;
  }
}

export const eventStore = new EventStore();
