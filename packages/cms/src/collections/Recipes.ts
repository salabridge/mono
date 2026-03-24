// packages/cms/src/collections/Recipes.ts
import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-populated from title. URL-friendly, e.g. "chicken-bacon-ranch"',
      },
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'prepTime',
      type: 'number',
      admin: { description: 'Prep time in minutes' },
    },
    {
      name: 'cookTime',
      type: 'number',
      admin: { description: 'Cook time in minutes' },
    },
    {
      name: 'ingredients',
      type: 'array',
      fields: [
        {
          name: 'ingredient',
          type: 'relationship',
          relationTo: 'ingredients',
          required: true,
        },
        {
          name: 'quantity',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "1 lb", "2 cups"' },
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'instruction',
          type: 'richText',
          editor: lexicalEditor({}),
          required: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'stepTime',
          type: 'number',
          admin: { description: 'Time for this step in minutes' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
  ],
};
