import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';

if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

// Configure SSL settings based on environment
const sslConfig =
  process.env.NODE_ENV === 'development'
    ? { ssl: { rejectUnauthorized: false } } // Disable SSL verification for local development
    : undefined; // Use default secure SSL settings in production

const sql = neon(process.env.DATABASE_URL, sslConfig);
const db = drizzle({ client: sql });

export { db, sql };
