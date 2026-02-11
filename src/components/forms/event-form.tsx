"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEvent, updateEvent } from "@/actions/events";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventFormProps {
  event?: {
    id: string;
    name: string;
    date: Date;
    notes: string | null;
  };
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          name: event.name,
          date: new Date(event.date).toISOString().split("T")[0],
          notes: event.notes || "",
        }
      : {
          name: "",
          date: "",
          notes: "",
        },
  });

  const onSubmit = async (data: EventInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = event
        ? await updateEvent(event.id, data)
        : await createEvent(data);

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

      <Input
        label="Event Name"
        placeholder="e.g., Mehndi, Barat, Walima"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        type="date"
        label="Date"
        error={errors.date?.message}
        {...register("date")}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes (Optional)
        </label>
        <textarea
          className="block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          rows={3}
          placeholder="Any additional notes..."
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          {event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
