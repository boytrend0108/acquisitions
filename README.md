# Application with Neon Database Integration

This application is configured to work with both Neon Local for development and Neon Cloud Database for production. Below are the instructions for setting up and running the application in both environments.

## Development Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js (for local development)
- Git

### Development Environment Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd acquisitions
   ```

2. Copy the development environment file:

   ```bash
   cp .env.development .env
   ```

3. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

This will:

- Start the Neon Local database container
- Start your application in development mode
- Mount your local code into the container for hot reloading

The application will be available at `http://localhost:3000`

### Development Database Access

- Database URL: `postgres://user:password@localhost:5432/dbname`
- Inside Docker network: `postgres://user:password@neon-local:5432/dbname`

## Production Setup

### Prerequisites

- Neon Cloud Database account and project
- Access to production environment

### Production Environment Setup

1. Create a copy of the production environment file:

   ```bash
   cp .env.production .env
   ```

2. Set up your production environment variables:

   ```bash
   # Required environment variables
   export NEON_USER=your-username
   export NEON_PASSWORD=your-password
   export NEON_HOST=your-project-id.cloud.neon.tech
   export NEON_DATABASE=your-database-name
   export DATABASE_URL=postgres://${NEON_USER}:${NEON_PASSWORD}@${NEON_HOST}/${NEON_DATABASE}
   ```

3. Start the production environment:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Environment Variables

### Development (.env.development)

- `NODE_ENV`: Set to "development"
- `DATABASE_URL`: Local Neon database connection string
- `NEON_LOCAL_PORT`: Port for Neon Local (default: 5432)
- `NEON_LOCAL_USER`: Local database user
- `NEON_LOCAL_PASSWORD`: Local database password
- `NEON_LOCAL_DB`: Local database name

### Production (.env.production)

- `NODE_ENV`: Set to "production"
- `DATABASE_URL`: Neon Cloud connection string
- `NEON_USER`: Neon Cloud username
- `NEON_PASSWORD`: Neon Cloud password
- `NEON_HOST`: Neon Cloud host
- `NEON_DATABASE`: Neon Cloud database name

## Additional Commands

### View Logs

```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

### Stop the Application

```bash
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose -f docker-compose.prod.yml down
```

### Reset Development Database

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

## Security Notes

- Never commit .env files containing real credentials
- Use secrets management in production
- Regularly rotate database credentials
- Keep the Neon Local instance secured behind a firewall in development
