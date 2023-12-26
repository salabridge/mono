import { bigint, varchar } from 'drizzle-orm/pg-core';
import { authSchema } from './auth.schema';
import { users } from './users.table';

export const sessions = authSchema.table('sessions', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).references(() => users.id),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
});
