import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const bands = [
  { name: "Fleshgod Apocalypse", genre: "Technical Death Metal", rating: 9.8, status: true, theme: "Philosophy", country: "Italy", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185" },
  { name: "Meshuggah", genre: "Progressive Metal", rating: 7.8, status: true, theme: "Mathematics, Human Nature", country: "Sweden", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Meshuggah/240" },
  { name: "Opeth", genre: "Progressive Death Metal", rating: 9.5, status: true, theme: "Nature, Death, Mysticism", country: "Sweden", label: "Moderbolaget", link: "https://www.metal-archives.com/bands/Opeth/755" },
];

const albums = [
  { name: "Veleno", releaseYear: 2019, rating: 9.5, bandId: 1 },
  { name: "King", releaseYear: 2016, rating: 9.2, bandId: 1 },
  { name: "Koloss", releaseYear: 2012, rating: 8.5, bandId: 2 },
  { name: "ObZen", releaseYear: 2008, rating: 9.0, bandId: 2 },
  { name: "Blackwater Park", releaseYear: 2001, rating: 9.8, bandId: 3 },
  { name: "Ghost Reveries", releaseYear: 2005, rating: 9.6, bandId: 3 },
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.album.deleteMany();
  await prisma.band.deleteMany();

  // Create bands
  for (const band of bands) {
    const createdBand = await prisma.band.create({
      data: band
    });
    console.log(`Created band with id: ${createdBand.id}`);
  }

  // Create albums
  for (const album of albums) {
    const createdAlbum = await prisma.album.create({
      data: album
    });
    console.log(`Created album with id: ${createdAlbum.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 