import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import prisma from './db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const PORT = process.env.PORT || 3000;

export type FetchEntitiesParams = {
  search?: string;
  sort?: keyof Entity;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

type Entity = {
  id: number;
  name: string;
  genre: string;
  rating: number;
  status: boolean;
  theme: string;
  country: string;
  label: string;
  link: string;
};

const generateNewEntity = async (): Promise<Entity> => {
  const newEntity = {
    name: `Generated Band ${Math.floor(Math.random() * 100)}`,
    genre: ["Technical Death Metal", "Progressive Metal", "Melodic Death Metal", "Thrash Metal"][Math.floor(Math.random() * 4)],
    rating: parseFloat((Math.random() * 5 + 5).toFixed(1)),
    status: Math.random() < 0.8,
    theme: ["Philosophy", "Mathematics", "Nature", "Satanism"][Math.floor(Math.random() * 4)],
    country: ["Italy", "Sweden", "Poland", "United Kingdom"][Math.floor(Math.random() * 4)],
    label: ["Nuclear Blast", "Metal Blade", "Century Media Records", "Relapse Records"][Math.floor(Math.random() * 4)],
    link: "#"
  };

  try {
    return await prisma.band.create({
      data: newEntity,
      include: {
        albums: true
      }
    });
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
};

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  // Only send the first page of entities (e.g., 50) to avoid freezing
  const initialEntities = await prisma.band.findMany({
    skip: 0,
    take: 50,
    orderBy: { id: 'asc' },
    include: { albums: true }
  });
  socket.emit('initial_entities', initialEntities);

  let generationCount = 0;
  const maxGenerations = 0;

  const entityGenerationInterval = setInterval(async () => {
    if (generationCount < maxGenerations) {
      const newEntity = await generateNewEntity();
      io.emit('new_entity', newEntity);
      generationCount++;
    } else {
      clearInterval(entityGenerationInterval);
      console.log('Automatic entity generation stopped for this client.');
    }
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(entityGenerationInterval);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);
  });
});

app.get("/entities/health", (req, res) => {
  res.sendStatus(200);
});

app.get("/entities", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    let { search, sort, order, page, limit } = req.query as unknown as FetchEntitiesParams;
    page = page ? Math.max(1, page) : 1;
    limit = limit ? Math.max(1, limit) : 50;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { genre: { contains: search, mode: 'insensitive' as const } },
        { theme: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const orderBy = sort ? {
      [sort]: order === 'desc' ? 'desc' : 'asc'
    } : undefined;

    const [total, data] = await Promise.all([
      prisma.band.count({ where }),
      prisma.band.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          albums: true
        }
      })
    ]);
    res.json({ total, page, limit, data });
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/entities", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const newEntity = req.body;
    
    // Validate required fields
    if (!newEntity.name || !newEntity.genre || !newEntity.theme || !newEntity.country || !newEntity.label) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Ensure rating is a valid number between 0 and 10
    const rating = parseFloat(newEntity.rating.toString());
    if (isNaN(rating) || rating < 0 || rating > 10) {
      res.status(400).json({ error: 'Rating must be a number between 0 and 10' });
      return;
    }

    const createdEntity = await prisma.band.create({
      data: {
        name: newEntity.name,
        genre: newEntity.genre,
        rating: rating,
        status: Boolean(newEntity.status),
        theme: newEntity.theme,
        country: newEntity.country,
        label: newEntity.label,
        link: newEntity.link || '#'
      },
      include: {
        albums: true
      }
    });
    
    io.emit('new_entity', createdEntity);
    res.status(201).json(createdEntity);
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/entities/:id", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updatedEntity = req.body as Entity;
    
    const entity = await prisma.band.update({
      where: { id },
      data: updatedEntity,
      include: {
        albums: true
      }
    });
    
    io.emit('entity_updated', entity);
    res.json(entity);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete("/entities/:id", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    // Delete all albums first, then the band
    await prisma.$transaction(async (tx) => {
      await tx.album.deleteMany({
        where: { bandId: id }
      });
      await tx.band.delete({
        where: { id }
      });
    });
    
    io.emit('entity_deleted', id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Album endpoints
app.post("/bands/:bandId/albums", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const bandId = parseInt(req.params.bandId);
    const { name, releaseYear, rating } = req.body;
    
    const album = await prisma.album.create({
      data: {
        name,
        releaseYear,
        rating,
        bandId
      },
      include: {
        band: true
      }
    });
    
    res.status(201).json(album);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/bands/:bandId/albums", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const bandId = parseInt(req.params.bandId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [total, albums] = await Promise.all([
      prisma.album.count({ where: { bandId } }),
      prisma.album.findMany({
        where: { bandId },
        include: { band: true },
        skip,
        take: limit,
        orderBy: { id: 'asc' }
      })
    ]);
    res.json({ total, page, limit, albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats/top-genres-by-average-album-rating', async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
      SELECT "Band"."genre", AVG("Album"."rating") AS avg_rating, COUNT("Album"."id") AS album_count
      FROM "Album"
      JOIN "Band" ON "Album"."bandId" = "Band"."id"
      GROUP BY "Band"."genre"
      ORDER BY avg_rating DESC
      LIMIT 10;
    `;

    // Process results to convert BigInt to Number
    const processedResults = results.map(row => ({
      genre: row.genre,
      avg_rating: Number(row.avg_rating),
      album_count: Number(row.album_count)
    }));

    res.json(processedResults);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

app.get('/db-check', async (req, res) => {
  try {
    const bandCount = await prisma.band.count();
    const albumCount = await prisma.album.count();
    res.json({
      connection: 'OK',
      bandCount,
      albumCount,
      message: 'Database connection successful!'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: String(error) });
  }
});

app.get('/stats/test', (req, res) => {
  res.json({ message: 'Statistics endpoint is working!' });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});