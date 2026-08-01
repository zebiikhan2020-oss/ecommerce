const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  await prisma.product.delete({
    where: {
      id: 3,
    },
  });

  console.log("Product 3 deleted.");

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());