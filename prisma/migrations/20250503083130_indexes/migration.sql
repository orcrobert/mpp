-- CreateIndex
CREATE INDEX "Album_name_idx" ON "Album"("name");

-- CreateIndex
CREATE INDEX "Album_releaseYear_idx" ON "Album"("releaseYear");

-- CreateIndex
CREATE INDEX "Album_rating_idx" ON "Album"("rating");

-- CreateIndex
CREATE INDEX "Album_bandId_idx" ON "Album"("bandId");

-- CreateIndex
CREATE INDEX "Album_bandId_rating_idx" ON "Album"("bandId", "rating");

-- CreateIndex
CREATE INDEX "Album_releaseYear_rating_idx" ON "Album"("releaseYear", "rating");

-- CreateIndex
CREATE INDEX "Band_name_idx" ON "Band"("name");

-- CreateIndex
CREATE INDEX "Band_genre_idx" ON "Band"("genre");

-- CreateIndex
CREATE INDEX "Band_rating_idx" ON "Band"("rating");

-- CreateIndex
CREATE INDEX "Band_country_idx" ON "Band"("country");

-- CreateIndex
CREATE INDEX "Band_genre_rating_idx" ON "Band"("genre", "rating");

-- CreateIndex
CREATE INDEX "Band_country_rating_idx" ON "Band"("country", "rating");
