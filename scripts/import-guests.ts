import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userEmail = "info.techgensys@gmail.com";
const events = ["MEHANDI", "BARAT", "WALIMA"];

// Paste your data here as an array of objects
const guestData = [
  { name: "M. Afzal", MEHANDI: 7, BARAT: 7, WALIMA: 7 },
  { name: "M Arshad", MEHANDI: 5, BARAT: 5, WALIMA: 5 },
  { name: "M Asif", MEHANDI: 6, BARAT: 6, WALIMA: 6 },
  { name: "M Usman", MEHANDI: 6, BARAT: 6, WALIMA: 6 },
  { name: "M Ali", MEHANDI: 5, BARAT: 5, WALIMA: 5 },
  { name: "Ashi", MEHANDI: 3, BARAT: 3, WALIMA: 3 },
  { name: "Qura", MEHANDI: 7, BARAT: 7, WALIMA: 7 },
  { name: "Hina", MEHANDI: 5, BARAT: 5, WALIMA: 5 },
  { name: "Ali", MEHANDI: 4, BARAT: 4, WALIMA: 4 },
  { name: "Mariyan", MEHANDI: 5, BARAT: 5, WALIMA: 5 },
  { name: "Bilal", MEHANDI: 3, BARAT: 3, WALIMA: 3 },
  { name: "Guddi", MEHANDI: 4, BARAT: 4, WALIMA: 4 },
  { name: "Bila", MEHANDI: 3, BARAT: 3, WALIMA: 3 },
  { name: "Tahir", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Baloch", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Kalsoom", MEHANDI: 5, BARAT: 5, WALIMA: 5 },
  { name: "Nisar", MEHANDI: 0, BARAT: 3, WALIMA: 5 },
  { name: "Amra", MEHANDI: 2, BARAT: 2, WALIMA: 2 },
  { name: "Ashi", MEHANDI: 5, BARAT: 2, WALIMA: 5 },
  { name: "Safiya", MEHANDI: 6, BARAT: 2, WALIMA: 6 },
  { name: "Salma", MEHANDI: 0, BARAT: 2, WALIMA: 4 },
  { name: "Gujar", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Toseef", MEHANDI: 0, BARAT: 0, WALIMA: 2 },
  { name: "Mudasar", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Tipu", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Shadda", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Amjad", MEHANDI: 0, BARAT: 2, WALIMA: 2 },
  { name: "Mehak", MEHANDI: 2, BARAT: 0, WALIMA: 2 },
  { name: "Papa", MEHANDI: 0, BARAT: 0, WALIMA: 5 },
  { name: "Gohar", MEHANDI: 30, BARAT: 20, WALIMA: 40 },
];

type Guest = {
  name: string;
  MEHANDI: number;
  BARAT: number;
  WALIMA: number;
};

async function main() {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("User not found");

  // Create events if not exist
  const eventMap: Record<string, any> = {};
  for (const eventName of events) {
    let event = await prisma.event.findFirst({ where: { name: eventName, userId: user.id } });
    if (!event) {
      event = await prisma.event.create({
        data: { name: eventName, userId: user.id, date: new Date() },
      });
    }
    eventMap[eventName] = event;
  }

  // Create families and invitations
  for (const guest of guestData as Guest[]) {
    let family = await prisma.family.findFirst({ where: { name: guest.name, userId: user.id } });
    if (!family) {
      family = await prisma.family.create({
        data: { name: guest.name, userId: user.id },
      });
    }
    for (const eventName of events) {
      const persons = (guest as any)[eventName] || 0;
      if (persons > 0) {
        await prisma.invitation.upsert({
          where: {
            eventId_familyId: {
              eventId: eventMap[eventName].id,
              familyId: family.id,
            },
          },
          update: { persons },
          create: {
            eventId: eventMap[eventName].id,
            familyId: family.id,
            persons,
          },
        });
      }
    }
  }
  console.log("Data import complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
