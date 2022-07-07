const htmlmin = require("html-minifier");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const MarkdownIt = require("markdown-it");
const { removeMdPlugin } = require("markdown-it-remove");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const excerptFilter = require("./plugins/excerpt");

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  typographer: true,
};

const md = new MarkdownIt(MARKDOWN_OPTIONS);
const mdStrip = new MarkdownIt(MARKDOWN_OPTIONS).use(removeMdPlugin, {});

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

  eleventyConfig.addFilter("excerpt", excerptFilter(md, ["<!-- excerpt -->", "<p>---</p>", "</p>"]));
  /**
   * Shortcodes
   */
  eleventyConfig.addPairedShortcode("figure", function (content, caption = "") {
    return `<figure>${md.renderInline(
      content.trim()
    )}${caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : ""}</figure>`;
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
  // let lowestSrc = stats["jpeg"][0];

  // const srcset = Object.keys(stats).reduce(
  //   (acc, format) => ({
  //     ...acc,
  //     [format]: stats[format].reduce(
  //       (_acc, curr) => `${_acc} ${curr.srcset} ,`,
  //       ""
  //     ),
  //   }),
  //   {}
  // );

  // const source = `<source type="image/webp" srcset="${srcset["webp"]}" >`;

  // const img = `<img
  //   loading="lazy"
  //   ${alt ? `alt="${alt}"` : ""}
  //   src="${lowestSrc.url}"
  //   sizes='(min-width: 1024px) 1024px, 100vw'
  //   srcset="${srcset["jpeg"]}"
  //   width="${lowestSrc.width}"
  //   height="${lowestSrc.height}">`;

  // return `<div class="image-wrapper"><picture> ${source} ${img} </picture></div>`;
  return Image.generateHTML(stats, {
    alt: mdStrip.renderInline(alt),
    sizes,
  });
}
