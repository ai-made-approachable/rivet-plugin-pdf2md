import fs from 'fs';
import pdf2md from '@opendocsg/pdf2md';

export async function convertPdfToMd(filePath: string): Promise<string> {
  const pdfBuffer = fs.readFileSync(filePath);

  try {
    const text = await pdf2md(pdfBuffer);
    return text;
  } catch (err) {
    console.error(err);
    return '';
  }
}