//@ts-check
import { writeFile, mkdir } from 'fs/promises';

import { getClient } from './client.mjs';
import { getPrinter } from './printer.mjs';
import { formatters, frontMatter } from './formatter-markdown.mjs';

const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: npm run publish:page [pageId]\n');
    return 1;
  }

  const pageId = process.argv[2];
  const client = getClient({
    auth: NOTION_API_KEY,
  });

  const printer = getPrinter(formatters, { frontMatter });

  try {
    const data = await client.pages.fetch(pageId);
    const dir = `./src/posts/${data?.slug}`;

    await mkdir(dir, { recursive: true });
    const attachmentPromises = data?.attachments.map(({ blob, name }) => {
      return writeFile(`${dir}/${name}`, blob.stream())
    })
    const fileWriter = writeFile(`${dir}/index.md`, printer.print(data));
    return await Promise.all([...attachmentPromises, fileWriter]);
  } catch (error) {
    console.error(error);
  }

  return 1;
}

main();