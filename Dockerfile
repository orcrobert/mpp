FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM deps AS builder
COPY . .
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Create upload directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"] 