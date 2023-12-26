import { pgTable, uuid, varchar, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const recipes = pgTable(
	'recipes',
	{
		id: uuid('id').primaryKey(),
		title: varchar('title').notNull(),
		shortTitle: varchar('short_title').notNull(),
		recipeOwner: varchar('recipeOwner', { length: 15 }),
		body: text('text').notNull().default(''),
	},
	({ shortTitle }) => ({
		shortNameIdx: uniqueIndex().on(shortTitle)
	})
);
