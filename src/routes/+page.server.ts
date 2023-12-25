import { db } from '$lib/server/db/client';
import * as schema from '$lib/server/db/schema';
export const load = async () => {
  await db.select()
    .from(schema.users)
    .then(console.info)
    .catch(console.error);
  return {};
}
