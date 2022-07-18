import { Client } from "@notionhq/client";
import slugify from "slugify";
import { createHash } from "crypto";
import { parse } from "path";
import EleventyFetch from "@11ty/eleventy-fetch";
import { fileTypeFromBuffer } from 'file-type';

async function readBlocks(client, blockId) {
  blockId = blockId.replaceAll("-", "");

  try {
    const { results } = await client.blocks.children.list({
      block_id: blockId,
    });

    const attachmentRequestsMap = results
      .filter(block => ["image", "video"]
      .includes(block.type)).map(async (block) => {
        return [block.id, await getAttachment(block)];
      });

    const attachmentsMap = new Map(await Promise.all(attachmentRequestsMap));
    let attachments = Array.from(attachmentsMap.values()); // LET! EW LET

    const childRequests = results.map(async (block) => {
      if (["image", "video"].includes(block.type)) {
        const configType = block[block.type].type;
        const attachment = attachmentsMap.get(block.id);
        block = {
          ...block,
          [block.type]: {
            ...block[block.type],
            [configType]: attachment,
          },
        };
      }
      if (block.has_children) {
        const [children, newAttachments] = await readBlocks(client, block.id);
        attachments = attachments.concat(newAttachments);
        return { ...block, children };
      }
      return block;
    });

    const expandedResults = await Promise.all(childRequests);
    return [expandedResults, attachments];
  } catch (error) {
    handleClientError(error);
  }
}

async function readPageInfo(client, pageId) {
  try {
    const { properties } = await client.pages.retrieve({
      page_id: pageId,
    });

    return properties;
  } catch (error) {
    handleClientError(error);
  }
}

async function readPage(client, pageId) {
  const pageInfo = readPageInfo(client, pageId);
  const pageContent = readBlocks(client, pageId);

  try {
    const [properties, [content, attachments]] = await Promise.all([
      pageInfo,
      pageContent,
    ]);

    const {
      Name: title,
      ["Publish Date"]: date,
      Excerpt: excerpt,
      Tags: tags,
    } = properties;

    return {
      slug: getSlug(title),
      frontMatter: { title, date, excerpt, tags, pageId },
      content,
      attachments,
    };
  } catch (error) {
    handleClientError(error);
  }
}

// TODO: better error handling
function handleClientError(error) {
  console.error(error.body || error);
}

function getClient(options) {
  const client = new Client(options);

  return {
    pages: {
      fetch(pageId) {
        return readPage(client, pageId);
      },
    },
  };
}

function getSlug({ title }) {
  return slugify(
    title
      .map(({ plain_text }) => plain_text)
      .join("")
      .toLowerCase(),
    {
      remove: /[:!\?\(\)]/g,
    }
  );
}

async function getAttachment({ type, [type]: { type: configType, [configType]: attachment } }) {
  const url = attachment.url;
  const urlWithoutQuery = url.split("?")[0];
  const buffer = await EleventyFetch(url, {
    type: "buffer",
    duration: "1d"
  });

  // I'm sorry. It has to be like this. Just for optimization
  let { name: filename, ext } = parse(urlWithoutQuery)
  ext = ext || "." + (await fileTypeFromBuffer(buffer)).ext

  const name =
    filename + "-" + createHash("sha1").update(urlWithoutQuery).digest("hex").slice(0, 8) + ext; // ew

  return {
    ...attachment,
    buffer,
    name,
  };
}

export { getClient };
