"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { familySchema, type FamilyInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getFamilies(search?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const families = await db.family.findMany({
    where: {
      userId: session.user.id,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { contactPerson: { contains: search } },
        ],
      }),
    },
    include: {
      invitations: true,
    },
    orderBy: { name: "asc" },
  });

  return families.map((family) => ({
    ...family,
    totalEvents: family.invitations.length,
    totalPersons: family.invitations.reduce((sum, inv) => sum + inv.persons, 0),
  }));
}

export async function getFamily(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const family = await db.family.findFirst({
    where: { id, userId: session.user.id },
    include: {
      invitations: {
        include: {
          event: true,
        },
      },
    },
  });

  return family;
}

export async function createFamily(data: FamilyInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = familySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, contactPerson, phone } = validated.data;

  await db.family.create({
    data: {
      name,
      contactPerson: contactPerson || null,
      phone: phone || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/families");
  revalidatePath("/dashboard");
  return { success: "Family created successfully" };
}

export async function updateFamily(id: string, data: FamilyInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = familySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, contactPerson, phone } = validated.data;

  const family = await db.family.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!family) {
    return { error: "Family not found" };
  }

  await db.family.update({
    where: { id },
    data: {
      name,
      contactPerson: contactPerson || null,
      phone: phone || null,
    },
  });

  revalidatePath("/families");
  revalidatePath("/dashboard");
  return { success: "Family updated successfully" };
}

export async function deleteFamily(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const family = await db.family.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!family) {
    return { error: "Family not found" };
  }

  await db.family.delete({
    where: { id },
  });

  revalidatePath("/families");
  revalidatePath("/dashboard");
  revalidatePath("/invitations");
  return { success: "Family deleted successfully" };
}
