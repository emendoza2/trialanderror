import { Client } from "@notionhq/client";
import fetch from "node-fetch";
import slugify from "slugify";
import { createHash } from "crypto";
import { extname } from "path";
import mime from "mime";

async function readBlocks(client, blockId) {
  blockId = blockId.replaceAll("-", "");

  try {
    const { results } = await client.blocks.children.list({
      block_id: blockId,
    });
    let attachments = [];

    const childRequests = results.map(async (block) => {
      if (block.has_children) {
        const children = await readBlocks(client, block.id);
        return { ...block, children };
      } else if (["image", "video"].includes(block.type)) {
        const configType = block[block.type].type;
        const url = block[block.type][configType].url;
        const urlWithoutQuery = url.split("?")[0];
        const blob = await fetch(url).then((res) => res.blob());
        const name =
          createHash("sha1").update(urlWithoutQuery).digest("hex") +
          (extname(urlWithoutQuery) || "." + mime.getExtension(blob.type)); // ew
        const attachment = {
          ...block[block.type][configType],
          blob,
          name,
        };
        attachments.push(attachment); // side effects hmmmmm
        return {
          ...block,
          [block.type]: {
            ...block[block.type],
            [configType]: attachment,
          },
        };
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
      frontMatter: { title, date, excerpt, tags },
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
      remove: /[:!\?]/g,
    }
  );
}

export { getClient };
