import { varchar } from 'drizzle-orm/pg-core';
import { authSchema } from '.';

export const key = authSchema.table(
  'key',
  {
    id: varchar('id',  { length: 255 }).primaryKey(),
    userId: varchar('user_id').notNull(),
    hashedPassword: varchar('hashed_password', {
      length: 255,
    })
  }
);
