// packages/cms/src/collections/Ingredients.ts
import type { CollectionConfig } from 'payload';

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Grams (g)', value: 'g' },
        { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Ounces (oz)', value: 'oz' },
        { label: 'Pounds (lb)', value: 'lb' },
        { label: 'Milliliters (ml)', value: 'ml' },
        { label: 'Liters (l)', value: 'l' },
        { label: 'Teaspoon (tsp)', value: 'tsp' },
        { label: 'Tablespoon (tbsp)', value: 'tbsp' },
        { label: 'Cup', value: 'cup' },
        { label: 'Piece', value: 'piece' },
        { label: 'Pinch', value: 'pinch' },
        { label: 'To taste', value: 'to taste' },
      ],
    },
  ],
};
