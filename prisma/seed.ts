import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const hashedPassword = await bcrypt.hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: "Mehndi",
        date: new Date("2025-03-15"),
        notes: "Mehndi ceremony at home",
        userId: user.id,
      },
    }),
    prisma.event.create({
      data: {
        name: "Barat",
        date: new Date("2025-03-16"),
        notes: "Main wedding ceremony",
        userId: user.id,
      },
    }),
    prisma.event.create({
      data: {
        name: "Walima",
        date: new Date("2025-03-17"),
        notes: "Reception dinner",
        userId: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);

  // Create sample families
  const families = await Promise.all([
    prisma.family.create({
      data: {
        name: "Khan Family",
        contactPerson: "Ahmed Khan",
        phone: "+92 300 1234567",
        userId: user.id,
      },
    }),
    prisma.family.create({
      data: {
        name: "Ali Family",
        contactPerson: "Mohammad Ali",
        phone: "+92 301 2345678",
        userId: user.id,
      },
    }),
    prisma.family.create({
      data: {
        name: "Malik Family",
        contactPerson: "Zainab Malik",
        phone: "+92 302 3456789",
        userId: user.id,
      },
    }),
    prisma.family.create({
      data: {
        name: "Sheikh Family",
        contactPerson: "Bilal Sheikh",
        phone: "+92 303 4567890",
        userId: user.id,
      },
    }),
    prisma.family.create({
      data: {
        name: "Qureshi Family",
        contactPerson: "Hassan Qureshi",
        userId: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${families.length} families`);

  // Create sample invitations
  const invitations = await Promise.all([
    // Mehndi invitations
    prisma.invitation.create({
      data: { eventId: events[0].id, familyId: families[0].id, persons: 4 },
    }),
    prisma.invitation.create({
      data: { eventId: events[0].id, familyId: families[1].id, persons: 3 },
    }),
    prisma.invitation.create({
      data: { eventId: events[0].id, familyId: families[2].id, persons: 5 },
    }),
    // Barat invitations
    prisma.invitation.create({
      data: { eventId: events[1].id, familyId: families[0].id, persons: 6 },
    }),
    prisma.invitation.create({
      data: { eventId: events[1].id, familyId: families[1].id, persons: 4 },
    }),
    prisma.invitation.create({
      data: { eventId: events[1].id, familyId: families[2].id, persons: 5 },
    }),
    prisma.invitation.create({
      data: { eventId: events[1].id, familyId: families[3].id, persons: 3 },
    }),
    prisma.invitation.create({
      data: { eventId: events[1].id, familyId: families[4].id, persons: 4 },
    }),
    // Walima invitations
    prisma.invitation.create({
      data: { eventId: events[2].id, familyId: families[0].id, persons: 5 },
    }),
    prisma.invitation.create({
      data: { eventId: events[2].id, familyId: families[1].id, persons: 4 },
    }),
    prisma.invitation.create({
      data: { eventId: events[2].id, familyId: families[3].id, persons: 3 },
    }),
  ]);

  console.log(`✅ Created ${invitations.length} invitations`);

  console.log("🎉 Seeding complete!");
  console.log("\n📧 Demo credentials:");
  console.log("   Email: demo@example.com");
  console.log("   Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
