const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  const categories = [
    "Mobiles",
    "Laptops",
    "Watches",
    "Accessories",
    "Tablets",
    "Audio",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const couriers = [
    {
      name: "TCS",
      description: "Nationwide delivery",
      basePrice: 250,
      estimatedDays: 3,
    },
    {
      name: "Leopards",
      description: "Express courier",
      basePrice: 300,
      estimatedDays: 2,
    },
    {
      name: "PostEx",
      description: "Economy shipping",
      basePrice: 150,
      estimatedDays: 5,
    },
  ];

  for (const c of couriers) {
    await prisma.courier.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }

  console.log("Seed completed successfully.");
} // <-- Yeh closing bracket missing tha

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());