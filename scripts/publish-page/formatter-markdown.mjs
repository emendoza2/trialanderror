const formatters = {
  paragraph({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(formatRichText(rich_text));
    isLast && writeLine('');
  },
  heading_1({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`# ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  heading_2({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`## ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  heading_3({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`### ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  bulleted_list_item({ block, prev, writeLine, getConfig }) {
    const { rich_text } = getConfig(block);

    if (prev && !prev.type.includes('list_item')) {
      writeLine('');
    }

    writeLine(`- ${formatRichText(rich_text)}`);
  },
  numbered_list_item({ block, prev, writeLine, getConfig }) {
    const { rich_text } = getConfig(block);

    if (prev && !prev.type.includes('list_item')) {
      writeLine('');
    }

    writeLine(`1. ${formatRichText(rich_text)}`);
  },
  code({ block, writeLine, isLast, getConfig }) {
    const { rich_text, language } = getConfig(block);

    writeLine('');
    writeLine('```' + language);
    writeLine(formatRichText(rich_text, true));
    writeLine('```');
    isLast && writeLine('');
  },
  image({ block, writeLine, isLast, getConfig }) {
    const { caption, type, [type]: config } = getConfig(block);
    const captionEscaped = escape(formatRichText(caption), '"')

    writeLine('');
    writeLine(caption && caption.length ? `{% figure "${captionEscaped}" %}{% image "${config.name}", "${captionEscaped}" %}{% endfigure %}` : `{% image "${config.name}" %}`);
    isLast && writeLine('');
  },
  // TODO: support multiple types of callouts
  callout({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine('{% aside %}');
    writeLine(formatRichText(rich_text));
    writeLine('{% endaside %}');
    isLast && writeLine('');
  },
  quote({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`> ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  table({ block, writeLine, getConfig }) {
    const { has_row_header: has_column_header, has_column_header: has_row_header, table_width } = getConfig(block);
    if (has_row_header && !has_column_header) return { indents: false };
    writeLine('')
    writeLine('<table>')
    return { close() { 
      writeLine('</table>')
      writeLine('')
    } }
  },
  table_row({ block, parent, isFirst, writeLine, getConfig }) {
    // HASSLE! BUG! The column_header and row_header meanings are reversed in the API. 7/7/22.
    const { has_row_header: has_column_header, has_column_header: has_row_header, table_width } = getConfig(parent);

    const { cells } = block.table_row;

    // Just because OCD... a normal markdown table generator format
    if (has_row_header && !has_column_header) {
      writeLine(`| ${cells.map(formatRichText).join(' | ')} |`)
      isFirst && writeLine("|---".repeat(table_width)+"|")  
      return;
    }

    writeLine(`<tr>${cells.map((rich_text, i) => {
      const tag = ((isFirst && has_row_header) || (i === 0 && has_column_header)) ? "th" : "td";
      return `<${tag}>${formatRichText(rich_text)}</${tag}>`
    }).join('')}</tr>`);
  },
};

function frontMatter({ title, date, excerpt, tags, pageId }) {
  return `---
title: "${title.title.map(({ plain_text }) => plain_text).join('')}"
date: ${date.date?.start || today()}${excerpt ? `
excerpt: ${formatRichText(excerpt.rich_text)}`: ``}
pageId: ${pageId}
tags:
${tags.multi_select.map(({ name }) => `  - ${name}`).join('\n')}
---`;
}

function formatRichText(richTextObjects = [], pre = false) {
  // if (/\\/.test(JSON.stringify(richTextObjects))) console.log(richTextObjects)
  return richTextObjects
    .map(({ type, [type]: config, annotations }, i) => {
      if (type !== 'text' && type !== 'equation' && type !== 'mention' || (type === 'mention' && config.type !== 'page')) {
        return ''; // TODO: support `mention` and `equation`
      }

      const prev = richTextObjects[i - 1];
      const next = richTextObjects[i + 1];

      const formatFromConfig = createFormatFactory(
        config,
        prev?.[prev?.type],
        next?.[next?.type]
      );
      const formatFromAnnotations = createFormatFactory(
        annotations,
        prev?.annotations,
        next?.annotations
      );

      const page = formatFromConfig('page', '', `{% mentionPageId "${config.page?.id}" %}`);
      const link = formatFromConfig('link', '[', `](${config.link?.url})`);
      const bold = formatFromAnnotations('bold', '**');
      const italic = formatFromAnnotations('italic', '*');
      const strikethrough = formatFromAnnotations('strikethrough', '~~');
      const underline = formatFromAnnotations('underline', '<u>', '</u>');
      const code = formatFromAnnotations('code', '`');
      const equation = formatFromConfig('expression', "$", "$");
      const newlines = (content) => pre ? content : escape(content, "\n");

      // applied in reverse order
      const formatter = compose(
        page,
        link,
        bold,
        italic,
        strikethrough,
        underline,
        code,
        equation,
        newlines
      );

      return formatter(config.content || config.expression || '');
    })
    .join('');
}

function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

function createFormatFactory(current, prev, next) {
  return (key, startToken, endToken = startToken) => {
    const pre = current[key] && !prev?.[key] ? startToken : '';
    const post = current[key] && !next?.[key] ? endToken : '';

    return (content) => `${pre}${content}${post}`;
  };
}

function today() {
  const [date] = new Date().toISOString().split('T');

  return date;
}

function escape(str, token) {
  return str.replace(new RegExp(token, "g"), (s) => "\\" + s);
}

export { formatters, frontMatter };
