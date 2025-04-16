"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { generatePDF } from "@/lib/generate-pdf"
import { useToast } from "@/components/ui/use-toast"

interface SlidePreviewProps {
  slides: any[]
  template: string
  customStyles?: any
}

export default function SlidePreview({ slides, template, customStyles }: SlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { toast } = useToast()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1))
  }

  const handleDownload = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Your slides are being prepared for download...",
      })

      await generatePDF(slides, template, customStyles)

      toast({
        title: "Download complete",
        description: "Your slides have been downloaded as a PDF.",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Download failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Apply template styles
  const getTemplateStyles = () => {
    const baseStyles = {
      modern: {
        container: "bg-white text-slate-900",
        title: "text-3xl font-bold mb-4 text-slate-900",
        content: "text-lg text-slate-700",
      },
      corporate: {
        container: "bg-slate-100 text-slate-900",
        title: "text-3xl font-bold mb-4 text-slate-800 border-b-2 border-slate-800 pb-2",
        content: "text-lg text-slate-700",
      },
      creative: {
        container: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
        title: "text-3xl font-bold mb-4 text-white",
        content: "text-lg text-white",
      },
      academic: {
        container: "bg-slate-200 text-slate-900 border-t-8 border-slate-700",
        title: "text-3xl font-bold mb-4 text-slate-900",
        content: "text-lg text-slate-800",
      },
    }[template] || {
      container: "bg-white text-slate-900",
      title: "text-3xl font-bold mb-4 text-slate-900",
      content: "text-lg text-slate-700",
    }

    // Apply custom styles if provided
    if (customStyles) {
      // Custom background color
      if (customStyles.backgroundColor) {
        baseStyles.container = `bg-[${customStyles.backgroundColor}] text-slate-900`
      }

      // Custom text color
      if (customStyles.textColor) {
        baseStyles.title = baseStyles.title.replace(/text-[a-z]+-[0-9]+/, `text-[${customStyles.textColor}]`)
        baseStyles.content = baseStyles.content.replace(/text-[a-z]+-[0-9]+/, `text-[${customStyles.textColor}]`)
      }

      // Custom font size
      if (customStyles.fontSize) {
        baseStyles.content = baseStyles.content.replace(/text-lg/, `text-${customStyles.fontSize}`)
      }
    }

    return baseStyles
  }

  const styles = getTemplateStyles()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Preview Your Slides</h2>
          <p className="text-slate-600 dark:text-slate-300">Navigate through your slides and download when ready.</p>

          <div className="relative">
            <div className={`aspect-[16/9] ${styles.container} p-12 rounded-lg shadow-lg`}>
              {slides[currentSlide] && (
                <>
                  <h3 className={styles.title}>{slides[currentSlide].title}</h3>
                  <div className={styles.content}>
                    {slides[currentSlide].content.map((paragraph: string, idx: number) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="bg-white/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center justify-center bg-white/80 backdrop-blur-sm px-3 rounded-md text-sm">
                {currentSlide + 1} / {slides.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="bg-white/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}
