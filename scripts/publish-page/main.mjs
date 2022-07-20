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
    if (!data) throw new Error("No data found for page with id " + pageId);

    const dir = `./src/posts/${data?.slug}`;

    await mkdir(dir, { recursive: true });
    const attachmentPromises = data?.attachments.map(({ buffer, name }) => {
      return writeFile(`${dir}/${name}`, buffer, { flag: 'wx' }).catch(err => {
        if (err?.code === 'EEXIST') console.log("Not overwriting", `${dir}/${name}`);
        else console.warn(err);
      })
    })
    const fileWriter = writeFile(`${dir}/index.md`, printer.print(data));
    const results = await Promise.all([...attachmentPromises, fileWriter]);
    
    console.log("Published", dir);
    return results;
  } catch (error) {
    console.error(error);
  }

  return 1;
}

main();
