# Development stage
FROM node:18 AS development
WORKDIR /usr/src/app
COPY package*.json ./
    RUN npm install --legacy-peer-deps
    COPY . .
    RUN rm -rf dist/ && \
        npm install --legacy-peer-deps && \
        sed -i 's/const generateString = () => crypto.randomUUID();/const generateString = () => (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js && \
        sed -i 's/const name = options.name || crypto.randomUUID();/const name = options.name || (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/schedule/dist/scheduler.orchestrator.js && \
        npm run build

# Production stage
FROM node:18 AS production
WORKDIR /usr/src/app
COPY package*.json ./
    RUN npm install --only=production --legacy-peer-deps && \
        sed -i 's/const generateString = () => crypto.randomUUID();/const generateString = () => (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js && \
        sed -i 's/const name = options.name || crypto.randomUUID();/const name = options.name || (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/schedule/dist/scheduler.orchestrator.js
COPY --from=development /usr/src/app/dist ./dist
COPY .env ./

EXPOSE 3000
CMD ["/bin/sh", "-c", "./startup.sh"]