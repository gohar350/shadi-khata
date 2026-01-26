"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { InvitationForm } from "@/components/forms/invitation-form";
import { deleteInvitation, updateInvitation, getEventGuestList } from "@/actions/invitations";
import { formatDate } from "@/lib/utils";
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Download,
  Filter,
} from "lucide-react";

interface Invitation {
  id: string;
  persons: number;
  event: { id: string; name: string; date: Date };
  family: { id: string; name: string; contactPerson: string | null; phone: string | null };
}

interface Event {
  id: string;
  name: string;
  totalPersons: number;
}

interface Family {
  id: string;
  name: string;
}

export function InvitationsClient({
  invitations,
  events,
  families,
  selectedEventId,
}: {
  invitations: Invitation[];
  events: Event[];
  families: Family[];
  selectedEventId?: string;
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editInvitation, setEditInvitation] = useState<Invitation | null>(null);
  const [editPersons, setEditPersons] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const handleFilterChange = (eventId: string) => {
    if (eventId) {
      router.push(`/invitations?eventId=${eventId}`);
    } else {
      router.push("/invitations");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteInvitation(deleteId);
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleUpdate = async () => {
    if (!editInvitation) return;
    setIsUpdating(true);
    try {
      await updateInvitation(editInvitation.id, editPersons);
      router.refresh();
      setEditInvitation(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async () => {
    if (!selectedEventId) return;
    setIsExporting(true);
    try {
      const event = await getEventGuestList(selectedEventId);
      if (!event) return;

      const csvContent = [
        ["Family Name", "Contact Person", "Phone", "Persons"].join(","),
        ...event.invitations.map((inv) =>
          [
            `"${inv.family.name}"`,
            `"${inv.family.contactPerson || ""}"`,
            `"${inv.family.phone || ""}"`,
            inv.persons,
          ].join(",")
        ),
        ["", "", "Total", event.invitations.reduce((sum, inv) => sum + inv.persons, 0)].join(","),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${event.name}-guest-list.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const totalPersons = invitations.reduce((sum, inv) => sum + inv.persons, 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select
              options={[
                { value: "", label: "All Events" },
                ...events.map((e) => ({ value: e.id, label: e.name })),
              ]}
              value={selectedEventId || ""}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-48"
            />
          </div>
          {selectedEventId && (
            <Button
              variant="outline"
              onClick={handleExport}
              isLoading={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Invitation
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <p className="text-gray-500 dark:text-gray-400">
          {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
        </p>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <p className="text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalPersons}
          </span>{" "}
          total guests
        </p>
      </div>

      {invitations.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={selectedEventId ? "No invitations for this event" : "No invitations yet"}
          description={
            selectedEventId
              ? "Add families to this event."
              : "Create your first invitation to get started."
          }
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Invitation
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Family
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Persons
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {invitation.family.name}
                          </p>
                          {invitation.family.contactPerson && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {invitation.family.contactPerson}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-900 dark:text-white">
                              {invitation.event.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(invitation.event.date)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {invitation.persons}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditInvitation(invitation);
                              setEditPersons(invitation.persons);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(invitation.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <td colSpan={2} className="px-6 py-3 text-right font-medium text-gray-900 dark:text-white">
                      Total:
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {totalPersons}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Invitation"
      >
        <InvitationForm
          events={events}
          families={families}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editInvitation}
        onClose={() => setEditInvitation(null)}
        title="Edit Invitation"
      >
        {editInvitation && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Family</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {editInvitation.family.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Event</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {editInvitation.event.name}
              </p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Persons
              </label>
              <input
                type="number"
                min={1}
                value={editPersons}
                onChange={(e) => setEditPersons(Number(e.target.value))}
                className="block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setEditInvitation(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} isLoading={isUpdating}>
                Update
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Invitation"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this invitation?
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
