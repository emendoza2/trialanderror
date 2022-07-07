module.exports = function excerptFilter(markdown, separators = ["</p>"]) {
  return function (item) {
    const excerpt = item.data?.excerpt;

    // If it has an explicit excerpt (see setFrontMatterParsingOptions),
    // use it.
    if (excerpt) {
      return markdown.renderInline(excerpt);
    }

    // If there's no explicit excerpt, use the first paragraph as the
    // excerpt. This is already parsed to HTML, so no need to use
    // markdown-it here
    let location,
      separator,
      i = 0;
    while (i < separators.length && (!location || location < 0)) {
      separator = separators[i];
      location = item.templateContent?.indexOf(separator);
      i++;
    }
    return location >= 0
      ? item.templateContent.slice(0, location + separator.length)
      : "";
  };
};
