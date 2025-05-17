import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

// Copy package.json to dist folder
console.log('Copying package.json...');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// Create a minimal package.json for production
const productionDependencies = {
  name: pkg.name,
  version: pkg.version,
  type: "module",
  main: "api.js",
  scripts: {
    start: "node api.js",
    "server:start": "node api.js"
  },
  dependencies: pkg.dependencies,
  engines: {
    node: "18.x"
  }
};

fs.writeFileSync(
  path.join(__dirname, 'dist', 'package.json'),
  JSON.stringify(productionDependencies, null, 2)
);

// Copy Prisma schema and migrations
console.log('Copying Prisma files...');
if (!fs.existsSync(path.join(__dirname, 'dist', 'prisma'))) {
  fs.mkdirSync(path.join(__dirname, 'dist', 'prisma'), { recursive: true });
}

fs.copyFileSync(
  path.join(__dirname, 'prisma', 'schema.prisma'),
  path.join(__dirname, 'dist', 'prisma', 'schema.prisma')
);

// Copy migrations folder
if (fs.existsSync(path.join(__dirname, 'prisma', 'migrations'))) {
  fs.cpSync(
    path.join(__dirname, 'prisma', 'migrations'),
    path.join(__dirname, 'dist', 'prisma', 'migrations'),
    { recursive: true }
  );
}

// Copy .ebextensions folder
if (fs.existsSync(path.join(__dirname, '.ebextensions'))) {
  fs.cpSync(
    path.join(__dirname, '.ebextensions'),
    path.join(__dirname, 'dist', '.ebextensions'),
    { recursive: true }
  );
}

// Copy Procfile
fs.copyFileSync(
  path.join(__dirname, 'Procfile'),
  path.join(__dirname, 'dist', 'Procfile')
);

// Create .env file for production
fs.writeFileSync(
  path.join(__dirname, 'dist', '.env'),
  'DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"\n' +
  'JWT_SECRET="placeholder"\n'
);

// Check for compiled server files
console.log('Verifying compiled server files...');
const apiJsFile = path.join(__dirname, 'dist', 'api.js');
const dbJsFile = path.join(__dirname, 'dist', 'db.js');

if (!fs.existsSync(apiJsFile)) {
  console.error('api.js was not found in the dist directory.');
  console.error('Make sure server:build command completed successfully.');
} else {
  console.log('✓ Server files found successfully');
}

// Install production dependencies
console.log('Installing production dependencies...');
spawnSync('npm', ['install', '--production'], { 
  cwd: path.join(__dirname, 'dist'),
  stdio: 'inherit'
});

console.log('Build completed successfully!'); 