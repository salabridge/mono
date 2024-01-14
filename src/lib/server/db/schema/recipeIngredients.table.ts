import { index, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { ingredients } from './ingredients.table';
import { recipes } from '.';
import { relations } from 'drizzle-orm';

export const recipeIngredients = pgTable(
	'recipe_ingredients',
	{
		id: uuid('id').primaryKey(),
		ingredientId: integer('ingredient_id')
			.notNull()
			.references(() => ingredients.id),
		recipeId: uuid('recipeId')
			.notNull()
			.references(() => recipes.id),
		amount: integer('amount').notNull(),
		unit: varchar('unit').notNull()
	},
	({ ingredientId }) => ({
		ingredientIdx: index('recipe_ingredient_idx').on(ingredientId)
	})
);

export const ingredientForRecipe = relations(recipeIngredients, ({ one }) => ({
	ingredient: one(ingredients, {
		fields: [recipeIngredients.ingredientId],
		references: [ingredients.id]
	})
}));

export const ingredientRecipe = relations(recipeIngredients, ({ one }) => ({
	recipe: one(recipes, {
		fields: [recipeIngredients.recipeId],
		references: [recipes.id]
	})
}));

export const ingredientsForRecipe = relations(recipes, ({ many }) => ({
	ingredients: many(recipeIngredients)
}));
