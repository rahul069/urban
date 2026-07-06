# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy local UI library
COPY libs/ui ./libs/ui

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]