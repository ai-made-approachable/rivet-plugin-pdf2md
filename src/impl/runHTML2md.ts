import fs from 'fs';
import TurndownService from '@mixmark-io/turndown;

export async function convertHTMLToMd(filePath: string): Promise<string> {

  const htmlBuffer = fs.readFileSync(filePath);

  try {
    const text = await TurndownService.turndown(htmlBuffer)
    return text;
  } catch (err) {
    console.error(err);
    return '';
  }
}