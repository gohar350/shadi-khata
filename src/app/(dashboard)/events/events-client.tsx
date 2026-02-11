"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { EventForm } from "@/components/forms/event-form";
import { deleteEvent } from "@/actions/events";
import { formatDate } from "@/lib/utils";
import { Calendar, Plus, Edit, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  name: string;
  date: Date;
  notes: string | null;
  totalPersons: number;
}

export function EventsClient({ events }: { events: Event[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteEvent(deleteId);
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Create your first wedding event to get started."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditEvent(event)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(event.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {event.totalPersons} guest{event.totalPersons !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {event.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {event.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Event"
      >
        <EventForm onSuccess={() => setIsCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editEvent}
        onClose={() => setEditEvent(null)}
        title="Edit Event"
      >
        {editEvent && (
          <EventForm event={editEvent} onSuccess={() => setEditEvent(null)} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this event? This will also delete
            all invitations associated with this event.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
