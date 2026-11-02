import { loadPdfJs } from "./pdfjs";

export async function extractResumeText(file: File): Promise<string> {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    const pageTexts: string[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ");
        pageTexts.push(pageText);
    }

    return pageTexts.join("\n");
}
