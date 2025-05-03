import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed the database...');

  // Create 100,000 bands
  const bands = [];
  for (let i = 0; i < 100000; i++) {
    bands.push({
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

  console.log('Creating bands...');
  const createdBands = await prisma.band.createMany({
    data: bands,
    skipDuplicates: true,
  });
  console.log(`Created ${createdBands.count} bands`);

  // Create 200,000 albums (2 per band on average)
  const albums = [];
  const bandIds = await prisma.band.findMany({
    select: { id: true },
  });

  for (let i = 0; i < 200000; i++) {
    const randomBandId = bandIds[Math.floor(Math.random() * bandIds.length)].id;
    albums.push({
      name: faker.music.songName(),
      releaseYear: faker.number.int({ min: 1960, max: 2024 }),
      rating: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
      bandId: randomBandId,
    });
  }

  console.log('Creating albums...');
  const createdAlbums = await prisma.album.createMany({
    data: albums,
    skipDuplicates: true,
  });
  console.log(`Created ${createdAlbums.count} albums`);

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