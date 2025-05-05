import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to clear the database...');

  try {
    // Delete all albums first (due to foreign key constraints)
    console.log('Deleting albums...');
    const deletedAlbums = await prisma.album.deleteMany();
    console.log(`Deleted ${deletedAlbums.count} albums`);

    // Then delete all bands
    console.log('Deleting bands...');
    const deletedBands = await prisma.band.deleteMany();
    console.log(`Deleted ${deletedBands.count} bands`);

    console.log('Database clearing completed!');
  } catch (error) {
    console.error('Error clearing the database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });