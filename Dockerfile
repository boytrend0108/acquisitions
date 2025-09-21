# Use Node.js LTS version
FROM node:20-slim

# Create a non-root user
RUN groupadd -r nodeapp && useradd -r -g nodeapp -m -d /home/nodeapp nodeapp

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Bundle app source
COPY . .

# Set correct ownership
RUN chown -R nodeapp:nodeapp /usr/src/app

# Use development or production env file based on NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then \
  cp .env.production .env; \
  else \
  cp .env.development .env; \
  fi

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 3000

# Start the application (watch mode in development, normal mode in production)
CMD if [ "$NODE_ENV" = "development" ]; then \
  node --watch src/index.js; \
  else \
  npm start; \
  fi