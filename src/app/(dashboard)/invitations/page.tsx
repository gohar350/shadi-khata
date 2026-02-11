import { getInvitations } from "@/actions/invitations";
import { getEvents } from "@/actions/events";
import { getFamilies } from "@/actions/families";
import { Header } from "@/components/layout/header";
import { InvitationsClient } from "./invitations-client";

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const params = await searchParams;
  const [invitations, events, families] = await Promise.all([
    getInvitations(params.eventId),
    getEvents(),
    getFamilies(),
  ]);

  return (
    <>
      <Header title="Invitations" />
      <main className="p-4 lg:p-8 pb-24 lg:pb-8">
        <InvitationsClient
          invitations={invitations}
          events={events}
          families={families}
          selectedEventId={params.eventId}
        />
      </main>
    </>
  );
}
