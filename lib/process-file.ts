import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function processFileContent(content: string, fileType: string, template: string) {
  // For PDF files, content will be an ArrayBuffer
  const textContent = content

  try {
    // Use AI to generate slide content
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Create a presentation based on the following content. 
        Format your response as a JSON array of slide objects, where each slide has a "title" and "content" property.
        The "content" property should be an array of paragraphs.
        Make sure the presentation is well-structured with an introduction, main points, and conclusion.
        Use the ${template} style for tone and formatting.
        Content: ${textContent.substring(0, 8000)}
      `,
    })

    // Parse the JSON response
    try {
      const slides = JSON.parse(text)
      return slides
    } catch (error) {
      console.error("Error parsing AI response:", error)
      // Fallback in case the AI doesn't return valid JSON
      return [
        {
          title: "Generated Presentation",
          content: [text.split("\n\n")[0] || "Content could not be processed correctly."],
        },
      ]
    }
  } catch (error) {
    console.error("Error processing content:", error)
    throw new Error("Failed to process content")
  }
}
