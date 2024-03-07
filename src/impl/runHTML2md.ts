import fs from 'fs';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export async function convertHTMLToMd(filePath: string): Promise<string> {

  const htmlBuffer = fs.readFileSync(filePath);

  try {
    const text = NodeHtmlMarkdown.translate(
      /* html */ htmlBuffer.toString(), // Convert htmlBuffer to string
      /* options (optional) */ {},
      /* customTranslators (optional) */ undefined,
      /* customCodeBlockTranslators (optional) */ undefined
    );
    return text;
  } catch (err) {
    console.error(err);
    return '';
  }
}