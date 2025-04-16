"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface SlideData {
  title: string
  content: string[]
}

export async function generatePDF(slides: SlideData[], template: string, customStyles?: any): Promise<void> {
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Create a temporary container for rendering slides
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.width = "297mm" // A4 landscape width
  container.style.height = "210mm" // A4 landscape height
  document.body.appendChild(container)

  try {
    // Apply template styles
    const templateStyles = getTemplateStyles(template, customStyles)

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      // Create slide element
      const slideElement = document.createElement("div")
      slideElement.className = "slide"
      slideElement.style.width = "100%"
      slideElement.style.height = "100%"
      slideElement.style.padding = "20mm"
      slideElement.style.boxSizing = "border-box"

      // Apply template-specific styles
      Object.assign(slideElement.style, templateStyles.slide)

      // Add title
      const titleElement = document.createElement("h1")
      titleElement.textContent = slide.title
      Object.assign(titleElement.style, templateStyles.title)
      slideElement.appendChild(titleElement)

      // Add content
      slide.content.forEach((paragraph) => {
        const paragraphElement = document.createElement("p")
        paragraphElement.textContent = paragraph
        Object.assign(paragraphElement.style, templateStyles.content)
        slideElement.appendChild(paragraphElement)
      })

      // Add slide to container
      container.innerHTML = ""
      container.appendChild(slideElement)

      // Convert slide to canvas
      const canvas = await html2canvas(slideElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      })

      // Add to PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0)

      if (i > 0) {
        pdf.addPage()
      }

      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210)
    }

    // Save the PDF
    pdf.save("presentation.pdf")
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}

function getTemplateStyles(template: string, customStyles?: any) {
  const defaultStyles = {
    modern: {
      slide: {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#333333",
      },
      title: {
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#333333",
      },
      content: {
        fontSize: "18px",
        lineHeight: "1.5",
        marginBottom: "15px",
        color: "#555555",
      },
    },
    corporate: {
      slide: {
        fontFamily: "Georgia, serif",
        backgroundColor: "#f5f5f5",
        color: "#333333",
      },
      title: {
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#003366",
        borderBottom: "2px solid #003366",
        paddingBottom: "10px",
      },
      content: {
        fontSize: "18px",
        lineHeight: "1.5",
        marginBottom: "15px",
        color: "#333333",
      },
    },
    creative: {
      slide: {
        fontFamily: "Helvetica, sans-serif",
        background: "linear-gradient(135deg, #f06, #9f6)",
        color: "#ffffff",
      },
      title: {
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#ffffff",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
      },
      content: {
        fontSize: "18px",
        lineHeight: "1.5",
        marginBottom: "15px",
        color: "#ffffff",
      },
    },
    academic: {
      slide: {
        fontFamily: "Georgia, serif",
        backgroundColor: "#ffffff",
        color: "#333333",
        borderTop: "16px solid #333333",
      },
      title: {
        fontSize: "30px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#333333",
      },
      content: {
        fontSize: "18px",
        lineHeight: "1.6",
        marginBottom: "15px",
        color: "#333333",
      },
    },
  }

  // Get base styles for the selected template
  const baseStyles = defaultStyles[template as keyof typeof defaultStyles] || defaultStyles.modern

  // Apply custom styles if provided
  if (customStyles) {
    return {
      slide: { ...baseStyles.slide, ...customStyles.slide },
      title: { ...baseStyles.title, ...customStyles.title },
      content: { ...baseStyles.content, ...customStyles.content },
    }
  }

  return baseStyles
}
