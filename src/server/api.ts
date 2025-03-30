import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // or whatever your front-end URL is
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const PORT = process.env.PORT || 3000;


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
  {
    id: 1,
    name: "Fleshgod Apocalypse",
    genre: "Technical Death Metal",
    rating: 9.8,
    status: true,
    theme: "Philosophy",
    country: "Italy",
    label: "Nuclear Blast",
    link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185",
  },
  {
    id: 2,
    name: "Meshuggah",
    genre: "Progressive Metal",
    rating: 7.8,
    status: true,
    theme: "Mathematics, Human Nature",
    country: "Sweden",
    label: "Nuclear Blast",
    link: "https://www.metal-archives.com/bands/Meshuggah/240",
  },
  {
    id: 3,
    name: "Opeth",
    genre: "Progressive Death Metal",
    rating: 9.5,
    status: true,
    theme: "Nature, Death, Mysticism",
    country: "Sweden",
    label: "Moderbolaget",
    link: "https://www.metal-archives.com/bands/Opeth/755",
  },
  {
    id: 4,
    name: "Behemoth",
    genre: "Blackened Death Metal",
    rating: 8.7,
    status: true,
    theme: "Satanism, Anti-Christianity",
    country: "Poland",
    label: "Nuclear Blast",
    link: "https://www.metal-archives.com/bands/Behemoth/605",
  },
  {
    id: 5,
    name: "Carcass",
    genre: "Melodic Death Metal",
    rating: 9.0,
    status: true,
    theme: "Gore, Medical Themes",
    country: "United Kingdom",
    label: "Nuclear Blast",
    link: "https://www.metal-archives.com/bands/Carcass/188",
  },
  {
    id: 6,
    name: "Gojira",
    genre: "Progressive Metal, Death Metal",
    rating: 7.2,
    status: true,
    theme: "Environmentalism, Nature",
    country: "France",
    label: "Roadrunner Records",
    link: "https://www.metal-archives.com/bands/Gojira/7815",
  },
  {
    id: 7,
    name: "Amon Amarth",
    genre: "Melodic Death Metal",
    rating: 8.9,
    status: true,
    theme: "Viking Mythology, Norse Mythology",
    country: "Sweden",
    label: "Metal Blade",
    link: "https://www.metal-archives.com/bands/Amon_Amarth/739",
  },
  {
    id: 8,
    name: "Dark Tranquillity",
    genre: "Melodic Death Metal",
    rating: 9.9,
    status: true,
    theme: "Melancholy, War",
    country: "Sweden",
    label: "Century Media Records",
    link: "https://www.metal-archives.com/bands/Dark_Tranquillity/149",
  },
  {
    id: 9,
    name: "Death",
    genre: "Death Metal",
    rating: 9.5,
    status: false,
    theme: "Philosophy, Death, Mental Struggles",
    country: "United States",
    label: "Relapse Records",
    link: "https://www.metal-archives.com/bands/Death/70",
  },
  {
    id: 10,
    name: "Sylosis",
    genre: "Thrash Metal, Progressive Metal",
    rating: 7.6,
    status: true,
    theme: "Personal Struggles, Inner Turmoil",
    country: "United Kingdom",
    label: "Nuclear Blast",
    link: "https://www.metal-archives.com/bands/Sylosis/35492",
  },
];

app.get("/entities", (req: express.Request, res: express.Response): void => {
  res.json(entities);
});

app.post("/entities", (req: express.Request, res: express.Response): void => {
  const newEntity = req.body as Entity;
  newEntity.id = entities.length + 1;
  entities.push(newEntity);
  res.status(201).json(newEntity);
});

app.put(
  "/entities/:id",
  (req: express.Request<{ id: string }>, res: express.Response): void => {
    const id = parseInt(req.params.id, 10);
    const updatedEntity = req.body as Partial<Entity>;

    const index = entities.findIndex((entity) => entity.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Entity not found" });
      return;
    }

    entities[index] = { ...entities[index], ...updatedEntity };
    res.json(entities[index]);
  }
);

app.delete(
  "/entities/:id",
  (req: express.Request<{ id: string }>, res: express.Response): void => {
    const id = parseInt(req.params.id, 10);
    entities = entities.filter((entity) => entity.id !== id);
    res.sendStatus(204);
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});