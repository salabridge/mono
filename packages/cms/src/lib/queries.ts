// packages/cms/src/lib/queries.ts
import { getPayload } from './getPayload.js';

export async function getPublishedRecipes() {
  const cms = await getPayload();
  return cms.find({
    collection: 'recipes',
    where: { status: { equals: 'published' } },
    depth: 2,
  });
}

export async function getRecipeBySlug(slug: string) {
  const cms = await getPayload();
  const result = await cms.find({
    collection: 'recipes',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  });
  return result.docs[0] ?? null;
}
