const path = require("path");
const htmlmin = require("html-minifier");
const MarkdownIt = require("markdown-it"),
  mk = require("markdown-it-katex"),
  { removeMdPlugin } = require("markdown-it-remove");

const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const excerptFilter = require("./plugins/excerpt");

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  typographer: true,
};

const md = new MarkdownIt(MARKDOWN_OPTIONS).use(mk);
const mdStrip = new MarkdownIt(MARKDOWN_OPTIONS).use(removeMdPlugin, {}); // should this have mk as well?

module.exports = function (eleventyConfig) {
  /**
   * Upgrade helper
   * Uncomment if you need help upgrading to new major version.
   */
  //eleventyConfig.addPlugin(UpgradeHelper);

  /**
   * Files to copy
   * https://www.11ty.dev/docs/copy/
   */
  // eleventyConfig.addPassthroughCopy("src/img");

  // Evil.
  /**
   * TODO: please please please optimize images :)
   */
  eleventyConfig.addPassthroughCopy(
    "src/**/*.(png|jpg|jpeg|gif|svg|webp|avif)"
  );

  eleventyConfig.addPassthroughCopy({ static: "/" });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(syntaxHighlight);

  /**
   * Frontmatter stuff
   */
  // eleventyConfig.setFrontMatterParsingOptions({
  //   excerpt: true,
  //   excerpt_separator: "<!-- excerpt -->",
  // });

  /**
   * HTML Minifier for production builds
   */
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV == "production" &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  /**
   * Filters
   */
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  eleventyConfig.addFilter("toHTML", (str) => {
    try {
      return md.renderInline(str);
    } catch (e) {
      return str;
    }
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return dateObj.toJSON().slice(0, 10);
  });

  eleventyConfig.addFilter(
    "excerpt",
    excerptFilter(md, ["<!-- excerpt -->", "<p>---</p>", "</p>"])
  );
  /**
   * Shortcodes
   */
  eleventyConfig.addShortcode("mentionPageId", function (pageId){
    const { url, data: { title } } = this.ctx.collections.all.find(page => {
      return normalizePageId(page.data?.pageId) === normalizePageId(pageId)
    });
    console.log(url, title)
    if (!url || !title) return `[link]`;
    return `[${title}](${url})`;
  })
  eleventyConfig.addPairedShortcode("figure", function (content, caption = "") {
    return `<figure>${md.renderInline(
      content.trim()
    )}${caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : ""}</figure>`;
  });
  eleventyConfig.addPairedShortcode("aside", function(content) {
    return `<aside>${md.renderInline(content.trim())}</aside>`;
  });
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  return {
    dir: {
      input: "src",
      data: "../_data",
      layouts: "_includes/layouts",
    },
    markdownTemplateEngine: "njk",
  };
};

async function imageShortcode(
  src,
  alt = "",
  widths = [400, 800, 1280],
  formats = ["webp", "jpeg"],
  sizes = "100vw"
) {
  const isRelative = !/^(\/|https?:\/\/)/.test(src);
  const absoluteSrc = isRelative
    ? path.join(this.page.inputPath, "..", src)
    : src;

  const stats = await new Image(absoluteSrc, {
    widths: [...widths, null],
    formats: [...formats, null],
    svgShortCircuit: true,
    urlPath: "/assets/img",
    outputDir: "./_site/assets/img",
  });
  return Image.generateHTML(stats, {
    alt: mdStrip.renderInline(alt),
    sizes,
  });
}

function normalizePageId(pageId = '') {
  // if (pageId) console.log(pageId)
  return pageId.replace(/\-/g, '')
}