import type { Config } from 'drizzle-kit';

import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/server/db/schema/index.ts',
  out: './migrations',
  driver: 'pg',
  schemaFilter: ['auth', 'public'],
  dbCredentials: {
    connectionString: `${process.env.DB_URL}require`,
  },
} satisfies Config;