import { NotFoundPage } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';
import config from '@salabridge/cms/payload.config';

const NotFound = async () => {
  const params = Promise.resolve({ segments: [] });
  const searchParams = Promise.resolve({});
  return NotFoundPage({ config, importMap, params, searchParams });
};

export default NotFound;
