# Use official Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
COPY package*.json ./
RUN npm install && npm link ../../libs/ui

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Use Nginx for serving the app
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]