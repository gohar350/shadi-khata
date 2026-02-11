"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationSchema, type InvitationInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createInvitation } from "@/actions/invitations";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface InvitationFormProps {
  events: { id: string; name: string }[];
  families: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function InvitationForm({
  events,
  families,
  onSuccess,
}: InvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      eventId: "",
      familyId: "",
      persons: 1,
    },
  });

  const onSubmit = async (data: InvitationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createInvitation(data);

      if (result.error) {
        setError(result.error);
      } else {
        reset();
        router.refresh();
        onSuccess?.();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <Select
        label="Select Event"
        placeholder="Choose an event"
        options={events.map((e) => ({ value: e.id, label: e.name }))}
        error={errors.eventId?.message}
        {...register("eventId")}
      />

      <Select
        label="Select Family"
        placeholder="Choose a family"
        options={families.map((f) => ({ value: f.id, label: f.name }))}
        error={errors.familyId?.message}
        {...register("familyId")}
      />

      <Input
        type="number"
        label="Number of Persons"
        min={1}
        error={errors.persons?.message}
        {...register("persons", { valueAsNumber: true })}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          Create Invitation
        </Button>
      </div>
    </form>
  );
}
