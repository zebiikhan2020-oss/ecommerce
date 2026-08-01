const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProducts() {
  try {
    // Activate the inactive duplicate product instead of deleting
    const updated = await prisma.product.update({
      where: { id: 3 },
      data: { isActive: true },
    });
    console.log('Activated product:', updated.title);
    
    // Verify all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        seller: true,
      },
    });
    
    console.log('\nActive products:', products.length);
    products.forEach(p => {
      console.log(`- ${p.title} (ID: ${p.id})`);
      console.log(`  Image: ${p.image}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProducts();
