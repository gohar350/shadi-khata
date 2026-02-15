import { getEvents } from "@/actions/events";
import { Header } from "@/components/layout/header";
import { EventsClient } from "./events-client";
import { SEO } from "@/components/seo";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <SEO title="Events | Shadi Khata - Manage Wedding Events" description="View and manage all your shadi (wedding) events with Shadi Khata. The best marriage management app for Pakistan and India." />
      <Header title="Events" />
      <main className="p-4 lg:p-8 pb-24 lg:pb-8">
        <EventsClient events={events} />
      </main>
    </>
  );
}
