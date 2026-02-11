"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [events, families, invitations] = await Promise.all([
    db.event.count({ where: { userId: session.user.id } }),
    db.family.count({ where: { userId: session.user.id } }),
    db.invitation.findMany({
      where: { event: { userId: session.user.id } },
      select: { persons: true },
    }),
  ]);

  const totalPersons = invitations.reduce((sum, inv) => sum + inv.persons, 0);

  const upcomingEvents = await db.event.findMany({
    where: {
      userId: session.user.id,
      date: { gte: new Date() },
    },
    include: {
      invitations: true,
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  const recentFamilies = await db.family.findMany({
    where: { userId: session.user.id },
    include: {
      invitations: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    totalEvents: events,
    totalFamilies: families,
    totalPersons,
    upcomingEvents: upcomingEvents.map((e) => ({
      ...e,
      totalPersons: e.invitations.reduce((sum, inv) => sum + inv.persons, 0),
    })),
    recentFamilies: recentFamilies.map((f) => ({
      ...f,
      totalInvitations: f.invitations.length,
    })),
  };
}
