"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { FamilyForm } from "@/components/forms/family-form";
import { deleteFamily } from "@/actions/families";
import { Users, Plus, Edit, Trash2, Phone, User, Search, Calendar } from "lucide-react";

interface Family {
  id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  totalEvents: number;
  totalPersons: number;
}

export function FamiliesClient({
  families,
  search,
}: {
  families: Family[];
  search?: string;
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editFamily, setEditFamily] = useState<Family | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState(search || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.push(`/families?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteFamily(deleteId);
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search families..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Family
        </Button>
      </div>

      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {families.length} famil{families.length !== 1 ? "ies" : "y"}
        {search && ` matching "${search}"`}
      </p>

      {families.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No families found" : "No families yet"}
          description={
            search
              ? "Try a different search term."
              : "Add your first family to get started."
          }
          action={
            !search && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Family
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <Card key={family.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{family.name}</CardTitle>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditFamily(family)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(family.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {family.contactPerson && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{family.contactPerson}</span>
                    </div>
                  )}
                  {family.phone && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{family.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {family.totalEvents} event{family.totalEvents !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {family.totalPersons} guest{family.totalPersons !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
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
        title="Add Family"
      >
        <FamilyForm onSuccess={() => setIsCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editFamily}
        onClose={() => setEditFamily(null)}
        title="Edit Family"
      >
        {editFamily && (
          <FamilyForm family={editFamily} onSuccess={() => setEditFamily(null)} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Family"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this family? This will also delete
            all their invitations.
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
