"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitationSchema, type InvitationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getInvitations(eventId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const invitations = await db.invitation.findMany({
    where: {
      event: { userId: session.user.id },
      ...(eventId && { eventId }),
    },
    include: {
      event: true,
      family: true,
    },
    orderBy: [{ event: { date: "asc" } }, { family: { name: "asc" } }],
  });

  return invitations;
}

export async function createInvitation(data: InvitationInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = invitationSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { eventId, familyId, persons } = validated.data;

  // Verify event belongs to user
  const event = await db.event.findFirst({
    where: { id: eventId, userId: session.user.id },
  });
  if (!event) {
    return { error: "Event not found" };
  }

  // Verify family belongs to user
  const family = await db.family.findFirst({
    where: { id: familyId, userId: session.user.id },
  });
  if (!family) {
    return { error: "Family not found" };
  }

  // Check for existing invitation
  const existing = await db.invitation.findUnique({
    where: {
      eventId_familyId: { eventId, familyId },
    },
  });

  if (existing) {
    return { error: "This family is already invited to this event" };
  }

  await db.invitation.create({
    data: {
      eventId,
      familyId,
      persons,
    },
  });

  revalidatePath("/invitations");
  revalidatePath("/events");
  revalidatePath("/families");
  revalidatePath("/dashboard");
  return { success: "Invitation created successfully" };
}

export async function updateInvitation(id: string, persons: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (persons < 1) {
    return { error: "At least 1 person is required" };
  }

  const invitation = await db.invitation.findFirst({
    where: {
      id,
      event: { userId: session.user.id },
    },
  });

  if (!invitation) {
    return { error: "Invitation not found" };
  }

  await db.invitation.update({
    where: { id },
    data: { persons },
  });

  revalidatePath("/invitations");
  revalidatePath("/events");
  revalidatePath("/families");
  revalidatePath("/dashboard");
  return { success: "Invitation updated successfully" };
}

export async function deleteInvitation(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const invitation = await db.invitation.findFirst({
    where: {
      id,
      event: { userId: session.user.id },
    },
  });

  if (!invitation) {
    return { error: "Invitation not found" };
  }

  await db.invitation.delete({
    where: { id },
  });

  revalidatePath("/invitations");
  revalidatePath("/events");
  revalidatePath("/families");
  revalidatePath("/dashboard");
  return { success: "Invitation deleted successfully" };
}

export async function getEventGuestList(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const event = await db.event.findFirst({
    where: { id: eventId, userId: session.user.id },
    include: {
      invitations: {
        include: {
          family: true,
        },
        orderBy: {
          family: { name: "asc" },
        },
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}
