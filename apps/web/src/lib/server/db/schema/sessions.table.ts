import { index, timestamp, text } from 'drizzle-orm/pg-core';
import { authSchema } from './auth.schema';
import { users } from './users.table';

export const sessions = authSchema.table(
	'sessions',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		expiresAt: timestamp('expires_at', {
			withTimezone: true,
			mode: 'date'
		}).notNull()
	},
	({ userId }) => ({
		userIndex: index('session_user_idx').on(userId)
	})
);
