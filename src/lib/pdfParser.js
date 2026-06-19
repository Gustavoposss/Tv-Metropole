import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { parsearItens, compararGrade } from './gradeParser';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Extrai todos os itens de texto do PDF com suas coordenadas (x, y, largura, página)
export const extrairItens = async (arquivo) => {
  const buffer = await arquivo.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const itens = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    for (const it of content.items) {
      if (!it.str || !it.str.trim()) continue;
      itens.push({
        page: p,
        x: it.transform[4],
        y: it.transform[5],
        width: it.width || 0,
        str: it.str,
      });
    }
  }

  return itens;
};

export const lerGradePdf = async (arquivo) => {
  const itens = await extrairItens(arquivo);
  return parsearItens(itens);
};

export { compararGrade };
