import { getEvents } from "@/actions/events";
import { Header } from "@/components/layout/header";
import { EventsClient } from "./events-client";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Header title="Events" />
      <main className="p-4 lg:p-8 pb-24 lg:pb-8">
        <EventsClient events={events} />
      </main>
    </>
  );
}
