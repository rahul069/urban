#!/bin/sh

# Fix crypto issues in NestJS modules
echo "Applying crypto fixes..."

# Fix for @nestjs/typeorm
if [ -f node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js ]; then
  sed -i 's/const generateString = () => crypto.randomUUID();/const generateString = () => (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js
  echo "Fixed @nestjs/typeorm"
fi

# Fix for @nestjs/schedule
if [ -f node_modules/@nestjs/schedule/dist/scheduler.orchestrator.js ]; then
  sed -i 's/const name = options.name || crypto.randomUUID();/const name = options.name || (Math.random() + 1).toString(36).substring(2);/' node_modules/@nestjs/schedule/dist/scheduler.orchestrator.js
  echo "Fixed @nestjs/schedule"
fi

# Start the application
echo "Starting NestJS application..."
exec node dist/main