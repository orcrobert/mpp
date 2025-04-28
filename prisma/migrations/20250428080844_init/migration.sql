-- CreateTable
CREATE TABLE "Band" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "theme" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "bandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
