// packages/cms/src/payload.config.ts
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Users, Tags, Ingredients, Media, Recipes } from './collections/index.js';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [Users, Tags, Ingredients, Media, Recipes],
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: 'dist/payload-types.ts',
  },
});
