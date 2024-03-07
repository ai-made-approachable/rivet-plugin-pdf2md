import fs from 'fs';
import { NodeHtmlMarkdown } from '@crosstype/node-html-markdown';

export async function convertHTMLToMd(filePath: string): Promise<string> {

  const htmlBuffer = fs.readFileSync(filePath);

  try {
    const text = await NodeHtmlMarkdown.translate(
      /* html */ htmlBuffer, 
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