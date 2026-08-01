const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        seller: true,
      },
    });
    
    console.log('Total products:', products.length);
    console.log('\nProducts:');
    products.forEach(p => {
      console.log(`- ${p.title} (ID: ${p.id})`);
      console.log(`  Price: Rs. ${p.price}, Stock: ${p.stock}`);
      console.log(`  Active: ${p.isActive}, Image: ${p.image}`);
      console.log(`  Category: ${p.category?.name}, Seller: ${p.seller?.name}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
