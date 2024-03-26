import { index, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const ingredients = pgTable(
	'ingredients',
	{
		id: serial('id').primaryKey(),
		name: varchar('name').notNull(),
		description: varchar('description'),
		url: text('url'),
		imageUrl: text('url')
	},
	({ name, url }) => ({
		// Add an index on the name so that it is quickly searchable.
		nameIdx: index('name_idx').on(name),
    // Gonna need the url
    urlIdx: index('url_idx').on(url),
	})
);
