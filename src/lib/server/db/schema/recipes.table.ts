import { relations } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from '.';

export const recipes = pgTable(
	'recipes',
	{
		id: uuid('id').primaryKey(),
		title: varchar('title').notNull(),
		shortTitle: varchar('short_title').notNull(),
		recipeOwner: varchar('recipeOwner', { length: 15 }),
		body: text('text').notNull().default('')
	},
	({ shortTitle }) => ({
		shortNameIdx: uniqueIndex().on(shortTitle)
	})
);

export const userRecipes = relations(users, ({ many }) => {
	return {
		recipes: many(recipes)
	};
});

export const recipeOwner = relations(recipes, ({ one }) => {
	return {
		owner: one(users, {
			fields: [recipes.recipeOwner],
			references: [users.id]
		})
	};
});
