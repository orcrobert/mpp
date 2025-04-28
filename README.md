# Metal DB

A database application for managing metal bands and their albums.

## Prerequisites

- Node.js (v23.10.0 or higher)
- PostgreSQL
- npm

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd metal-db
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables by creating a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/metal_db"
```

4. Set up the database:
```bash
# Create and apply migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed the database with initial data
npm run seed
```

## Running the Application

1. Start the backend server (default port: 3000):
```bash
npx ts-node --esm src/server/api.ts
```

2. Start the frontend development server (default port: 3001):
```bash
npm run dev
```

## API Endpoints

### Bands
- `GET /entities` - Get all bands (with pagination, sorting, and filtering)
- `POST /entities` - Create a new band
- `PUT /entities/:id` - Update a band
- `DELETE /entities/:id` - Delete a band and its albums

### Albums
- `GET /bands/:bandId/albums` - Get all albums for a band
- `POST /bands/:bandId/albums` - Create a new album for a band

## Database Schema

### Band
- id (Int, auto-increment)
- name (String)
- genre (String)
- rating (Float)
- status (Boolean)
- theme (String)
- country (String)
- label (String)
- link (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Album
- id (Int, auto-increment)
- name (String)
- releaseYear (Int)
- rating (Float)
- bandId (Int, foreign key)
- createdAt (DateTime)
- updatedAt (DateTime)

## Development Notes

- The application uses ESM modules
- TypeScript is configured for Node.js ESM support
- Prisma is used for database operations
- Socket.IO is implemented for real-time updates
