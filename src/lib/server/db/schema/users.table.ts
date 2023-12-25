import { varchar, jsonb } from 'drizzle-orm/pg-core';

import { authSchema } from './auth.schema';

export const users = authSchema.table('users', {
	id: varchar('id', { length: 15 }).primaryKey(),
	username: varchar('username').unique(),
	metadata: jsonb('raw_user_metadata').$type<{
		avatar_url: string;
	}>()
});
