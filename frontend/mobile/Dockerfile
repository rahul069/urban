# React Native Dockerfile (for CI/CD builds)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app (adjust for iOS/Android)
RUN npm run build

# Final stage (optional, for serving static files)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]