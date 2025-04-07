import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

let entities: Entity[] = [
  { id: 1, name: "Fleshgod Apocalypse", genre: "Technical Death Metal", rating: 9.8, status: true, theme: "Philosophy", country: "Italy", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185" },
  { id: 2, name: "Meshuggah", genre: "Progressive Metal", rating: 7.8, status: true, theme: "Mathematics, Human Nature", country: "Sweden", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Meshuggah/240" },
  { id: 3, name: "Opeth", genre: "Progressive Death Metal", rating: 9.5, status: true, theme: "Nature, Death, Mysticism", country: "Sweden", label: "Moderbolaget", link: "https://www.metal-archives.com/bands/Opeth/755" },
  { id: 4, name: "Behemoth", genre: "Blackened Death Metal", rating: 8.7, status: true, theme: "Satanism, Anti-Christianity", country: "Poland", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Behemoth/605" },
  { id: 5, name: "Carcass", genre: "Melodic Death Metal", rating: 9.0, status: true, theme: "Gore, Medical Themes", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Carcass/188" },
  { id: 6, name: "Gojira", genre: "Progressive Metal, Death Metal", rating: 7.2, status: true, theme: "Environmentalism, Nature", country: "France", label: "Roadrunner Records", link: "https://www.metal-archives.com/bands/Gojira/7815" },
  { id: 7, name: "Amon Amarth", genre: "Melodic Death Metal", rating: 8.9, status: true, theme: "Viking Mythology, Norse Mythology", country: "Sweden", label: "Metal Blade", link: "https://www.metal-archives.com/bands/Amon_Amarth/739" },
  { id: 8, name: "Dark Tranquillity", genre: "Melodic Death Metal", rating: 9.9, status: true, theme: "Melancholy, War", country: "Sweden", label: "Century Media Records", link: "https://www.metal-archives.com/bands/Dark_Tranquillity/149" },
  { id: 9, name: "Death", genre: "Death Metal", rating: 9.5, status: false, theme: "Philosophy, Death, Mental Struggles", country: "United States", label: "Relapse Records", link: "https://www.metal-archives.com/bands/Death/70" },
  { id: 10, name: "Sylosis", genre: "Thrash Metal, Progressive Metal", rating: 7.6, status: true, theme: "Personal Struggles, Inner Turmoil", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Sylosis/35492" },
  { id: 11, name: "Fleshgod Apocalypse II", genre: "Technical Death Metal", rating: 9.7, status: true, theme: "History", country: "Italy", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185" },
  { id: 12, name: "Meshuggah II", genre: "Progressive Metal", rating: 7.9, status: true, theme: "Science Fiction", country: "Sweden", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Meshuggah/240" },
  { id: 13, name: "Opeth II", genre: "Progressive Death Metal", rating: 9.4, status: true, theme: "Love, Loss", country: "Sweden", label: "Moderbolaget", link: "https://www.metal-archives.com/bands/Opeth/755" },
  { id: 14, name: "Behemoth II", genre: "Blackened Death Metal", rating: 8.6, status: true, theme: "Occultism", country: "Poland", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Behemoth/605" },
  { id: 15, name: "Carcass II", genre: "Melodic Death Metal", rating: 9.1, status: true, theme: "Politics", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Carcass/188" },
  { id: 16, name: "Gojira II", genre: "Progressive Metal, Death Metal", rating: 7.1, status: true, theme: "Space", country: "France", label: "Roadrunner Records", link: "https://www.metal-archives.com/bands/Gojira/7815" },
  { id: 17, name: "Amon Amarth II", genre: "Melodic Death Metal", rating: 8.8, status: true, theme: "Battles", country: "Sweden", label: "Metal Blade", link: "https://www.metal-archives.com/bands/Amon_Amarth/739" },
  { id: 18, name: "Dark Tranquillity II", genre: "Melodic Death Metal", rating: 9.8, status: true, theme: "Time", country: "Sweden", label: "Century Media Records", link: "https://www.metal-archives.com/bands/Dark_Tranquillity/149" },
  { id: 19, name: "Death II", genre: "Death Metal", rating: 9.4, status: false, theme: "Society", country: "United States", label: "Relapse Records", link: "https://www.metal-archives.com/bands/Death/70" },
  { id: 20, name: "Sylosis II", genre: "Thrash Metal, Progressive Metal", rating: 7.5, status: true, theme: "Technology", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Sylosis/35492" },
  { id: 21, name: "Fleshgod Apocalypse III", genre: "Technical Death Metal", rating: 9.9, status: true, theme: "Mythology", country: "Italy", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185" },
  { id: 22, name: "Meshuggah III", genre: "Progressive Metal", rating: 7.7, status: true, theme: "Existentialism", country: "Sweden", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Meshuggah/240" },
  { id: 23, name: "Opeth III", genre: "Progressive Death Metal", rating: 9.6, status: true, theme: "Seasons", country: "Sweden", label: "Moderbolaget", link: "https://www.metal-archives.com/bands/Opeth/755" },
  { id: 24, name: "Behemoth III", genre: "Blackened Death Metal", rating: 8.5, status: true, theme: "Apocalypse", country: "Poland", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Behemoth/605" },
  { id: 25, name: "Carcass III", genre: "Melodic Death Metal", rating: 9.2, status: true, theme: "Mortality", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Carcass/188" },
  { id: 26, name: "Gojira III", genre: "Progressive Metal, Death Metal", rating: 7.3, status: true, theme: "Ocean", country: "France", label: "Roadrunner Records", link: "https://www.metal-archives.com/bands/Gojira/7815" },
  { id: 27, name: "Amon Amarth III", genre: "Melodic Death Metal", rating: 9.0, status: true, theme: "Gods", country: "Sweden", label: "Metal Blade", link: "https://www.metal-archives.com/bands/Amon_Amarth/739" },
  { id: 28, name: "Dark Tranquillity III", genre: "Melodic Death Metal", rating: 10.0, status: true, theme: "Dreams", country: "Sweden", label: "Century Media Records", link: "https://www.metal-archives.com/bands/Dark_Tranquillity/149" },
  { id: 29, name: "Death III", genre: "Death Metal", rating: 9.6, status: false, theme: "Consciousness", country: "United States", label: "Relapse Records", link: "https://www.metal-archives.com/bands/Death/70" },
  { id: 30, name: "Sylosis III", genre: "Thrash Metal, Progressive Metal", rating: 7.7, status: true, theme: "Dystopia", country: "United Kingdom", label: "Nuclear Blast", link: "https://www.metal-archives.com/bands/Sylosis/35492" },
];

const generateNewEntity = (): Entity => {
  const newId = entities.length + 1;
  return {
    id: newId,
    name: `Generated Band ${newId}`,
    genre: ["Technical Death Metal", "Progressive Metal", "Melodic Death Metal", "Thrash Metal"][Math.floor(Math.random() * 4)],
    rating: parseFloat((Math.random() * 5 + 5).toFixed(1)),
    status: Math.random() < 0.8,
    theme: ["Philosophy", "Mathematics", "Nature", "Satanism"][Math.floor(Math.random() * 4)],
    country: ["Italy", "Sweden", "Poland", "United Kingdom"][Math.floor(Math.random() * 4)],
    label: ["Nuclear Blast", "Metal Blade", "Century Media Records", "Relapse Records"][Math.floor(Math.random() * 4)],
    link: "#",
  };
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('initial_entities', entities);

  let generationCount = 0;
  const maxGenerations = Math.floor(Math.random() * 11) + 10;

  const entityGenerationInterval = setInterval(() => {
    if (generationCount < maxGenerations) {
      const newEntity = generateNewEntity();
      entities.push(newEntity);
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

app.get("/entities", (req: express.Request, res: express.Response): void => {
  let { search, sort, order, page, limit } = req.query as unknown as FetchEntitiesParams;

  let filteredEntities = [...entities];

  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredEntities = filteredEntities.filter(entity =>
      entity.name.toLowerCase().includes(lowerSearch) ||
      entity.genre.toLowerCase().includes(lowerSearch) ||
      entity.theme.toLowerCase().includes(lowerSearch)
    );
  }

  if (sort && ["name", "genre", "rating", "country", "label"].includes(sort)) {
    filteredEntities.sort((a, b) => {
      const valueA = a[sort] as string | number;
      const valueB = b[sort] as string | number;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "desc" ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
      }
      return order === "desc" ? (valueB as number) - (valueA as number) : (valueA as number) - (valueB as number);
    });
  }

  page = page ? Math.max(1, page) : 1;
  limit = limit ? Math.max(1, limit) : 10;
  const startIndex = (page - 1) * limit;
  const paginatedEntities = filteredEntities.slice(startIndex, startIndex + limit);

  res.json({ total: filteredEntities.length, page, limit, data: paginatedEntities });
});

app.post("/entities", (req: express.Request, res: express.Response): void => {
  const newEntity = req.body as Entity;
  newEntity.id = entities.length + 1;
  entities.push(newEntity);
  io.emit('new_entity', newEntity);
  res.status(201).json(newEntity);
});

app.put("/entities/:id", (req: express.Request<{ id: string }>, res: express.Response): void => {
  const id = parseInt(req.params.id, 10);
  const updatedEntity = req.body as Partial<Entity>;

  const index = entities.findIndex((entity) => entity.id === id);
  if (index === -1) {
    res.status(404).json({ message: "Entity not found" });
    return;
  }

  entities[index] = { ...entities[index], ...updatedEntity };
  io.emit('updated_entity', { id, updatedEntity });
  res.json(entities[index]);
});

app.delete("/entities/:id", (req: express.Request<{ id: string }>, res: express.Response): void => {
  const id = parseInt(req.params.id, 10);
  entities = entities.filter((entity) => entity.id !== id);
  io.emit('deleted_entity', id);
  res.sendStatus(204);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});