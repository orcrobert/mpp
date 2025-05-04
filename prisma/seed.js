import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed the database...');

  // Clear existing data
  await prisma.album.deleteMany();
  await prisma.band.deleteMany();

  // Batching parameters
  const TOTAL_BANDS = 100_000;
  const BAND_BATCH_SIZE = 2000;
  const TOTAL_ALBUMS = 200_000;
  const ALBUM_BATCH_SIZE = 2000;

  // Create bands in batches
  console.log('Creating bands in batches...');
  let createdBandCount = 0;
  for (let i = 0; i < TOTAL_BANDS; i += BAND_BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BAND_BATCH_SIZE && i + j < TOTAL_BANDS; j++) {
      batch.push({
        name: faker.music.songName(),
        genre: faker.music.genre(),
        rating: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
        status: faker.datatype.boolean(),
        theme: faker.music.genre(),
        country: faker.location.country(),
        label: faker.company.name(),
        link: faker.internet.url(),
      });
    }
    const created = await prisma.band.createMany({ data: batch, skipDuplicates: true });
    createdBandCount += created.count;
    if ((i / BAND_BATCH_SIZE) % 5 === 0) {
      console.log(`Bands created so far: ${createdBandCount}`);
    }
  }
  console.log(`Created ${createdBandCount} bands`);

  // Fetch all band IDs (for album association)
  const bandIds = await prisma.band.findMany({ select: { id: true } });
  const bandIdArray = bandIds.map(b => b.id);

  // Create albums in batches
  console.log('Creating albums in batches...');
  let createdAlbumCount = 0;
  for (let i = 0; i < TOTAL_ALBUMS; i += ALBUM_BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < ALBUM_BATCH_SIZE && i + j < TOTAL_ALBUMS; j++) {
      const randomBandId = bandIdArray[Math.floor(Math.random() * bandIdArray.length)];
      batch.push({
        name: faker.music.songName(),
        releaseYear: faker.number.int({ min: 1960, max: 2024 }),
        rating: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
        bandId: randomBandId,
      });
    }
    const created = await prisma.album.createMany({ data: batch, skipDuplicates: true });
    createdAlbumCount += created.count;
    if ((i / ALBUM_BATCH_SIZE) % 5 === 0) {
      console.log(`Albums created so far: ${createdAlbumCount}`);
    }
  }
  console.log(`Created ${createdAlbumCount} albums`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });