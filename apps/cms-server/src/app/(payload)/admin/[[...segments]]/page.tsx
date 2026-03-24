import type { Metadata } from 'next';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';
import config from '@salabridge/cms/payload.config';

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}): Promise<Metadata> => {
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) => {
  return RootPage({ config, importMap, params, searchParams });
};

export default Page;
