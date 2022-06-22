const htmlmin = require("html-minifier");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const MarkdownIt = require("markdown-it");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  typographer: true,
};

const md = new MarkdownIt(MARKDOWN_OPTIONS);

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
    'src/**/*.(png|jpg|jpeg|gif|svg|webp|avif)'
  );

  eleventyConfig.addPassthroughCopy("assets/fonts");

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(syntaxHighlight);

  /**
   * Frontmatter stuff
   */
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });

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

  /**
   * Shortcodes
   */
  eleventyConfig.addPairedShortcode("figure", (content, caption) => {
    console.log("Verbosely logging", content);
    console.log(md.renderInline(content));
    return `<figure>${md.renderInline(
      content.trim()
    )}<figcaption>${caption}</figcaption></figure>`;
  });

  return {
    dir: {
      input: "src",
      data: "../_data",
      layouts: "_includes/layouts",
    },
    markdownTemplateEngine: "njk",
  };
};
