import * as pdfjs from "pdfjs-dist"
import type { TextItem } from "pdfjs-dist/types/src/display/api"

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export async function extractTextFromPDF(pdfData: ArrayBuffer): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise

    let fullText = ""

    // Iterate through each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()

      // Extract text from the page
      const pageText = textContent.items.map((item: TextItem) => item.str).join(" ")

      fullText += pageText + "\n\n"
    }

    return fullText
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw new Error("Failed to extract text from PDF")
  }
}
