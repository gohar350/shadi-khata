"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eventSchema, type EventInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getEvents() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const events = await db.event.findMany({
    where: { userId: session.user.id },
    include: {
      invitations: true,
    },
    orderBy: { date: "asc" },
  });

  return events.map((event) => ({
    ...event,
    totalPersons: event.invitations.reduce((sum, inv) => sum + inv.persons, 0),
  }));
}

export async function getEvent(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const event = await db.event.findFirst({
    where: { id, userId: session.user.id },
    include: {
      invitations: {
        include: {
          family: true,
        },
      },
    },
  });

  return event;
}

export async function createEvent(data: EventInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = eventSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, date, notes } = validated.data;

  await db.event.create({
    data: {
      name,
      date: new Date(date),
      notes: notes || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
  return { success: "Event created successfully" };
}

export async function updateEvent(id: string, data: EventInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = eventSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, date, notes } = validated.data;

  const event = await db.event.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  await db.event.update({
    where: { id },
    data: {
      name,
      date: new Date(date),
      notes: notes || null,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
  return { success: "Event updated successfully" };
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const event = await db.event.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  await db.event.delete({
    where: { id },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/invitations");
  return { success: "Event deleted successfully" };
}
